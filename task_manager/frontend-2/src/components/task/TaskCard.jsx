import { useState } from 'react';
import { Edit2, Trash2, CheckCircle2, Circle, Calendar, MoreHorizontal } from 'lucide-react';
import { PriorityBadge, StatusBadge } from '../common/Badge';
import { formatDate, isOverdue } from '../../utils/helpers';
import ConfirmDialog from '../common/ConfirmDialog';
import { useTasks } from '../../context/TaskContext';
import toast from 'react-hot-toast';

const TaskCard = ({ task, onEdit }) => {
  const { removeTask, toggleComplete, fetchTasks, filters } = useTasks();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const overdue = isOverdue(task.due_date, task.status);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await removeTask(task.id);
      setConfirmOpen(false);
      fetchTasks(filters);
    } catch {
      toast.error('Failed to delete task.');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggle = async () => {
    setToggling(true);
    try {
      await toggleComplete(task);
      fetchTasks(filters);
    } catch {
      toast.error('Failed to update task.');
    } finally {
      setToggling(false);
    }
  };

  const isCompleted = task.status === 'completed';

  return (
    <>
      <div className={`card p-4 group hover:shadow-lifted transition-all duration-200 animate-fade-in ${isCompleted ? 'opacity-75' : ''}`}>
        <div className="flex items-start gap-3">
          {/* Complete toggle */}
          <button
            onClick={handleToggle}
            disabled={toggling}
            className="mt-0.5 flex-shrink-0 text-ink-300 hover:text-jade-500 transition-colors disabled:opacity-50"
          >
            {isCompleted
              ? <CheckCircle2 className="w-5 h-5 text-jade-500" />
              : <Circle className="w-5 h-5" />
            }
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className={`text-sm font-semibold text-ink-900 leading-snug ${isCompleted ? 'line-through text-ink-400' : ''}`}>
                {task.title}
              </h3>

              {/* Actions menu */}
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-1 rounded text-ink-300 hover:text-ink-600 hover:bg-ink-50 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 mt-1 z-20 bg-white border border-ink-100 rounded-lg shadow-lifted py-1 min-w-[120px] animate-fade-in">
                      <button
                        onClick={() => { setMenuOpen(false); onEdit(task); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-700 hover:bg-ink-50 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => { setMenuOpen(false); setConfirmOpen(true); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-500 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {task.description && (
              <p className="mt-1 text-xs text-ink-500 line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}

            {/* Metadata row */}
            <div className="flex flex-wrap items-center gap-1.5 mt-3">
              <PriorityBadge priority={task.priority} />
              <StatusBadge status={task.status} />
              {task.due_date && (
                <span className={`badge ${overdue ? 'bg-rose-50 text-rose-500 border border-rose-100' : 'bg-ink-50 text-ink-500 border border-ink-100'}`}>
                  <Calendar className="w-3 h-3" />
                  {overdue ? 'Overdue · ' : ''}{formatDate(task.due_date)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={deleting}
        title="Delete task?"
        message={`"${task.title}" will be permanently removed. This action cannot be undone.`}
      />
    </>
  );
};

export default TaskCard;
