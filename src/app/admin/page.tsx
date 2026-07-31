import React from 'react';
import { PageContainer } from '@/components/admin/shared/PageContainer';
import { dashboardService } from '@/services/dashboard.service';
import { DashboardHeader } from '@/components/admin/dashboard/DashboardHeader';
import { DashboardStats } from '@/components/admin/dashboard/DashboardStats';
import { DashboardCharts } from '@/components/admin/dashboard/DashboardCharts';
import { RecentProperties } from '@/components/admin/dashboard/RecentProperties';
import { RecentActivity } from '@/components/admin/dashboard/RecentActivity';
import { DashboardQuickActions } from '@/components/admin/dashboard/DashboardQuickActions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminDashboardPage() {
  let data;
  try {
    data = await dashboardService.getDashboardStats();
  } catch (error) {
    console.error('Failed to load dashboard:', error);
    return (
      <PageContainer>
        <div className="bg-red-50 text-red-700 p-6 rounded-sm border border-red-200">
          <h2 className="text-lg font-bold mb-2">Error Loading Dashboard</h2>
          <p>We encountered a problem while fetching the dashboard data. Please try again later or check the server logs.</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <DashboardHeader />
        
        <DashboardStats stats={data.stats} />
        
        <DashboardCharts charts={data.charts} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
          <div className="lg:col-span-2">
            <RecentProperties properties={data.recentProperties} />
          </div>
          <div className="space-y-6 lg:col-span-1">
            <DashboardQuickActions />
            <RecentActivity activity={data.recentActivity} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
