'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sword, Hammer, Pickaxe, LogOut, User, Shield, Users, Settings } from 'lucide-react';
import { useAuthContext } from '@/components/AuthProvider';
import { getUserClans } from '@/lib/auth';

interface UserClan {
  id: string;
  slug: string;
  name: string;
  role: string;
  isCreator: boolean;
}

export default function Home() {
  const [clanName, setClanName] = useState('');
  const [userClans, setUserClans] = useState<UserClan[]>([]);
  const [clansLoading, setClansLoading] = useState(false);
  const router = useRouter();
  const { user, profile, loading, signIn, signOut } = useAuthContext();

  // Fetch user's clans when logged in
  useEffect(() => {
    async function fetchClans() {
      if (!user) {
        setUserClans([]);
        return;
      }
      
      setClansLoading(true);
      try {
        const clans = await getUserClans(user.id);
        setUserClans(clans as UserClan[]);
      } catch (err) {
        console.error('Error fetching user clans:', err);
      } finally {
        setClansLoading(false);
      }
    }
    
    if (!loading) {
      fetchClans();
    }
  }, [user, loading]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (clanName.trim()) {
      const slug = clanName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      router.push(`/${slug}`);
    }
  };

  const displayName = profile?.display_name || profile?.discord_username || 'User';

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-orange-400';
      case 'officer': return 'text-purple-400';
      default: return 'text-cyan-400';
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 relative">
      {/* Auth status in top right */}
      <div className="absolute top-4 right-4">
        {loading ? null : user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-slate-300">
              {profile?.discord_avatar ? (
                <img
                  src={profile.discord_avatar}
                  alt={displayName}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <User className="w-8 h-8 p-1 bg-slate-800 rounded-full" />
              )}
              <span className="text-sm hidden sm:inline">{displayName}</span>
            </div>
            <Link
              href="/settings"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Settings"
            >
              <Settings size={18} />
            </Link>
            <button
              onClick={() => signOut()}
              className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Sign out"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn()}
            className="flex items-center gap-2 px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            Login
          </button>
        )}
      </div>

      {/* Hero section */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-8">
          <Pickaxe className="w-8 h-8 text-amber-400" />
          <Hammer className="w-10 h-10 text-orange-400" />
          <Sword className="w-8 h-8 text-rose-400" />
        </div>

        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400 bg-clip-text text-transparent">
          AoC Profession Planner
        </h1>

        <p className="text-slate-400 text-lg mb-8">
          Plan and manage your guild&apos;s artisan professions for Ashes of Creation
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              value={clanName}
              onChange={(e) => setClanName(e.target.value)}
              placeholder="Enter your clan name..."
              className="w-full px-6 py-4 bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
              autoFocus
            />
            <button
              type="submit"
              disabled={!clanName.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-md hover:from-orange-600 hover:to-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Enter
            </button>
          </div>
          <p className="text-slate-500 text-sm mt-3">
            {user 
              ? "You'll be able to create or join this clan"
              : "Login with Discord to create or join clans"
            }
          </p>
        </form>
      </div>

      {/* User's clans section */}
      {user && !clansLoading && userClans.length > 0 && (
        <div className="mt-12 w-full max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 justify-center">
            <Shield className="w-5 h-5 text-orange-400" />
            Your Clans
          </h2>
          <div className="grid gap-3">
            {userClans.map((clan) => (
              <Link
                key={clan.id}
                href={`/${clan.slug}`}
                className="flex items-center justify-between bg-slate-900/60 hover:bg-slate-800/80 backdrop-blur-sm border border-slate-700 hover:border-slate-600 rounded-lg p-4 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-slate-400 group-hover:text-slate-300" />
                  <span className="text-white font-medium group-hover:text-orange-300 transition-colors">
                    {clan.name}
                  </span>
                </div>
                <span className={`text-sm ${getRoleColor(clan.role)}`}>
                  {clan.role}
                  {clan.isCreator && ' (creator)'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Feature highlights */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <FeatureCard
          icon={<Pickaxe className="w-6 h-6 text-amber-400" />}
          title="Track All 22 Professions"
          description="Gathering, Processing, and Crafting with full dependency chains"
        />
        <FeatureCard
          icon={<Hammer className="w-6 h-6 text-cyan-400" />}
          title="Manage Guild Members"
          description="Assign ranks from Apprentice to Grandmaster"
        />
        <FeatureCard
          icon={<Sword className="w-6 h-6 text-rose-400" />}
          title="Guild Coverage Matrix"
          description="See your guild's productive strength at a glance"
        />
      </div>

      <footer className="mt-16 text-slate-600 text-sm">
        Built for Ashes of Creation • Data saved to cloud
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-lg p-6 text-center">
      <div className="flex justify-center mb-3">{icon}</div>
      <h3 className="font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  );
}
