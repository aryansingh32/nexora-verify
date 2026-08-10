import { createFileRoute, Outlet, Link, useNavigate, useRouter, useMatchRoute, useRouterState } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { LayoutDashboard, Users, Award, QrCode, ClipboardList, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pathname = useRouterState({ select: (s) => s.location.pathname });
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      const isLoginOrSetup = pathname.includes('/admin/login') || pathname.includes('/admin/setup');
      if (!session && !isLoginOrSetup) {
        navigate({ to: '/admin/login' });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      const isLoginOrSetup = pathname.includes('/admin/login') || pathname.includes('/admin/setup');
      if (!session && !isLoginOrSetup) {
        navigate({ to: '/admin/login' });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: '/admin/login' });
  };

  const isAuthPage = pathname.includes('/admin/login') || pathname.includes('/admin/setup');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAuthPage) {
    return <Outlet />;
  }

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/certificates', icon: Award, label: 'Certificates' },
    { to: '/admin/qr', icon: QrCode, label: 'QR Codes' },
    { to: '/admin/verification-logs', icon: ClipboardList, label: 'Verification Logs' },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8f9fc]">
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-[240px] bg-white border-r border-gray-200 transition-transform duration-300 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <img src="/logo.png" alt="NexoraVerify" className="h-8 w-auto object-contain" />
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = matchRoute({ to: item.to });
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    isActive ? 'text-primary' : 'text-gray-400'
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="mb-4 px-3">
            <p className="text-sm font-medium text-gray-900 truncate">
              {session?.user?.email}
            </p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 lg:pl-[240px] flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 lg:px-8 shrink-0 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 mr-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <Menu className="h-6 w-6" />
          </button>
          <img src="/logo.png" alt="NexoraVerify" className="h-8 w-auto object-contain" />
        </header>

        <div className="flex-1 p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
