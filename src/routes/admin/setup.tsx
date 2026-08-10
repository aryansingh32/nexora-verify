import { createFileRoute, Link } from '@tanstack/react-router';
import { ensureDemoAdmin, DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD } from '@/lib/bootstrap.functions';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, ShieldAlert } from 'lucide-react';

export const Route = createFileRoute('/admin/setup')({
  component: AdminSetup,
});

function AdminSetup() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSetup = async () => {
    setLoading(true);
    try {
      await ensureDemoAdmin();
      setDone(true);
      toast.success('Admin setup complete!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to setup admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc] p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">First Run Setup</h1>
          <p className="text-gray-500 text-sm">Initialize the administrator account for NexoraVerify.</p>
        </div>

        {!done ? (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
              This will create a demo administrator account with the following credentials:
              <ul className="mt-2 list-disc list-inside text-gray-600">
                <li>Email: <strong>{DEMO_ADMIN_EMAIL}</strong></li>
                <li>Password: <strong>{DEMO_ADMIN_PASSWORD}</strong></li>
              </ul>
            </div>

            <Button
              onClick={handleSetup}
              className="w-full"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Admin Account
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="bg-green-50 text-green-800 p-4 rounded-lg flex items-start text-left">
              <CheckCircle2 className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0 text-green-600" />
              <div>
                <p className="font-medium">Setup complete!</p>
                <p className="text-sm mt-1">The demo administrator has been created successfully.</p>
              </div>
            </div>

            <Link to="/admin/login" className="block w-full">
              <Button className="w-full">
                Proceed to Login
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
