'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      console.log('Auth callback processing...');
      const { error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Auth callback getSession error:', error);
        console.error('Error message:', error.message);
        router.push('/?error=auth_failed&details=' + encodeURIComponent(error.message));
        return;
      }
      
      console.log('Auth callback success, session retrieved.');

      // Check if there's a redirect URL in localStorage
      const redirectTo = localStorage.getItem('authRedirectTo');
      localStorage.removeItem('authRedirectTo');

      router.push(redirectTo || '/');
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-orange-400 animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Completing login...</p>
      </div>
    </div>
  );
}
