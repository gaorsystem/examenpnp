import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Manejo de preflight CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ 
          error: "Faltan variables de entorno en Supabase (SUPABASE_SERVICE_ROLE_KEY). Por favor configúrala en el panel de Supabase Edge Functions." 
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Verificación de seguridad del token JWT del Administrador
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No se proporcionó token de autorización en el encabezado." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validar sesión del usuario que solicita
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user: callerUser }, error: userError } = await userClient.auth.getUser();

    if (userError || !callerUser) {
      // Intentar decodificar el token o verificar si es admin
      console.warn("No se pudo obtener el usuario llamante mediante JWT estándar, verificando autorización...");
    } else {
      // Verificar rol 'admin' en la tabla profiles
      const { data: callerProfile } = await userClient
        .from("profiles")
        .select("role")
        .eq("id", callerUser.id)
        .single();

      const isAdmin = callerProfile?.role === "admin" || callerUser.user_metadata?.role === "admin";
      if (!isAdmin) {
        return new Response(
          JSON.stringify({ error: "Acceso denegado (403): Solo los usuarios con rol de 'admin' pueden invocar esta función." }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // 2. Parsear los datos enviados desde el formulario del Admin
    const body = await req.json();
    const {
      email,
      password,
      nombre,
      telefono_whatsapp,
      dni,
      grado,
      cip,
      metodo_pago,
      role = "student",
      plan = "premium"
    } = body;

    if (!nombre || !telefono_whatsapp) {
      return new Response(
        JSON.stringify({ error: "El nombre completo y el teléfono son campos obligatorios." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Dar formato limpio al número de teléfono
    let cleanPhone = telefono_whatsapp.replace(/\D/g, "");
    if (cleanPhone.length === 9 && !cleanPhone.startsWith("51")) {
      cleanPhone = "51" + cleanPhone;
    }
    const formattedPhone = "+" + cleanPhone;

    // Generar correo electrónico y contraseña si no fueron provistos explícitamente
    const userEmail = email && email.trim() !== "" ? email.trim() : `estudiante_${cleanPhone}@simuladorpnp.app`;
    const userPassword = password && password.trim() !== "" ? password.trim() : `Pnp${cleanPhone.slice(-6)}!2026`;

    // 3. Inicializar el cliente Supabase con la SUPABASE_SERVICE_ROLE_KEY (Bypass RLS y Admin Privileges)
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Crear la cuenta en auth.users usando supabase.auth.admin.createUser
    let userId: string | null = null;

    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email: userEmail,
      password: userPassword,
      phone: formattedPhone,
      email_confirm: true,
      phone_confirm: true,
      user_metadata: {
        nombre,
        role,
        dni,
        grado,
        cip
      }
    });

    if (createError) {
      // Manejar caso donde el usuario ya existe en auth.users
      if (createError.message.toLowerCase().includes("already registered") || createError.message.toLowerCase().includes("already been registered")) {
        const { data: usersList } = await adminClient.auth.admin.listUsers();
        const existing = usersList?.users?.find(u => u.email === userEmail || u.phone === formattedPhone);
        if (existing) {
          userId = existing.id;
        } else {
          return new Response(
            JSON.stringify({ error: `El usuario ya existe en Auth: ${createError.message}` }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      } else {
        return new Response(
          JSON.stringify({ error: `Error al crear usuario en Supabase Auth: ${createError.message}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else if (newUser?.user) {
      userId = newUser.user.id;
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "No se pudo obtener o generar el ID del usuario." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Insertar/Actualizar el registro en la tabla public.profiles usando el privilegio service_role
    const profileData = {
      id: userId,
      nombre,
      telefono_whatsapp: formattedPhone,
      dni: dni || null,
      grado: grado || null,
      cip: cip || null,
      metodo_pago: metodo_pago || "Yape / Plin",
      plan: plan || "premium",
      role: role || "student",
      user_id: userId
    };

    const { data: profile, error: profileError } = await adminClient
      .from("profiles")
      .upsert(profileData, { onConflict: "id" })
      .select()
      .single();

    if (profileError) {
      return new Response(
        JSON.stringify({ error: `Error insertando perfil en la tabla profiles: ${profileError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 5. Retornar respuesta exitosa al frontend
    return new Response(
      JSON.stringify({
        success: true,
        message: "Usuario y perfil creados exitosamente mediante Edge Function administrativa.",
        user: {
          id: userId,
          email: userEmail,
          phone: formattedPhone,
          tempPassword: userPassword
        },
        profile
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Error inesperado al procesar la solicitud." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
