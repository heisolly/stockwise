'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { UserPlus, Mail, Clock, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Invitation {
  id: string;
  email: string;
  role: string;
  status: 'pending' | 'accepted' | 'expired';
  createdAt: string;
  expiresAt: string;
}

export function StaffInvitation() {
  const dispatch = useDispatch<AppDispatch>();
  const { businessProfile } = useSelector((state: RootState) => state.auth);
  
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('employee');
  const [isInviting, setIsInviting] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !businessProfile?.id) return;

    setIsInviting(true);
    
    try {
      // Create invitation token
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const invitationData = {
        id: token,
        email: email.toLowerCase(),
        role,
        businessId: businessProfile.id,
        businessName: businessProfile.name,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      };

      // TODO: Save to database and send email
      console.log('Invitation created:', invitationData);
      
      setInvitations(prev => [invitationData, ...prev]);
      setEmail('');
      
      // Show success message
      alert(`Invitation sent to ${email}`);
      
    } catch (error) {
      console.error('Failed to send invitation:', error);
      alert('Failed to send invitation');
    } finally {
      setIsInviting(false);
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
      {/* Invite Staff Form */}
      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4 font-primary">Invite Staff Member</h3>
        
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
              onChange={(e) => setRole(e.target.value)}
              className="input-field"
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
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
        <h3 className="text-lg font-semibold text-neutral-900 mb-4 font-primary">Pending Invitations</h3>
        
        {invitations.length === 0 ? (
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
                      {invitation.role} • Invited {new Date(invitation.createdAt).toLocaleDateString()}
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
