import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, PlusSquare, User, LogOut, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/tasks/new', icon: PlusSquare, label: 'Create Task' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const Sidebar = ({ onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="flex flex-col w-64 h-full bg-ink-950 text-white">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-ink-800">
        <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center">
          <Zap className="w-4 h-4 text-ink-950" fill="currentColor" />
        </div>
        <span className="font-semibold text-base tracking-tight">TaskFlow</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-ink-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-ink-800 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5">
          <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center text-ink-950 text-xs font-bold flex-shrink-0">
            {getInitials(user?.username || 'U')}
          </div>
          <span className="text-sm text-white font-medium truncate">{user?.username}</span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-ink-400 hover:bg-white/5 hover:text-rose-400 transition-all duration-150"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
