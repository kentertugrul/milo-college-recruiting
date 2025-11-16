import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, CheckCircle, AlertTriangle, Award, MapPin, Trophy, Users, Mail } from 'lucide-react';
import { getUniversities, getSoccerPrograms, getCoaches, getCoachContacts } from '../utils/storage';
import { getApplicationStats, isDeadlineApproaching, isOverdue } from '../utils/helpers';
import { University, Region } from '../types';

const Analytics = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [soccerPrograms, setSoccerPrograms] = useState<any[]>([]);
  const [coaches, setCoaches] = useState<any[]>([]);
  const [coachContacts, setCoachContacts] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const univData = getUniversities();
    setUniversities(univData);
    setStats(getApplicationStats(univData));
    setSoccerPrograms(getSoccerPrograms());
    setCoaches(getCoaches());
    setCoachContacts(getCoachContacts());
  };

  if (!stats) {
    return <div>Loading...</div>;
  }

  const statusData = [
    { label: 'Not Started', value: stats.notStarted, color: '#9CA3AF' },
    { label: 'In Progress', value: stats.inProgress, color: '#3B82F6' },
    { label: 'Submitted', value: stats.submitted, color: '#8B5CF6' },
    { label: 'Accepted', value: stats.accepted, color: '#10B981' },
    { label: 'Rejected', value: stats.rejected, color: '#EF4444' },
    { label: 'Waitlisted', value: stats.waitlisted, color: '#F59E0B' },
  ].filter(item => item.value > 0);

  const regionDistribution = universities.reduce((acc, uni) => {
    acc[uni.region] = (acc[uni.region] || 0) + 1;
    return acc;
  }, {} as Record<Region, number>);

  const sizeDistribution = universities.reduce((acc, uni) => {
    acc[uni.schoolSize] = (acc[uni.schoolSize] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const upcomingDeadlines = universities
    .filter(u => isDeadlineApproaching(u.applicationDeadline, 30) && (u.status === 'not_started' || u.status === 'in_progress'))
    .sort((a, b) => new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime())
    .slice(0, 5);

  const overdueCount = universities.filter(u => 
    isOverdue(u.applicationDeadline) && (u.status === 'not_started' || u.status === 'in_progress')
  ).length;

  const totalTasks = universities.reduce((sum, u) => sum + u.checklist.length, 0);
  const completedTasks = universities.reduce((sum, u) => sum + u.checklist.filter(c => c.completed).length, 0);
  const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const maxStatusValue = Math.max(...statusData.map(s => s.value), 1);

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Your Progress Dashboard 📊</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
          Look how far you've come, Milo! Every application, every coach contact, every step forward.<br/>
          <strong style={{ color: 'var(--primary)' }}>You're making it happen!</strong>
        </p>
      </div>

      {/* Key Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <TrendingUp size={32} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>
            {stats.total}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Total Universities
          </div>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <CheckCircle size={32} color="var(--success)" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--success)', marginBottom: '0.25rem' }}>
            {stats.completionRate.toFixed(0)}%
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Completion Rate
          </div>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <Award size={32} color="var(--secondary)" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '0.25rem' }}>
            {stats.accepted}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Acceptances
          </div>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <AlertTriangle size={32} color={overdueCount > 0 ? 'var(--danger)' : 'var(--success)'} style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: overdueCount > 0 ? 'var(--danger)' : 'var(--success)', marginBottom: '0.25rem' }}>
            {overdueCount}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Overdue Applications
          </div>
        </div>
      </div>

      {/* Application Status Distribution */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Application Status Distribution</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {statusData.map((item) => (
            <div key={item.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 500 }}>{item.label}</span>
                <span style={{ fontWeight: 600, color: item.color }}>
                  {item.value} ({((item.value / stats.total) * 100).toFixed(0)}%)
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '2rem',
                backgroundColor: 'var(--gray-200)',
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <div style={{
                  width: `${(item.value / maxStatusValue) * 100}%`,
                  height: '100%',
                  backgroundColor: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: '0.75rem',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  transition: 'width 0.5s ease'
                }}>
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Region Distribution */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={20} />
            Geographic Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {Object.entries(regionDistribution).map(([region, count]) => (
              <div key={region} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{region}</span>
                <span style={{ 
                  fontWeight: 600,
                  padding: '0.25rem 0.75rem',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  borderRadius: '9999px',
                  fontSize: '0.875rem'
                }}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* School Size Distribution */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>School Size Distribution</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {Object.entries(sizeDistribution).map(([size, count]) => {
              const labels: Record<string, string> = {
                small: 'Small (<2K)',
                medium: 'Medium (2K-10K)',
                large: 'Large (10K-20K)',
                very_large: 'Very Large (>20K)'
              };
              return (
                <div key={size} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{labels[size]}</span>
                  <span style={{ 
                    fontWeight: 600,
                    padding: '0.25rem 0.75rem',
                    backgroundColor: 'var(--secondary)',
                    color: 'white',
                    borderRadius: '9999px',
                    fontSize: '0.875rem'
                  }}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Task Completion */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Overall Task Completion</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <div style={{ flex: 1 }}>
            <div style={{
              width: '100%',
              height: '2rem',
              backgroundColor: 'var(--gray-200)',
              borderRadius: '9999px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${taskCompletionRate}%`,
                height: '100%',
                backgroundColor: taskCompletionRate === 100 ? 'var(--success)' : 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.875rem',
                transition: 'width 0.5s ease'
              }}>
                {taskCompletionRate > 10 && `${taskCompletionRate.toFixed(0)}%`}
              </div>
            </div>
          </div>
          <div style={{ fontWeight: 600, fontSize: '1.25rem', minWidth: '100px', textAlign: 'right' }}>
            {completedTasks} / {totalTasks}
          </div>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Tasks completed across all applications
        </p>
      </div>

      {/* Upcoming Deadlines */}
      <div className="card">
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={20} />
          Upcoming Deadlines (Next 30 Days)
        </h3>
        
        {upcomingDeadlines.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            color: 'var(--text-secondary)'
          }}>
            <CheckCircle size={48} color="var(--success)" style={{ marginBottom: '1rem' }} />
            <p>No upcoming deadlines! You're all caught up.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {upcomingDeadlines.map((uni) => {
              const daysUntil = Math.ceil(
                (new Date(uni.applicationDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              );
              const isUrgent = daysUntil <= 7;
              
              return (
                <div
                  key={uni.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    backgroundColor: isUrgent ? '#FEF3C7' : 'var(--gray-50)',
                    borderRadius: 'var(--radius)',
                    borderLeft: `4px solid ${isUrgent ? 'var(--warning)' : 'var(--primary)'}`
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                      {uni.name}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {new Date(uni.applicationDeadline).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                  <div style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: isUrgent ? 'var(--warning)' : 'var(--primary)',
                    color: 'white',
                    borderRadius: 'var(--radius)',
                    fontWeight: 600,
                    fontSize: '0.875rem'
                  }}>
                    {daysUntil} {daysUntil === 1 ? 'day' : 'days'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Soccer Recruiting Analytics */}
      {(soccerPrograms.length > 0 || coaches.length > 0 || coachContacts.length > 0) && (
        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Trophy size={28} color="var(--primary)" />
            Soccer / Football Recruiting Analytics
          </h2>

          {/* Soccer Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <Trophy size={24} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>
                {soccerPrograms.filter(p => p.level !== 'Club').length}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Varsity Programs
              </div>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <Users size={24} color="var(--secondary)" style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--secondary)' }}>
                {coaches.length}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Total Coaches
              </div>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <Mail size={24} color="var(--info)" style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--info)' }}>
                {coachContacts.length}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Coach Contacts
              </div>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <CheckCircle size={24} color="var(--success)" style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>
                {coachContacts.filter(c => c.status === 'replied').length}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Replies Received
              </div>
            </div>
          </div>

          {/* Program Breakdown by Division */}
          {soccerPrograms.length > 0 && (
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Programs by Division</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {['D1', 'D2', 'D3', 'Club'].map(level => {
                  const count = soccerPrograms.filter(p => p.level === level).length;
                  if (count === 0) return null;
                  return (
                    <div key={level} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontWeight: 600, minWidth: '80px' }}>{level}:</span>
                      <div style={{
                        flex: 1,
                        height: '2rem',
                        backgroundColor: 'var(--gray-200)',
                        borderRadius: 'var(--radius)',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${(count / soccerPrograms.length) * 100}%`,
                          height: '100%',
                          backgroundColor: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          paddingRight: '0.75rem',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.875rem'
                        }}>
                          {count}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Coach Contact Status */}
          {coachContacts.length > 0 && (
            <div className="card">
              <h3 style={{ marginBottom: '1.5rem' }}>Coach Contact Status</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {['sent', 'opened', 'replied', 'no_response', 'follow_up_scheduled'].map(status => {
                  const count = coachContacts.filter(c => c.status === status).length;
                  if (count === 0) return null;
                  const statusLabel = status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                  const color = 
                    status === 'replied' ? 'var(--success)' :
                    status === 'no_response' ? 'var(--danger)' :
                    status === 'follow_up_scheduled' ? 'var(--warning)' :
                    'var(--primary)';
                  
                  return (
                    <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontWeight: 600, minWidth: '150px' }}>{statusLabel}:</span>
                      <div style={{
                        flex: 1,
                        height: '2rem',
                        backgroundColor: 'var(--gray-200)',
                        borderRadius: 'var(--radius)',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${(count / coachContacts.length) * 100}%`,
                          height: '100%',
                          backgroundColor: color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          paddingRight: '0.75rem',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.875rem'
                        }}>
                          {count}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Motivational Message */}
      {stats.total > 0 && (
        <div style={{
          marginTop: '2rem',
          padding: '2rem',
          background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
          borderRadius: 'var(--radius-lg)',
          color: 'white',
          textAlign: 'center',
          boxShadow: 'var(--glow-pink)'
        }}>
          <h3 style={{ marginBottom: '0.5rem', color: 'white' }}>Keep Going, Milo! 🎓</h3>
          <p style={{ fontSize: '1.125rem', opacity: 0.9 }}>
            {stats.accepted > 0 
              ? `You've already got ${stats.accepted} acceptance${stats.accepted !== 1 ? 's' : ''}! Amazing work!`
              : stats.submitted > 0
              ? `${stats.submitted} application${stats.submitted !== 1 ? 's' : ''} submitted! You're making great progress!`
              : stats.inProgress > 0
              ? `${stats.inProgress} application${stats.inProgress !== 1 ? 's' : ''} in progress. Keep up the momentum!`
              : 'Time to start your applications! You\'ve got this!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Analytics;

