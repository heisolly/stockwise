'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { UserRole, User } from '@/types';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  Mail,
  Shield,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  UserPlus,
  UserCheck,
  UserX,
  Search,
  Filter
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { StaffInvitation } from './StaffInvitation';

interface StaffFormData {
  name: string;
  email: string;
  role: UserRole;
}

export function StaffManager() {
  const { user: currentUser, businessProfile } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState<'staff' | 'invitations'>('staff');
  const [showAddForm, setShowAddForm] = useState(false);
  const [staff, setStaff] = useState<User[]>([]);
  const [isLoadingStaff, setIsLoadingStaff] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [editingStaff, setEditingStaff] = useState<User | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StaffFormData>();

  const fetchStaff = async () => {
    if (!businessProfile?.id) return;
    setIsLoadingStaff(true);
    try {
      const { data, error } = await supabase
        .from('users' as any)
        .select('*')
        .eq('business_id', businessProfile.id);
      
      if (error) throw error;
      
      // Transform database data to match User type
      const transformedStaff = (data as any[]).map((item: any) => ({
        id: item.id,
        businessId: item.business_id,
        name: item.name,
        email: item.email,
        role: item.role,
        isActive: item.is_active,
        lastLogin: item.last_login,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
      setStaff(transformedStaff);
    } catch (error: any) {
      toast.error('Failed to load staff members');
    } finally {
      setIsLoadingStaff(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [businessProfile?.id]);

  const onSubmit = async (data: StaffFormData) => {
    if (!businessProfile?.id) return;

    try {
      if (editingStaff) {
        // Update existing staff
        const { error } = await supabase
          .from('users' as any)
          .update({ name: data.name, role: data.role })
          .eq('id', editingStaff.id);
        
        if (error) throw error;
        toast.success('Staff member updated successfully');
        setEditingStaff(null);
      } else {
        // Add new staff member
        const tempPassword = Math.random().toString(36).slice(-8);
        
        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: tempPassword,
          options: {
            data: {
              name: data.name,
              role: data.role,
              business_id: businessProfile.id,
            }
          }
        });

        if (error) throw error;
        toast.success(`Staff member added! Temporary password: ${tempPassword}`);
      }
      
      reset();
      setShowAddForm(false);
      fetchStaff();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save staff member');
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    if (!confirm('Are you sure you want to remove this staff member?')) return;
    
    try {
      const { error } = await supabase
        .from('users' as any)
        .delete()
        .eq('id', staffId);
      
      if (error) throw error;
      toast.success('Staff member removed successfully');
      fetchStaff();
    } catch (error: any) {
      toast.error('Failed to remove staff member');
    }
  };

  const handleEditStaff = (staffMember: User) => {
    setEditingStaff(staffMember);
    reset({
      name: staffMember.name,
      email: staffMember.email,
      role: staffMember.role,
    });
    setShowAddForm(true);
  };

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: UserRole) => {
    const styles = {
      [UserRole.OWNER]: 'bg-purple-100 text-purple-800 border-purple-200',
      [UserRole.EMPLOYEE]: 'bg-blue-100 text-blue-800 border-blue-200',
    };
    return styles[role] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getRoleLabel = (role: UserRole) => {
    const labels = {
      [UserRole.OWNER]: 'Owner',
      [UserRole.EMPLOYEE]: 'Employee',
    };
    return labels[role] || role;
  };

  return (
    <div className="p-6 bg-neutral-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-neutral-900 font-primary">Staff Management</h1>
          <p className="text-neutral-500 mt-1 font-secondary">Manage your team members and their permissions</p>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary"
        >
          <UserPlus className="w-4 h-4" />
          Add Staff Member
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-neutral-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('staff')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'staff'
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Staff Members
        </button>
        <button
          onClick={() => setActiveTab('invitations')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'invitations'
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Invitations
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'staff' ? (
        <>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <Users className="w-8 h-8 text-primary-500" />
            <span className="widget-value">
              {staff.length}
            </span>
          </div>
          <p className="widget-title">Total Staff</p>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <UserCheck className="w-8 h-8 text-success" />
            <span className="widget-value">
              {staff.filter(s => s.isActive).length}
            </span>
          </div>
          <p className="widget-title">Active Staff</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <UserX className="w-8 h-8 text-error" />
            <span className="widget-value">
              {staff.filter(s => !s.isActive).length}
            </span>
          </div>
          <p className="widget-title">Inactive Staff</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search staff members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 pr-4"
              />
            </div>
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="input-field"
          >
            <option value="all">All Roles</option>
            <option value={UserRole.OWNER}>Owner</option>
            <option value={UserRole.EMPLOYEE}>Employee</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Staff List */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-100">
              <tr>
                <th className="text-left py-3 px-6 text-xs font-medium text-neutral-700 uppercase tracking-wider font-primary">Staff Member</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-neutral-700 uppercase tracking-wider font-primary">Role</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-neutral-700 uppercase tracking-wider font-primary">Status</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-neutral-700 uppercase tracking-wider font-primary">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-300">
              {filteredStaff.map((member) => (
                <tr key={member.id} className="hover:bg-neutral-100">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-neutral-600 font-secondary">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-neutral-900 font-secondary">{member.name}</div>
                        <div className="text-sm text-neutral-500 font-secondary">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-neutral-900 font-secondary">{getRoleLabel(member.role)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      member.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {member.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-neutral-500 font-secondary">
                    {new Date(member.createdAt || '').toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditStaff(member)}
                        className="text-neutral-400 hover:text-neutral-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {member.id !== currentUser?.id && (
                        <button
                          onClick={() => handleDeleteStaff(member.id)}
                          className="text-neutral-400 hover:text-error transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredStaff.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500 text-lg font-medium font-primary">No staff members found</p>
              <p className="text-neutral-400 text-sm font-secondary">Add your first staff member to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Staff Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => {
              setShowAddForm(false);
              setEditingStaff(null);
              reset();
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
              </h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email address"
                    disabled={!!editingStaff}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    {...register('role', { required: 'Role is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a role</option>
                    <option value={UserRole.EMPLOYEE}>Employee</option>
                    <option value={UserRole.OWNER}>Owner</option>
                  </select>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                  )}
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingStaff(null);
                      reset();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingStaff ? 'Update' : 'Add'} Staff Member
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
        </>
      ) : (
        <StaffInvitation />
      )}
    </div>
  );
}
