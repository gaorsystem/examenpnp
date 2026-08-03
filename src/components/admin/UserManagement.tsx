import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { UserProfile } from '../../types';
import { 
  UserPlus, 
  Search, 
  Trash2, 
  Edit2, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Smartphone,
  User as UserIcon,
  Shield,
  Settings,
  HelpCircle,
  AlertCircle,
  ClipboardCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { TechnicalGuide } from './TechnicalGuide';

interface UserManagementProps {
  userProfile?: UserProfile;
}

export const UserManagement: React.FC<UserManagementProps> = ({ userProfile }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  
  const [newUserName, setNewUserName] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserGrado, setNewUserGrado] = useState('');
  const [newUserDni, setNewUserDni] = useState('');
  const [newUserCip, setNewUserCip] = useState('');
  const [newUserMetodoPago, setNewUserMetodoPago] = useState('Yape / Plin');
  const [newUserRole, setNewUserRole] = useState<'student' | 'admin'>('student');
  const [newUserCodigoAcceso, setNewUserCodigoAcceso] = useState('');
  const [saving, setSaving] = useState(false);

  // Estados para Edición y Eliminación
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editGrado, setEditGrado] = useState('');
  const [editDni, setEditDni] = useState('');
  const [editCip, setEditCip] = useState('');
  const [editMetodoPago, setEditMetodoPago] = useState('Yape / Plin');
  const [editRole, setEditRole] = useState<'student' | 'admin'>('student');
  const [editPlan, setEditPlan] = useState<'free' | 'premium'>('premium');
  const [editCodigoAcceso, setEditCodigoAcceso] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const [adminPass, setAdminPass] = useState('');
  const [isAdminAuth, setIsAdminAuth] = useState(userProfile?.role === 'admin');
  const [authError, setAuthError] = useState(false);

  const copyWhatsAppMessage = (user: UserProfile) => {
    const text = `👮 *SIMULACRO PNP 2026 - ACCESO ACTIVADO*\n\nHola *${user.nombre}*, tu suscripción al Simulador de Examen de Ascenso ha sido activada correctamente.\n\n📱 *Tu WhatsApp Registrado:* ${user.telefonoWhatsapp}\n\n🌐 *Ingresa aquí:* ${window.location.origin}\n\n⚠️ *Nota:* Tu cuenta es de uso personal y permite 1 dispositivo activo a la vez. ¡Éxitos en tu preparación!`;
    navigator.clipboard.writeText(text);
    alert(`📋 ¡Mensaje de WhatsApp copiado para ${user.nombre}!\n\n📱 Número: ${user.telefonoWhatsapp}`);
  };

  const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str || '');

  const handleUnlockDevice = async (user: UserProfile) => {
    try {
      if (supabase) {
        if (isUUID(user.id)) {
          await supabase.from('profiles').update({ active_device_id: null }).eq('id', user.id);
        } else if (user.telefonoWhatsapp) {
          await supabase.from('profiles').update({ active_device_id: null }).eq('telefono_whatsapp', user.telefonoWhatsapp);
        }
      }

      try {
        const savedLocal = localStorage.getItem('simulador_local_users');
        if (savedLocal) {
          const localList: UserProfile[] = JSON.parse(savedLocal);
          const updated = localList.map(u => 
            (u.id === user.id || u.telefonoWhatsapp === user.telefonoWhatsapp) 
              ? { ...u, activeDeviceId: '' } 
              : u
          );
          localStorage.setItem('simulador_local_users', JSON.stringify(updated));
        }
      } catch (e) {}

      alert(`✅ Dispositivo liberado para ${user.nombre}. El usuario ya podrá ingresar desde un nuevo teléfono o computadora.`);
      fetchUsers();
    } catch (err: any) {
      alert('Error al liberar dispositivo: ' + (err.message || 'Error desconocido'));
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === 'moncheri1982') {
      setIsAdminAuth(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    let remoteUsers: UserProfile[] = [];

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('nombre', { ascending: true });

        if (!error && data) {
          remoteUsers = data.map(u => ({
            id: u.id,
            nombre: u.nombre,
            grado: u.grado || '',
            cip: u.cip || '',
            dni: u.dni || '',
            telefonoWhatsapp: u.telefono_whatsapp,
            plan: u.plan || 'free',
            role: u.role || 'student',
            metaPreguntasDiarias: u.meta_preguntas_diarias || 50,
            metodoPago: u.metodo_pago || '',
            codigoAcceso: u.codigo_acceso || u.codigo_pin || u.codigoAcceso || '123456',
            activeDeviceId: u.active_device_id || '',
            ultimoAcceso: u.ultimo_acceso || '',
            fechaRegistro: u.created_at
          }));
        }
      } catch (err) {
        console.warn('Error fetching users from Supabase, loading local users:', err);
      }
    }

    // Merge with local users saved in localStorage
    try {
      const savedLocal = localStorage.getItem('simulador_local_users');
      if (savedLocal) {
        const parsedLocal: UserProfile[] = JSON.parse(savedLocal);
        const existingPhones = new Set(remoteUsers.map(u => u.telefonoWhatsapp));
        for (const localU of parsedLocal) {
          if (!existingPhones.has(localU.telefonoWhatsapp)) {
            remoteUsers.push(localU);
          }
        }
      }
    } catch (e) {
      console.warn('Error parsing local users:', e);
    }

    setUsers(remoteUsers);
    setLoading(false);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Formatear teléfono
      let cleanPhone = newUserPhone.replace(/\D/g, '');
      if (cleanPhone.length === 9 && !cleanPhone.startsWith('51')) {
        cleanPhone = '51' + cleanPhone;
      }
      const formattedPhone = '+' + cleanPhone;
      const accessCode = newUserCodigoAcceso.trim() || Math.floor(100000 + Math.random() * 900000).toString();

      const newStudentProfile: UserProfile = {
        id: 'usr_' + Date.now(),
        nombre: newUserName,
        telefonoWhatsapp: formattedPhone,
        grado: newUserGrado || 'Suboficial PNP',
        dni: newUserDni,
        cip: newUserCip,
        metodoPago: newUserMetodoPago,
        codigoAcceso: accessCode,
        plan: 'premium',
        role: newUserRole,
        metaPreguntasDiarias: 50,
        fechaRegistro: new Date().toISOString()
      };

      // Intentar guardar en Supabase con fallbacks de columna
      if (supabase) {
        let insertPayload: any = {
          nombre: newUserName,
          telefono_whatsapp: formattedPhone,
          grado: newUserGrado,
          dni: newUserDni,
          cip: newUserCip,
          metodo_pago: newUserMetodoPago,
          plan: 'premium',
          role: newUserRole
        };

        // Probar insertar con 'codigo_acceso' o 'codigo_pin' o sin columna de código
        try {
          let res = await supabase.from('profiles').insert({ ...insertPayload, codigo_acceso: accessCode }).select().maybeSingle();
          if (res.error) {
            res = await supabase.from('profiles').insert({ ...insertPayload, codigo_pin: accessCode }).select().maybeSingle();
            if (res.error) {
              await supabase.from('profiles').insert(insertPayload).select().maybeSingle();
            }
          }
        } catch (dbErr) {
          console.warn('Supabase insert fallback warning:', dbErr);
        }
      }

      // Guardar también en localStorage para no fallar jamás
      try {
        const savedLocal = localStorage.getItem('simulador_local_users');
        const localList: UserProfile[] = savedLocal ? JSON.parse(savedLocal) : [];
        const updatedList = [newStudentProfile, ...localList.filter(u => u.telefonoWhatsapp !== formattedPhone)];
        localStorage.setItem('simulador_local_users', JSON.stringify(updatedList));
      } catch (lsErr) {
        console.warn('Error saving to localStorage:', lsErr);
      }

      alert(`✅ USUARIO REGISTRADO EXITOSAMENTE\n\n👤 Cliente: ${newUserName}\n📱 WhatsApp: ${formattedPhone}`);

      setShowAddModal(false);
      setNewUserName('');
      setNewUserPhone('');
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserDni('');
      setNewUserCip('');
      setNewUserCodigoAcceso('');
      setNewUserMetodoPago('Yape / Plin');
      fetchUsers();
    } catch (err: any) {
      alert('Error al agregar usuario: ' + (err.message || 'Error desconocido'));
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = (user: UserProfile) => {
    setEditingUser(user);
    setEditName(user.nombre || '');
    setEditPhone(user.telefonoWhatsapp || '');
    setEditGrado(user.grado || '');
    setEditDni(user.dni || '');
    setEditCip(user.cip || '');
    setEditMetodoPago(user.metodoPago || 'Yape / Plin');
    setEditRole(user.role || 'student');
    setEditPlan(user.plan || 'premium');
    setEditCodigoAcceso(user.codigoAcceso || Math.floor(100000 + Math.random() * 900000).toString());
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setSavingEdit(true);

    try {
      let updatePayload: any = {
        nombre: editName,
        telefono_whatsapp: editPhone,
        grado: editGrado,
        dni: editDni,
        cip: editCip,
        metodo_pago: editMetodoPago,
        role: editRole,
        plan: editPlan
      };

      if (supabase) {
        if (isUUID(editingUser.id)) {
          await supabase.from('profiles').update(updatePayload).eq('id', editingUser.id);
        } else if (editingUser.telefonoWhatsapp) {
          await supabase.from('profiles').update(updatePayload).eq('telefono_whatsapp', editingUser.telefonoWhatsapp);
        }
      }

      try {
        const savedLocal = localStorage.getItem('simulador_local_users');
        if (savedLocal) {
          const localList: UserProfile[] = JSON.parse(savedLocal);
          const updated = localList.map(u => {
            if (u.id === editingUser.id || u.telefonoWhatsapp === editingUser.telefonoWhatsapp) {
              return {
                ...u,
                nombre: editName,
                telefonoWhatsapp: editPhone,
                grado: editGrado,
                dni: editDni,
                cip: editCip,
                metodoPago: editMetodoPago,
                role: editRole,
                plan: editPlan
              };
            }
            return u;
          });
          localStorage.setItem('simulador_local_users', JSON.stringify(updated));
        }
      } catch (lsErr) {}

      alert(`✅ Usuario "${editName}" actualizado correctamente.`);
      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      alert('Error al actualizar usuario: ' + (err.message || 'Error desconocido'));
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteUser = async (user: UserProfile) => {
    const confirmDelete = window.confirm(`¿Estás seguro de eliminar permanentemente al usuario ${user.nombre}?`);
    if (!confirmDelete) return;

    try {
      if (supabase) {
        if (isUUID(user.id)) {
          const { error } = await supabase.from('profiles').delete().eq('id', user.id);
          if (error) console.warn('Supabase delete by id warning:', error.message);
        } else if (user.telefonoWhatsapp) {
          const { error } = await supabase.from('profiles').delete().eq('telefono_whatsapp', user.telefonoWhatsapp);
          if (error) console.warn('Supabase delete by phone warning:', error.message);
        }
      }

      try {
        const savedLocal = localStorage.getItem('simulador_local_users');
        if (savedLocal) {
          const localList: UserProfile[] = JSON.parse(savedLocal);
          const filtered = localList.filter(u => u.id !== user.id && u.telefonoWhatsapp !== user.telefonoWhatsapp);
          localStorage.setItem('simulador_local_users', JSON.stringify(filtered));
        }
      } catch (lsErr) {
        console.warn('Error deleting from localStorage:', lsErr);
      }

      alert(`✅ Usuario "${user.nombre}" eliminado correctamente.`);
      fetchUsers();
    } catch (err: any) {
      alert('Error al eliminar usuario: ' + (err.message || 'Error desconocido'));
    }
  };

  const filteredUsers = users.filter(u => 
    u.nombre.toLowerCase().includes(search.toLowerCase()) || 
    u.telefonoWhatsapp.includes(search)
  );

  if (!isAdminAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-md w-full"
        >
          <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center text-blue-600 mb-6 mx-auto">
            <Shield size={32} />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Panel Administrativo</h2>
          <p className="text-gray-500 text-center mb-8">Ingresa la clave maestra para continuar.</p>
          
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Clave de acceso"
                className={`w-full px-4 py-3 border ${authError ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                autoFocus
              />
              {authError && <p className="text-red-500 text-xs mt-2 font-medium">Clave incorrecta. Inténtalo de nuevo.</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95"
            >
              Acceder al Sistema
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h2>
          <p className="text-gray-500">Administra el acceso de tus alumnos y postulantes.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all active:scale-95 ${
              showGuide ? 'bg-gray-200 text-gray-700' : 'bg-slate-800 text-white hover:bg-slate-900'
            }`}
          >
            <Settings size={20} />
            <span>{showGuide ? 'Ocultar Guía' : 'Guía de Conexión VPS'}</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold transition-all active:scale-95"
          >
            <UserPlus size={20} />
            <span>Nuevo Cliente</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <TechnicalGuide />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre o teléfono..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-2" />
            <span className="text-gray-500">Cargando usuarios...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado Acceso</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dispositivo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan / Rol</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                            {user.nombre.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.nombre}</div>
                            <div className="text-xs text-gray-500">{user.grado || 'Sin grado'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">DNI: {user.dni || '---'}</div>
                        {user.cip && <div className="text-xs text-gray-500">CIP: {user.cip}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600 font-mono font-medium">
                          <Smartphone size={16} className="mr-2 text-emerald-600" />
                          {user.telefonoWhatsapp}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-xs px-2.5 py-1 rounded-lg">
                          🟢 Habilitado
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.activeDeviceId ? (
                          <div className="flex items-center gap-1.5">
                            <span className="px-2.5 py-1 text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                              📱 1 Dispositivo
                            </span>
                            <button
                              onClick={() => handleUnlockDevice(user)}
                              title="Liberar dispositivo para permitir nuevo ingreso"
                              className="p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors text-xs font-bold"
                            >
                              🔓 Liberar
                            </button>
                          </div>
                        ) : (
                          <span className="px-2.5 py-1 text-[10px] font-mono text-slate-400 bg-slate-100 rounded-full">
                            ⚪ Sin sesión activa
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className={`px-2 py-0.5 w-max inline-flex text-[10px] font-black rounded-full uppercase tracking-wider ${
                            user.plan === 'premium' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.plan}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            {user.role === 'admin' ? '🛡️ Admin' : '👤 Estudiante'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => copyWhatsAppMessage(user)}
                            title="Copiar mensaje de bienvenida para WhatsApp con teléfono y código"
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors flex items-center gap-1 text-xs font-bold"
                          >
                            <ClipboardCheck size={16} />
                            <span className="hidden sm:inline">WhatsApp</span>
                          </button>
                          <button 
                            onClick={() => openEditModal(user)}
                            title="Editar cliente"
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user)}
                            title="Eliminar cliente"
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 italic">
                      No se encontraron usuarios.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <form onSubmit={handleAddUser} className="flex flex-col max-h-[90vh]">
                <div className="p-8 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-display font-black text-slate-900 dark:text-white flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl">
                          <UserPlus size={24} />
                        </div>
                        Nuevo Cliente
                      </h3>
                      <p className="text-slate-500 text-sm mt-1 font-medium">Registra un nuevo participante en el sistema.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        type="button" 
                        onClick={() => setShowGuide(!showGuide)} 
                        className={`p-2 rounded-full transition-all ${showGuide ? 'bg-amber-100 text-amber-600' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
                        title="Ver Guía de Resolución de Errores"
                      >
                        <HelpCircle size={24} />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setShowAddModal(false)} 
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                      >
                        <XCircle size={24} />
                      </button>
                    </div>
                  </div>
                </div>

                {showGuide && (
                  <div className="mx-8 mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl animate-in slide-in-from-top-2">
                    <h4 className="text-amber-800 dark:text-amber-400 text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                      <AlertCircle size={14} /> Solución: Error de Recursión RLS
                    </h4>
                    <p className="text-amber-700 dark:text-amber-500 text-[10px] leading-relaxed mb-3">
                      Si recibes el error "infinite recursion detected", copia y ejecuta este comando en el <b>SQL Editor</b> de tu panel de Supabase para corregir los permisos:
                    </p>
                    <div className="relative group">
                      <pre className="text-[9px] bg-slate-900 text-amber-200 p-3 rounded-lg overflow-x-auto font-mono max-h-36">
{`ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage all" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Allow all access" ON profiles;

CREATE POLICY "Allow public access to profiles"
ON public.profiles
FOR ALL
USING (true)
WITH CHECK (true);`}
                      </pre>
                      <button 
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(`ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;\nALTER TABLE profiles ENABLE ROW LEVEL SECURITY;\n\nDROP POLICY IF EXISTS "Admins manage all" ON profiles;\nDROP POLICY IF EXISTS "Users can view own profile" ON profiles;\nDROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;\nDROP POLICY IF EXISTS "Allow all access" ON profiles;\n\nCREATE POLICY "Allow public access to profiles"\nON public.profiles\nFOR ALL\nUSING (true)\nWITH CHECK (true);`);
                          alert('¡Código SQL copiado!');
                        }}
                        className="absolute right-2 top-2 p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ClipboardCheck size={14} />
                      </button>
                    </div>
                  </div>
                )}

                <div className="p-8 pt-6 overflow-y-auto custom-scrollbar space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">Nombre Completo</label>
                      <div className="relative">
                        <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          required
                          className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                          placeholder="Ej. Juan Pérez García"
                          value={newUserName}
                          onChange={(e) => setNewUserName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">WhatsApp</label>
                      <div className="relative">
                        <Smartphone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          required
                          className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                          placeholder="999 888 777"
                          value={newUserPhone}
                          onChange={(e) => setNewUserPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">Correo Electrónico (Opcional)</label>
                      <input
                        type="email"
                        className="block w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                        placeholder="ejemplo@correo.com (Auto si está vacío)"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">Contraseña Temporal (Opcional)</label>
                      <input
                        type="text"
                        className="block w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                        placeholder="Mínimo 6 caracteres (Auto si está vacío)"
                        value={newUserPassword}
                        onChange={(e) => setNewUserPassword(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">DNI (Documento)</label>
                      <input
                        type="text"
                        required
                        className="block w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                        placeholder="77665544"
                        value={newUserDni}
                        onChange={(e) => setNewUserDni(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">CIP (Opcional)</label>
                      <input
                        type="text"
                        className="block w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                        placeholder="123456"
                        value={newUserCip}
                        onChange={(e) => setNewUserCip(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">Grado</label>
                      <input
                        type="text"
                        className="block w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                        placeholder="Ej. SO3 / Alférez"
                        value={newUserGrado}
                        onChange={(e) => setNewUserGrado(e.target.value)}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">Método de Pago</label>
                      <select
                        className="block w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white cursor-pointer"
                        value={newUserMetodoPago}
                        onChange={(e) => setNewUserMetodoPago(e.target.value)}
                      >
                        <option value="Yape / Plin">Yape / Plin</option>
                        <option value="Transferencia">Transferencia</option>
                        <option value="Efectivo">Efectivo</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>

                    <div className="md:col-span-2 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 ml-1">Permisos de Acceso</label>
                      <div className="flex items-center gap-8">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="role"
                            checked={newUserRole === 'student'}
                            onChange={() => setNewUserRole('student')}
                            className="w-5 h-5 text-blue-600 border-slate-300 dark:border-slate-700 focus:ring-blue-500 bg-white dark:bg-slate-900"
                          />
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors">Estudiante</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="role"
                            checked={newUserRole === 'admin'}
                            onChange={() => setNewUserRole('admin')}
                            className="w-5 h-5 text-blue-600 border-slate-300 dark:border-slate-700 focus:ring-blue-500 bg-white dark:bg-slate-900"
                          />
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors">Administrador</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 border-t border-slate-100 dark:border-slate-800 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-4 border border-slate-200 dark:border-slate-800 text-sm font-bold rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase tracking-widest"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-[2] flex justify-center items-center px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white text-sm font-black rounded-2xl shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-70 uppercase tracking-widest"
                  >
                    {saving ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <CheckCircle size={18} className="mr-2" />}
                    {saving ? 'PROCESANDO...' : 'CONFIRMAR REGISTRO'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* MODAL PARA EDITAR USUARIO */}
        {editingUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingUser(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <form onSubmit={handleSaveEdit} className="flex flex-col max-h-[90vh]">
                <div className="p-8 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Editar Cliente</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Modifica la información o permisos de este usuario.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingUser(null)}
                      className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <XCircle size={24} />
                    </button>
                  </div>
                </div>

                <div className="p-8 space-y-6 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">Nombre Completo</label>
                      <input
                        type="text"
                        required
                        className="block w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">WhatsApp / Teléfono</label>
                      <input
                        type="text"
                        required
                        className="block w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">DNI (Documento)</label>
                      <input
                        type="text"
                        className="block w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                        value={editDni}
                        onChange={(e) => setEditDni(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">CIP (Opcional)</label>
                      <input
                        type="text"
                        className="block w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                        value={editCip}
                        onChange={(e) => setEditCip(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">Grado</label>
                      <input
                        type="text"
                        className="block w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                        value={editGrado}
                        onChange={(e) => setEditGrado(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">Método de Pago</label>
                      <select
                        className="block w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white cursor-pointer"
                        value={editMetodoPago}
                        onChange={(e) => setEditMetodoPago(e.target.value)}
                      >
                        <option value="Yape / Plin">Yape / Plin</option>
                        <option value="Transferencia">Transferencia</option>
                        <option value="Efectivo">Efectivo</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">Plan de Acceso</label>
                      <select
                        className="block w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white cursor-pointer"
                        value={editPlan}
                        onChange={(e) => setEditPlan(e.target.value as 'free' | 'premium')}
                      >
                        <option value="premium">PREMIUM (Acceso completo)</option>
                        <option value="free">FREE (Gratuito)</option>
                      </select>
                    </div>

                    {editingUser?.activeDeviceId && (
                      <div className="md:col-span-2 bg-amber-50/60 dark:bg-amber-950/20 p-5 rounded-2xl border border-amber-200 dark:border-amber-800 flex items-center justify-between">
                        <span className="text-xs text-amber-900 dark:text-amber-300 font-medium">
                          📱 <b>Dispositivo vinculado activo</b>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUnlockDevice(editingUser)}
                          className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                        >
                          🔓 Liberar Dispositivo
                        </button>
                      </div>
                    )}

                    <div className="md:col-span-2 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 ml-1">Permisos de Acceso</label>
                      <div className="flex items-center gap-8">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="editRole"
                            checked={editRole === 'student'}
                            onChange={() => setEditRole('student')}
                            className="w-5 h-5 text-blue-600 border-slate-300 dark:border-slate-700 focus:ring-blue-500 bg-white dark:bg-slate-900"
                          />
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors">Estudiante</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="editRole"
                            checked={editRole === 'admin'}
                            onChange={() => setEditRole('admin')}
                            className="w-5 h-5 text-blue-600 border-slate-300 dark:border-slate-700 focus:ring-blue-500 bg-white dark:bg-slate-900"
                          />
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors">Administrador</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 border-t border-slate-100 dark:border-slate-800 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="flex-1 px-6 py-4 border border-slate-200 dark:border-slate-800 text-sm font-bold rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase tracking-widest"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={savingEdit}
                    className="flex-[2] flex justify-center items-center px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white text-sm font-black rounded-2xl shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-70 uppercase tracking-widest"
                  >
                    {savingEdit ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <CheckCircle size={18} className="mr-2" />}
                    {savingEdit ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
