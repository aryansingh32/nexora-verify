import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { ensureDemoAdmin, DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD } from '@/lib/bootstrap.functions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export const Route = createFileRoute('/admin/login')({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate({ to: '/admin/dashboard' });
          return;
        }
        await ensureDemoAdmin();
      } catch (error) {
        console.error('Error during init:', error);
      } finally {
        setInitializing(false);
      }
    };
    init();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Logged in successfully');
        navigate({ to: '/admin/dashboard' });
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail(DEMO_ADMIN_EMAIL);
    setPassword(DEMO_ADMIN_PASSWORD);
  };

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc] p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-8 pt-10 pb-8 text-center">
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="NexoraVerify" className="h-10 w-auto object-contain" />
          </div>
          <p className="text-gray-500 text-sm">Sign in to manage your digital credentials</p>
        </div>

        <form onSubmit={handleLogin} className="px-8 pb-10 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
              <p className="font-medium text-gray-900 mb-1">Demo Credentials</p>
              <p>Email: {DEMO_ADMIN_EMAIL}</p>
              <p>Password: {DEMO_ADMIN_PASSWORD}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 w-full text-xs"
                onClick={fillDemoCredentials}
              >
                Fill Credentials
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
