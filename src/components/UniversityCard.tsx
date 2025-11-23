import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, Trash2, ExternalLink, AlertCircle } from 'lucide-react';
import { University } from '../types';
import { formatDate, getStatusColor, getStatusLabel, getSchoolSizeLabel, isDeadlineApproaching, isOverdue } from '../utils/helpers';

interface UniversityCardProps {
  university: University;
  onDelete: (id: string) => void;
}

const UniversityCard = ({ university, onDelete }: UniversityCardProps) => {
  const statusColor = getStatusColor(university.status);
  const isUrgent = isDeadlineApproaching(university.applicationDeadline, 14);
  const overdue = isOverdue(university.applicationDeadline);
  const completedTasks = university.checklist.filter(item => item.completed).length;
  const totalTasks = university.checklist.length;

  return (
    <div className="card" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative',
      border: overdue ? '2px solid var(--danger)' : isUrgent ? '2px solid var(--warning)' : 'none',
      transition: 'var(--transition)'
    }}>
      {/* Urgent Badge */}
      {overdue && (
        <div style={{
          position: 'absolute',
          top: '-0.5rem',
          right: '1rem',
          backgroundColor: 'var(--danger)',
          color: 'white',
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <AlertCircle size={12} />
          OVERDUE
        </div>
      )}
      {!overdue && isUrgent && (
        <div style={{
          position: 'absolute',
          top: '-0.5rem',
          right: '1rem',
          backgroundColor: 'var(--warning)',
          color: 'white',
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <AlertCircle size={12} />
          URGENT
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <Link 
            to={`/university/${university.id}`}
            style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}
          >
            <h3 style={{ 
              fontSize: '1.25rem', 
              marginBottom: '0.25rem',
              color: 'var(--primary)',
              cursor: 'pointer'
            }}>
              {university.name}
            </h3>
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(university.id);
            }}
            style={{
              padding: '0.25rem',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              borderRadius: 'var(--radius)',
              transition: 'var(--transition)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FEE2E2';
              e.currentTarget.style.color = 'var(--danger)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
            title="Delete university"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* Status Badge */}
        <span 
          className="badge" 
          style={{ 
            backgroundColor: `${statusColor}20`,
            color: statusColor,
            border: `1px solid ${statusColor}40`
          }}
        >
          {getStatusLabel(university.status)}
        </span>
      </div>

      {/* Info */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.75rem',
        marginBottom: '1rem',
        flex: 1
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          <MapPin size={16} />
          <span>{university.location} • {university.region}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          <Users size={16} />
          <span>{getSchoolSizeLabel(university.schoolSize)}</span>
        </div>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          fontSize: '0.875rem',
          color: overdue ? 'var(--danger)' : isUrgent ? 'var(--warning)' : 'var(--text-secondary)',
          fontWeight: overdue || isUrgent ? 600 : 400
        }}>
          <Calendar size={16} />
          <span>
            Deadline: {formatDate(university.applicationDeadline)}
          </span>
        </div>
      </div>

      {/* Progress */}
      {totalTasks > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Tasks Progress</span>
            <span style={{ fontWeight: 600 }}>
              {completedTasks}/{totalTasks}
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '0.5rem',
            backgroundColor: 'var(--gray-200)',
            borderRadius: '9999px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%`,
              height: '100%',
              backgroundColor: statusColor,
              transition: 'width 0.3s ease',
              borderRadius: '9999px'
            }} />
          </div>
        </div>
      )}

      {/* Admission Stats - Always Show */}
      <div style={{
        padding: '0.75rem',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        border: '1px solid var(--primary)',
        borderRadius: 'var(--radius)',
        marginBottom: '1rem'
      }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--primary)' }}>
          📊 ADMISSION STATS
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.875rem' }}>
          <div>
            <strong>Accept:</strong>{' '}
            <span style={{ color: university.admissionRate !== undefined ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: 700 }}>
              {university.admissionRate !== undefined ? `${(university.admissionRate * 100).toFixed(1)}%` : 'N/A'}
            </span>
          </div>
          <div>
            <strong>IB:</strong>{' '}
            <span style={{ color: university.averageIB !== undefined ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: 700 }}>
              {university.averageIB !== undefined ? university.averageIB : 'N/A'}
            </span>
          </div>
          <div>
            <strong>GPA:</strong>{' '}
            <span style={{ color: university.averageGPA !== undefined ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: 700 }}>
              {university.averageGPA !== undefined ? university.averageGPA.toFixed(2) : 'N/A'}
            </span>
          </div>
          <div>
            <strong>SAT:</strong>{' '}
            <span style={{ color: university.averageSAT !== undefined ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: 700 }}>
              {university.averageSAT !== undefined ? university.averageSAT : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Notes Preview */}
      {university.notes && (
        <div style={{
          padding: '0.75rem',
          backgroundColor: 'var(--gray-50)',
          borderRadius: 'var(--radius)',
          marginBottom: '1rem',
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5
        }}>
          {university.notes.length > 100 
            ? `${university.notes.substring(0, 100)}...` 
            : university.notes
          }
        </div>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '1rem' }}>
        <Link
          to={`/university/${university.id}`}
          className="btn btn-primary btn-sm"
          style={{ flex: 1, textDecoration: 'none', justifyContent: 'center' }}
        >
          <ExternalLink size={16} />
          View Details
        </Link>
      </div>
    </div>
  );
};

export default UniversityCard;

