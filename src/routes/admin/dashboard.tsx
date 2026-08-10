import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getAdminStats } from '@/lib/admin.functions';
import { 
  Users, Award, CheckCircle2, XCircle, 
  TrendingUp, Activity, Loader2
} from 'lucide-react';
import {
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';

export const Route = createFileRoute('/admin/dashboard')({
  component: Dashboard,
});

function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => getAdminStats(),
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!stats) {
    return <div>Failed to load dashboard data.</div>;
  }

  const statCards = [
    {
      title: 'Total Holders',
      value: stats.totalHolders,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Certificates',
      value: stats.totalCertificates,
      icon: Award,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
    {
      title: 'Active Certificates',
      value: stats.activeCertificates,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Revoked',
      value: stats.revokedCertificates,
      icon: XCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Overview of your verification platform.</p>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className={`p-3 rounded-full ${card.bgColor}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts & Tables Area */}
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
        {/* Verification Trend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-gray-500" />
              Verification Trend
            </CardTitle>
            <CardDescription>Number of verifications over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVerifications" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="checks"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorVerifications)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Verifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <Activity className="mr-2 h-5 w-5 text-gray-500" />
              Recent Verifications
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 bg-gray-50 uppercase border-y">
                  <tr>
                    <th className="px-4 py-3 font-medium">Certificate #</th>
                    <th className="px-4 py-3 font-medium">Result</th>
                    <th className="px-4 py-3 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.recentVerifications.slice(0, 8).map((log: any) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900 truncate max-w-[120px]">
                        {log.certificate_number ?? '—'}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={log.result} />
                      </td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {format(new Date(log.verified_at), 'MMM d, h:mm a')}
                      </td>
                    </tr>
                  ))}
                  {stats.recentVerifications.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                        No verifications yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Certificates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Certificates</CardTitle>
          <CardDescription>Latest certificates issued on the platform</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 bg-gray-50 uppercase border-y">
                <tr>
                  <th className="px-6 py-3 font-medium">Certificate ID</th>
                  <th className="px-6 py-3 font-medium">Holder</th>
                  <th className="px-6 py-3 font-medium">Title</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Issued Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentCertificates.slice(0, 6).map((cert: any) => (
                  <tr key={cert.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      {cert.certificate_number}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {cert.holders?.name ?? '—'}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {cert.title}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={cert.status} />
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {format(new Date(cert.issued_at), 'MMM d, yyyy')}
                    </td>
                  </tr>
                ))}
                {stats.recentCertificates.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No certificates issued yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
