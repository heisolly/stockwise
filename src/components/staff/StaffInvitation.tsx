'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { UserRole } from '@/types';
import { supabase } from '@/lib/supabase';
import { UserPlus, Mail, Clock, CheckCircle, XCircle, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface DbInvitation {
  id: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  expires_at: string;
  accepted_at?: string;
  token: string;
}

export function StaffInvitation() {
  const { businessProfile, user } = useSelector((state: RootState) => state.auth);
  
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(UserRole.EMPLOYEE);
  const [isInviting, setIsInviting] = useState(false);
  const [invitations, setInvitations] = useState<DbInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Fetch invitations from database
  const fetchInvitations = async () => {
    if (!businessProfile?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('organization_invites')
        .select('*')
        .eq('business_id', businessProfile.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setInvitations(data || []);
    } catch (error) {
      console.error('Failed to fetch invitations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, [businessProfile?.id]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !businessProfile?.id) return;

    setIsInviting(true);
    
    try {
      // Call the RPC function to invite employee
      const { data, error } = await supabase.rpc('invite_employee', {
        p_business_id: businessProfile.id,
        p_email: email.toLowerCase(),
        p_role: role,
      });

      if (error) throw error;
      
      toast.success(`Invitation sent to ${email}`);
      setEmail('');
      
      // Refresh invitations list
      await fetchInvitations();
      
    } catch (error: any) {
      console.error('Failed to send invitation:', error);
      toast.error(error.message || 'Failed to send invitation');
    } finally {
      setIsInviting(false);
    }
  };

  const handleCopyInviteCode = () => {
    if (businessProfile?.inviteCode) {
      navigator.clipboard.writeText(businessProfile.inviteCode);
      setCopied(true);
      toast.success('Invite code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-warning" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'expired':
        return <XCircle className="w-4 h-4 text-error" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'accepted':
        return 'bg-success/10 text-success border-success/20';
      case 'expired':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Invite Code Card */}
      <div className="card bg-gradient-to-r from-[#004838] to-[#00664d]">
        <h3 className="text-lg font-semibold text-white mb-2 font-primary">
          Organization Invite Code
        </h3>
        <p className="text-white/70 text-sm mb-4">
          Share this code with your employees to let them join your organization
        </p>
        
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-white/10 rounded-lg px-4 py-3 border border-white/20">
            <span className="text-white font-mono text-lg tracking-wider">
              {businessProfile?.inviteCode || 'Loading...'}
            </span>
          </div>
          <button
            onClick={handleCopyInviteCode}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-colors"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-400" />
            ) : (
              <Copy className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
        
        <p className="text-white/50 text-xs mt-3">
          Employees can join at: /signup/employee?code={businessProfile?.inviteCode}
        </p>
      </div>

      {/* Invite Staff Form */}
      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4 font-primary">
          Invite Staff Member
        </h3>
        
        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2 font-secondary">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@example.com"
                className="input-field pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2 font-secondary">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="input-field"
            >
              <option value={UserRole.EMPLOYEE}>Employee</option>
              <option value={UserRole.MANAGER}>Manager</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isInviting || !email}
            className="btn btn-primary w-full"
          >
            <UserPlus className="w-4 h-4" />
            {isInviting ? 'Sending...' : 'Send Invitation'}
          </button>
        </form>
      </div>

      {/* Invitations List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4 font-primary">
          Pending Invitations ({invitations.length})
        </h3>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-[#004838] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : invitations.length === 0 ? (
          <div className="text-center py-8">
            <Mail className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500 font-medium font-primary">No invitations sent yet</p>
            <p className="text-neutral-400 text-sm font-secondary">Invite staff members to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {invitations.map((invitation) => (
              <motion.div
                key={invitation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg border ${getStatusColor(invitation.status)}`}>
                    {getStatusIcon(invitation.status)}
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 font-secondary">{invitation.email}</p>
                    <p className="text-sm text-neutral-500 font-secondary capitalize">
                      {invitation.role} • Invited {new Date(invitation.created_at).toLocaleDateString()}
                      {invitation.status === 'pending' && (
                        <span className="text-amber-600 ml-2">
                          (Expires {new Date(invitation.expires_at).toLocaleDateString()})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(invitation.status)}`}>
                    {invitation.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
