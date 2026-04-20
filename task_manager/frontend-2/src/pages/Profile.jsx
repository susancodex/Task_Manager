import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/helpers';
import { User, ShieldCheck } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-lg mx-auto space-y-5 animate-fade-in">
      <h1 className="text-xl font-semibold text-ink-900">Profile</h1>

      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-ink-100">
          <div className="w-14 h-14 rounded-2xl bg-ink-950 flex items-center justify-center text-white text-lg font-bold">
            {getInitials(user?.username || 'U')}
          </div>
          <div>
            <h2 className="text-base font-semibold text-ink-900">{user?.username}</h2>
            <p className="text-sm text-ink-500">User ID: {user?.id}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-ink-50">
            <User className="w-4 h-4 text-ink-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-ink-500">Username</p>
              <p className="text-sm font-medium text-ink-900">{user?.username}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-jade-50">
            <ShieldCheck className="w-4 h-4 text-jade-600 flex-shrink-0" />
            <div>
              <p className="text-xs text-jade-600">Authentication</p>
              <p className="text-sm font-medium text-jade-700">JWT · Active Session</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
