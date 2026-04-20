import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, AlertCircle, ListTodo, ArrowRight, Plus } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/task/TaskCard';
import TaskModal from '../components/task/TaskModal';
import Spinner from '../components/common/Spinner';

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
      <Icon className={`w-5 h-5 ${color}`} />
    </div>
    <div>
      <p className="text-2xl font-bold text-ink-900 leading-none">{value}</p>
      <p className="text-xs text-ink-500 mt-1">{label}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, loading, fetchTasks, filters, pagination } = useTasks();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    fetchTasks({ page: 1, ordering: '-created_at' });
  }, []);

  const stats = {
    total: pagination.count || tasks.length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    high: tasks.filter((t) => t.priority === 'high' && t.status !== 'completed').length,
  };

  const recent = tasks.slice(0, 5);

  const handleEdit = (task) => {
    setEditTask(task);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditTask(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink-900">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
            <span className="text-amber-600">{user?.username}</span> 👋
          </h1>
          <p className="text-sm text-ink-500 mt-0.5">Here's what's on your plate today.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary hidden sm:inline-flex"
        >
          <Plus className="w-4 h-4" /> New Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={ListTodo} label="Total Tasks" value={stats.total} color="text-ink-600" bg="bg-ink-100" />
        <StatCard icon={CheckCircle2} label="Completed" value={stats.completed} color="text-jade-600" bg="bg-jade-50" />
        <StatCard icon={Clock} label="Pending" value={stats.pending} color="text-amber-600" bg="bg-amber-50" />
        <StatCard icon={AlertCircle} label="High Priority" value={stats.high} color="text-rose-500" bg="bg-rose-50" />
      </div>

      {/* Recent tasks */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-ink-700">Recent Tasks</h2>
          <Link to="/tasks" className="text-xs text-ink-500 hover:text-ink-900 flex items-center gap-1 transition-colors">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" className="text-ink-400" />
          </div>
        ) : recent.length === 0 ? (
          <div className="card p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-ink-100 flex items-center justify-center mx-auto mb-3">
              <ListTodo className="w-6 h-6 text-ink-400" />
            </div>
            <p className="text-sm font-medium text-ink-600">No tasks yet</p>
            <p className="text-xs text-ink-400 mt-1 mb-4">Create your first task to get started</p>
            <button onClick={() => setModalOpen(true)} className="btn-primary mx-auto">
              <Plus className="w-4 h-4" /> Create Task
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {recent.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={handleEdit} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile FAB */}
      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-6 right-6 sm:hidden w-12 h-12 rounded-full bg-ink-950 text-white shadow-lifted flex items-center justify-center hover:bg-ink-700 transition-colors active:scale-95"
      >
        <Plus className="w-5 h-5" />
      </button>

      <TaskModal isOpen={modalOpen} onClose={handleCloseModal} task={editTask} />
    </div>
  );
};

export default Dashboard;
