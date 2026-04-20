import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { getErrorMessage } from '../../utils/helpers';
import Spinner from '../common/Spinner';
import toast from 'react-hot-toast';

const EMPTY_FORM = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  due_date: '',
};

const TaskModal = ({ isOpen, onClose, task }) => {
  const { addTask, editTask, fetchTasks, filters } = useTasks();
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const isEditing = !!task;

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [task, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.due_date) delete payload.due_date;

      if (isEditing) {
        await editTask(task.id, payload);
      } else {
        await addTask(payload);
      }
      fetchTasks(filters);
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg card p-6 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-ink-900">
            {isEditing ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-400 hover:bg-ink-50 hover:text-ink-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1.5">Title *</label>
            <input
              className={`input-field ${errors.title ? 'border-rose-300 focus:border-rose-400' : ''}`}
              placeholder="What needs to be done?"
              value={form.title}
              onChange={set('title')}
            />
            {errors.title && <p className="mt-1 text-xs text-rose-500">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1.5">Description</label>
            <textarea
              className="input-field resize-none"
              rows={3}
              placeholder="Add more details…"
              value={form.description}
              onChange={set('description')}
            />
          </div>

          {/* Status + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-ink-600 mb-1.5">Status</label>
              <select className="input-field" value={form.status} onChange={set('status')}>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-600 mb-1.5">Priority</label>
              <select className="input-field" value={form.priority} onChange={set('priority')}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1.5">Due Date</label>
            <input
              type="date"
              className="input-field"
              value={form.due_date}
              onChange={set('due_date')}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1 justify-end">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <Spinner size="sm" /> : null}
              {isEditing ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
