'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/admin/shared/PageContainer';
import { PageHeader } from '@/components/admin/PageHeader';
import { SectionCard } from '@/components/admin/shared/SectionCard';
import { userService } from '@/services/user.service';
import { useAuth } from '@/components/providers/AuthProvider';

export default function ProfilePage() {
  const { user, verifySession } = useAuth();
  
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [generalLoading, setGeneralLoading] = useState(false);
  const [generalMessage, setGeneralMessage] = useState('');
  
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setAvatarUrl(user.avatarUrl || '');
      setEmail(user.email || '');
      setRole(user.role || '');
    }
  }, [user]);

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralLoading(true);
    setGeneralMessage('');
    try {
      await userService.updateProfile({ displayName, avatarUrl });
      await verifySession(); // Refresh auth context
      setGeneralMessage('Profile updated successfully.');
    } catch (error: any) {
      setGeneralMessage(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setGeneralLoading(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordMessage('');
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    }

    setPasswordLoading(true);
    try {
      await userService.updatePassword({ currentPassword, newPassword });
      setPasswordMessage('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setPasswordError(error.response?.data?.message || 'Failed to update password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) return null;

  return (
    <PageContainer>
      <PageHeader title="My Profile" description="Manage your personal information and security settings." />
      
      <div className="space-y-8 mt-6 max-w-4xl">
        <SectionCard title="General Information">
          <form onSubmit={handleSaveGeneral} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Display Name</label>
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address (Read-only)</label>
                <input 
                  type="email" 
                  value={email}
                  disabled
                  className="mt-1 block w-full rounded-sm border-gray-300 bg-gray-50 text-gray-500 shadow-sm sm:text-sm cursor-not-allowed"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Avatar URL</label>
                <input 
                  type="text" 
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.png"
                  className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Role (Read-only)</label>
                <input 
                  type="text" 
                  value={role}
                  disabled
                  className="mt-1 block w-full rounded-sm border-gray-300 bg-gray-50 text-gray-500 shadow-sm sm:text-sm cursor-not-allowed"
                />
              </div>
            </div>

            {generalMessage && (
              <div className={`p-3 text-sm rounded-sm ${generalMessage.includes('Failed') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
                {generalMessage}
              </div>
            )}

            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={generalLoading}
                className="bg-gray-900 text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
              >
                {generalLoading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </SectionCard>

        <SectionCard title="Security">
          <form onSubmit={handleSavePassword} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <input 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm"
              />
            </div>

            {passwordError && (
              <div className="p-3 text-sm rounded-sm bg-red-50 text-red-800">
                {passwordError}
              </div>
            )}
            
            {passwordMessage && (
              <div className="p-3 text-sm rounded-sm bg-green-50 text-green-800">
                {passwordMessage}
              </div>
            )}

            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={passwordLoading}
                className="bg-gray-900 text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
              >
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </SectionCard>
      </div>
    </PageContainer>
  );
}
