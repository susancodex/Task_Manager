import { useState } from 'react';
import { Search, Menu, LogOut, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';
import { useTasks } from '../../context/TaskContext';
import { useDebounce } from '../../hooks/useDebounce';
import { useEffect } from 'react';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { updateFilters } = useTasks();
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');
  const debounced = useDebounce(searchVal, 400);

  useEffect(() => {
    updateFilters({ search: debounced });
  }, [debounced]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-14 bg-white border-b border-ink-100 flex items-center px-4 gap-3 sticky top-0 z-30">
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-ink-500 hover:bg-ink-50 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
        <input
          type="text"
          placeholder="Search tasks…"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm bg-ink-50 border border-ink-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-ink-900/10 focus:border-ink-300 transition-all"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* User avatar */}
        <div className="hidden sm:flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-ink-900 flex items-center justify-center text-white text-xs font-bold">
            {getInitials(user?.username || 'U')}
          </div>
          <span className="text-sm font-medium text-ink-700 hidden md:block">{user?.username}</span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Logout"
          className="p-2 rounded-lg text-ink-400 hover:bg-ink-50 hover:text-rose-500 transition-all"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
