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
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { TechnicalGuide } from './TechnicalGuide';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  
  const [newUserName, setNewUserName] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserGrado, setNewUserGrado] = useState('');
  const [newUserPlan, setNewUserPlan] = useState<'free' | 'premium'>('free');
  const [newUserRole, setNewUserRole] = useState<'student' | 'admin'>('student');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('nombre', { ascending: true });

      if (error) throw error;
      
      const formatted = (data || []).map(u => ({
        id: u.id,
        nombre: u.nombre,
        grado: u.grado || '',
        cip: u.cip || '',
        telefonoWhatsapp: u.telefono_whatsapp,
        plan: u.plan || 'free',
        role: u.role || 'student',
        metaPreguntasDiarias: u.meta_preguntas_diarias || 50,
        fechaRegistro: u.created_at
      }));

      setUsers(formatted);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);

    try {
      // Formatear teléfono para que coincida con el flujo de OTP
      let cleanPhone = newUserPhone.replace(/\D/g, '');
      if (cleanPhone.length === 9 && !cleanPhone.startsWith('51')) {
        cleanPhone = '51' + cleanPhone;
      }
      const formattedPhone = '+' + cleanPhone;

      const { data, error } = await supabase.from('profiles').insert({
        nombre: newUserName,
        telefono_whatsapp: formattedPhone,
        grado: newUserGrado,
        plan: newUserPlan,
        role: newUserRole,
        user_id: null // Explicitly null until they login
      });

      if (error) throw error;

      setShowAddModal(false);
      setNewUserName('');
      setNewUserPhone('');
      fetchUsers();
    } catch (err: any) {
      alert('Error al agregar usuario: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.nombre.toLowerCase().includes(search.toLowerCase()) || 
    u.telefonoWhatsapp.includes(search)
  );

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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
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
                        <div className="flex items-center text-sm text-gray-600">
                          <Smartphone size={16} className="mr-2 text-gray-400" />
                          {user.telefonoWhatsapp}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.plan === 'premium' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.plan.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          {user.role === 'admin' ? (
                            <>
                              <Shield size={14} className="mr-1 text-blue-600" />
                              <span className="text-blue-600 font-medium">Admin</span>
                            </>
                          ) : (
                            <span>Estudiante</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button className="text-gray-400 hover:text-blue-600">
                            <Edit2 size={18} />
                          </button>
                          <button className="text-gray-400 hover:text-red-600">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
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
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddModal(false)}
                className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              />
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              >
                <form onSubmit={handleAddUser} className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                      <UserPlus className="mr-2 text-blue-600" />
                      Registrar Nuevo Cliente
                    </h3>
                    <button type="button" onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                      <XCircle />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <UserIcon size={18} className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          required
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Juan Perez"
                          value={newUserName}
                          onChange={(e) => setNewUserName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Número de WhatsApp</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Smartphone size={18} className="text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          required
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="999888777"
                          value={newUserPhone}
                          onChange={(e) => setNewUserPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Grado</label>
                        <input
                          type="text"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="SO3 / Alferez"
                          value={newUserGrado}
                          onChange={(e) => setNewUserGrado(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                        <select
                          className="block w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={newUserPlan}
                          onChange={(e) => setNewUserPlan(e.target.value as any)}
                        >
                          <option value="free">FREE</option>
                          <option value="premium">PREMIUM</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="role"
                            value="student"
                            checked={newUserRole === 'student'}
                            onChange={() => setNewUserRole('student')}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">Estudiante</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="role"
                            value="admin"
                            checked={newUserRole === 'admin'}
                            onChange={() => setNewUserRole('admin')}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">Administrador</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-70"
                    >
                      {saving ? <Loader2 className="animate-spin h-5 w-5" /> : 'Registrar'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
