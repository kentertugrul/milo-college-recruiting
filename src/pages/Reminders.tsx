import { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Reminder } from '../types';
import { getReminders, addReminder, updateReminder, deleteReminder, getUniversities } from '../utils/storage';
import { generateId, formatDate, isDeadlineApproaching, isOverdue } from '../utils/helpers';

const Reminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [isAddReminderOpen, setIsAddReminderOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority'>('dueDate');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setReminders(getReminders());
    setUniversities(getUniversities());
  };

  const handleAddReminder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newReminder: Reminder = {
      id: generateId(),
      universityId: formData.get('universityId') as string || undefined,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      dueDate: formData.get('dueDate') as string,
      priority: formData.get('priority') as any,
      type: formData.get('type') as any,
      completed: false,
    };

    addReminder(newReminder);
    loadData();
    setIsAddReminderOpen(false);
    e.currentTarget.reset();
  };

  const handleToggleComplete = (id: string, completed: boolean) => {
    updateReminder(id, { completed: !completed });
    loadData();
  };

  const handleDeleteReminder = (id: string) => {
    if (confirm('Delete this reminder?')) {
      deleteReminder(id);
      loadData();
    }
  };

  const getFilteredReminders = () => {
    let filtered = reminders;

    // Apply filter
    if (filter === 'active') {
      filtered = filtered.filter(r => !r.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter(r => r.completed);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
    });

    return filtered;
  };

  const filteredReminders = getFilteredReminders();

  const stats = {
    total: reminders.length,
    active: reminders.filter(r => !r.completed).length,
    completed: reminders.filter(r => r.completed).length,
    overdue: reminders.filter(r => !r.completed && isOverdue(r.dueDate)).length,
    urgent: reminders.filter(r => !r.completed && isDeadlineApproaching(r.dueDate, 3)).length,
  };

  const getPriorityStyle = (priority: string) => {
    const styles = {
      high: { bg: '#FEE2E2', color: '#991B1B', border: '#EF4444' },
      medium: { bg: '#FEF3C7', color: '#92400E', border: '#F59E0B' },
      low: { bg: '#D1FAE5', color: '#065F46', border: '#10B981' },
    };
    return styles[priority as keyof typeof styles];
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      deadline: Calendar,
      interview: Clock,
      follow_up: AlertCircle,
      task: CheckCircle,
    };
    return icons[type as keyof typeof icons] || Calendar;
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Reminders & Deadlines ⏰</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
          Stay organized and never miss a beat! Set reminders for everything important.<br/>
          <strong style={{ color: 'var(--primary)' }}>Staying on top of deadlines = less stress!</strong>
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>
            {stats.active}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Active Reminders</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--danger)', marginBottom: '0.25rem' }}>
            {stats.overdue}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Overdue</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--warning)', marginBottom: '0.25rem' }}>
            {stats.urgent}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Due in 3 Days</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)', marginBottom: '0.25rem' }}>
            {stats.completed}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Completed</div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['all', 'active', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={filter === f ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                style={{ textTransform: 'capitalize' }}
              >
                {f}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{ minWidth: '150px' }}
            >
              <option value="dueDate">Sort by Date</option>
              <option value="priority">Sort by Priority</option>
            </select>

            <button
              onClick={() => setIsAddReminderOpen(!isAddReminderOpen)}
              className="btn btn-primary"
            >
              <Plus size={20} />
              {isAddReminderOpen ? 'Cancel' : 'New Reminder'}
            </button>
          </div>
        </div>
      </div>

      {/* Add Reminder Form */}
      {isAddReminderOpen && (
        <form onSubmit={handleAddReminder} className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Create New Reminder</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                required
                placeholder="e.g., Submit application to Harvard"
              />
            </div>

            <div>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Additional details..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label htmlFor="dueDate">Due Date *</label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  required
                />
              </div>

              <div>
                <label htmlFor="universityId">University (Optional)</label>
                <select id="universityId" name="universityId">
                  <option value="">None</option>
                  {universities.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label htmlFor="priority">Priority *</label>
                <select id="priority" name="priority" required defaultValue="medium">
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label htmlFor="type">Type *</label>
                <select id="type" name="type" required defaultValue="task">
                  <option value="deadline">Deadline</option>
                  <option value="interview">Interview</option>
                  <option value="follow_up">Follow-up</option>
                  <option value="task">Task</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => setIsAddReminderOpen(false)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                Create Reminder
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Reminders List */}
      {filteredReminders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <AlertCircle size={48} color="var(--gray-400)" style={{ marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>
            {filter === 'completed' 
              ? 'No completed reminders yet.' 
              : filter === 'active'
              ? 'No active reminders. You\'re all caught up!'
              : 'No reminders yet. Create your first reminder!'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredReminders.map((reminder) => {
            const university = universities.find(u => u.id === reminder.universityId);
            const overdue = !reminder.completed && isOverdue(reminder.dueDate);
            const urgent = !reminder.completed && !overdue && isDeadlineApproaching(reminder.dueDate, 3);
            const priorityStyle = getPriorityStyle(reminder.priority);
            const TypeIcon = getTypeIcon(reminder.type);

            return (
              <div
                key={reminder.id}
                className="card"
                style={{
                  border: overdue 
                    ? '2px solid var(--danger)' 
                    : urgent 
                    ? '2px solid var(--warning)' 
                    : 'none',
                  opacity: reminder.completed ? 0.7 : 1
                }}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={reminder.completed}
                    onChange={() => handleToggleComplete(reminder.id, reminder.completed)}
                    style={{ 
                      width: '1.5rem', 
                      height: '1.5rem', 
                      cursor: 'pointer',
                      marginTop: '0.25rem'
                    }}
                  />

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <TypeIcon size={20} color={priorityStyle.color} style={{ marginTop: '0.125rem' }} />
                      <h4 style={{ 
                        flex: 1,
                        textDecoration: reminder.completed ? 'line-through' : 'none'
                      }}>
                        {reminder.title}
                      </h4>
                      
                      {/* Priority Badge */}
                      <span
                        className="badge"
                        style={{
                          backgroundColor: priorityStyle.bg,
                          color: priorityStyle.color,
                          border: `1px solid ${priorityStyle.border}`,
                          textTransform: 'uppercase',
                          fontWeight: 600
                        }}
                      >
                        {reminder.priority}
                      </span>

                      {/* Overdue/Urgent Badge */}
                      {overdue && (
                        <span
                          className="badge"
                          style={{
                            backgroundColor: '#FEE2E2',
                            color: '#991B1B',
                            border: '1px solid #EF4444'
                          }}
                        >
                          OVERDUE
                        </span>
                      )}
                      {urgent && !overdue && (
                        <span
                          className="badge"
                          style={{
                            backgroundColor: '#FEF3C7',
                            color: '#92400E',
                            border: '1px solid #F59E0B'
                          }}
                        >
                          URGENT
                        </span>
                      )}
                    </div>

                    {reminder.description && (
                      <p style={{ 
                        color: 'var(--text-secondary)', 
                        fontSize: '0.875rem',
                        marginBottom: '0.75rem',
                        lineHeight: 1.5
                      }}>
                        {reminder.description}
                      </p>
                    )}

                    <div style={{ 
                      display: 'flex', 
                      gap: '1.5rem', 
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        color: overdue ? 'var(--danger)' : urgent ? 'var(--warning)' : 'inherit',
                        fontWeight: (overdue || urgent) ? 600 : 400
                      }}>
                        <Calendar size={16} />
                        Due: {formatDate(reminder.dueDate)}
                      </span>
                      {university && (
                        <span>
                          University: <strong>{university.name}</strong>
                        </span>
                      )}
                      <span style={{ textTransform: 'capitalize' }}>
                        Type: {reminder.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteReminder(reminder.id)}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: 'transparent',
                      color: 'var(--text-secondary)',
                      borderRadius: 'var(--radius)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#FEE2E2';
                      e.currentTarget.style.color = 'var(--danger)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Reminders;

