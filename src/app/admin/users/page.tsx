'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PageContainer } from '@/components/admin/shared/PageContainer';
import { PageHeader } from '@/components/admin/PageHeader';
import { DataTable } from '@/components/admin/DataTable';
import { userService, Pagination as PaginationType } from '@/services/user.service';
import { useAuth } from '@/components/providers/AuthProvider';
import { User } from '@/types/auth';

export default function UsersAdminPage() {
  const { user } = useAuth();
  
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');

  // Modals / Actions
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createData, setCreateData] = useState({ email: '', password: '', displayName: '', role: 'USER' as 'USER' | 'ADMIN' });
  const [createLoading, setCreateLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await userService.getUsers({
        page,
        limit: 20,
        search: search || undefined,
        role: role || undefined,
        status: status || undefined,
      });
      setUsers(response.data || []);
      setPagination(response.pagination || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, search, role, status]);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      const init = async () => {
        await fetchUsers();
      };
      init();
    }
  }, [fetchUsers, user]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      await userService.createUser(createData);
      setIsCreateModalOpen(false);
      setCreateData({ email: '', password: '', displayName: '', role: 'USER' });
      fetchUsers();
    } catch (err: unknown) {
      alert((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to create user');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await userService.updateUserRole(userId, newRole);
      fetchUsers();
    } catch (err: unknown) {
      alert((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to update role');
    }
  };

  const handleStatusChange = async (userId: string, isActive: boolean) => {
    try {
      await userService.updateUserStatus(userId, isActive);
      fetchUsers();
    } catch (err: unknown) {
      alert((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to update status');
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <PageContainer>
        <div className="p-8 text-center text-red-600">
          You do not have permission to view this page.
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader 
        title="Users Management" 
        description="Manage admin and user accounts."
        action={
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center rounded-sm bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Create User
          </button>
        }
      />

      <div className="mt-6 space-y-4">
        {/* Filters */}
        <div className="bg-white p-4 border border-gray-200 rounded-sm flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full md:w-64 rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
          />
          <select 
            value={role} 
            onChange={(e) => { setRole(e.target.value); setPage(1); }}
            className="rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
          </select>
          <select 
            value={status} 
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>

        {/* Data Table */}
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="bg-white p-8 border border-gray-200 rounded-sm text-red-600">
            {error}
          </div>
        ) : users && users.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
            <DataTable 
              data={users}
              keyExtractor={(item) => item.id}
              columns={[
                { 
                  key: 'avatar', 
                  header: 'Avatar', 
                  render: (item) => (
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                      {item.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.avatarUrl} alt={item.displayName || item.email} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-500 text-xs">{(item.displayName || item.email).charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                  )
                },
                { 
                  key: 'name', 
                  header: 'Name', 
                  render: (item) => <span className="font-medium text-gray-900">{item.displayName || '-'}</span> 
                },
                { 
                  key: 'email', 
                  header: 'Email', 
                  render: (item) => <span className="text-gray-500">{item.email}</span> 
                },
                { 
                  key: 'role', 
                  header: 'Role',
                  render: (item) => (
                    <select
                      value={item.role}
                      onChange={(e) => handleRoleChange(item.id, e.target.value)}
                      disabled={item.id === user.id}
                      className="text-xs rounded-sm border-gray-300 py-1 pl-2 pr-6"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="USER">User</option>
                    </select>
                  )
                },
                { 
                  key: 'status', 
                  header: 'Status',
                  render: (item) => (
                    <button
                      onClick={() => handleStatusChange(item.id, !item.isActive)}
                      disabled={item.id === user.id}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                        ${item.id !== user.id ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed opacity-50'}`}
                    >
                      {item.isActive ? 'Active' : 'Disabled'}
                    </button>
                  )
                },
                { 
                  key: 'lastLogin', 
                  header: 'Last Login',
                  render: (item) => item.lastLoginAt ? new Date(item.lastLoginAt).toLocaleDateString() : '-'
                },
                { 
                  key: 'createdAt', 
                  header: 'Created At',
                  render: (item: User) => item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'
                },
              ]}
            />
            {pagination && (
              <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
                </span>
                <div className="space-x-2">
                  <button 
                    disabled={pagination.page <= 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="px-3 py-1 border border-gray-300 rounded-sm text-sm disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button 
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="px-3 py-1 border border-gray-300 rounded-sm text-sm disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white p-8 border border-gray-200 rounded-sm text-center text-gray-500">
            No users found matching your filters.
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-sm p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Create New User</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Display Name</label>
                <input 
                  type="text" 
                  value={createData.displayName}
                  onChange={(e) => setCreateData({...createData, displayName: e.target.value})}
                  className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input 
                  type="email" 
                  required
                  value={createData.email}
                  onChange={(e) => setCreateData({...createData, email: e.target.value})}
                  className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input 
                  type="password" 
                  required
                  minLength={8}
                  value={createData.password}
                  onChange={(e) => setCreateData({...createData, password: e.target.value})}
                  className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select 
                  value={createData.role}
                  onChange={(e) => setCreateData({...createData, role: e.target.value as 'USER' | 'ADMIN'})}
                  className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm"
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={createLoading}
                  className="px-4 py-2 text-sm text-white bg-gray-900 rounded-sm hover:bg-gray-800 disabled:opacity-50"
                >
                  {createLoading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
