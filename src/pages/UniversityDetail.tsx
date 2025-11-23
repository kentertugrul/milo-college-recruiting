import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  MapPin, 
  Calendar, 
  Users, 
  CheckSquare,
  FileText,
  Video,
  Plus,
  Trash2,
  Trophy,
  Mail
} from 'lucide-react';
import { University, ChecklistItem, Essay, Interview, ApplicationStatus, SoccerProgram, Coach } from '../types';
import { getUniversityById, updateUniversity, getSoccerPrograms, getCoaches, getPlayerProfile, getHighlightPackages } from '../utils/storage';
import { formatDate, formatDateTime, getStatusColor, getSchoolSizeLabel, generateId } from '../utils/helpers';
import AddUniversityModal from '../components/AddUniversityModal';
import SoccerProgramForm from '../components/SoccerProgramForm';
import CoachForm from '../components/CoachForm';
import CoachEmailGenerator from '../components/CoachEmailGenerator';

const UniversityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [university, setUniversity] = useState<University | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'checklist' | 'essays' | 'interviews' | 'soccer'>('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Soccer state
  const [soccerPrograms, setSoccerPrograms] = useState<SoccerProgram[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [isCoachModalOpen, setIsCoachModalOpen] = useState(false);
  const [isEmailGeneratorOpen, setIsEmailGeneratorOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<SoccerProgram | undefined>();
  const [editingCoach, setEditingCoach] = useState<Coach | undefined>();
  const [selectedCoach, setSelectedCoach] = useState<Coach | undefined>();
  const [selectedProgramId, setSelectedProgramId] = useState<string>('');

  useEffect(() => {
    if (id) {
      loadUniversity();
    }
  }, [id]);

  const loadUniversity = () => {
    if (id) {
      const data = getUniversityById(id);
      if (data) {
        setUniversity(data);
        // Load soccer data
        const programs = getSoccerPrograms(id);
        setSoccerPrograms(programs);
        const allCoaches = getCoaches();
        const universityCoaches = allCoaches.filter(c => 
          programs.some(p => p.id === c.soccerProgramId)
        );
        setCoaches(universityCoaches);
      } else {
        navigate('/');
      }
    }
  };

  if (!university) {
    return <div>Loading...</div>;
  }

  const handleStatusChange = (status: ApplicationStatus) => {
    updateUniversity(university.id, { status });
    loadUniversity();
  };

  const handleNotesChange = (notes: string) => {
    updateUniversity(university.id, { notes });
    loadUniversity();
  };

  const handleAddChecklistItem = () => {
    const text = prompt('Enter checklist item:');
    if (text) {
      const newItem: ChecklistItem = {
        id: generateId(),
        text,
        completed: false,
      };
      updateUniversity(university.id, {
        checklist: [...university.checklist, newItem],
      });
      loadUniversity();
    }
  };

  const handleToggleChecklistItem = (itemId: string) => {
    const updatedChecklist = university.checklist.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    updateUniversity(university.id, { checklist: updatedChecklist });
    loadUniversity();
  };

  const handleDeleteChecklistItem = (itemId: string) => {
    const updatedChecklist = university.checklist.filter(item => item.id !== itemId);
    updateUniversity(university.id, { checklist: updatedChecklist });
    loadUniversity();
  };

  const handleAddEssay = () => {
    const title = prompt('Essay title:');
    if (title) {
      const newEssay: Essay = {
        id: generateId(),
        universityId: university.id,
        title,
        prompt: '',
        content: '',
        status: 'not_started',
      };
      updateUniversity(university.id, {
        essays: [...university.essays, newEssay],
      });
      loadUniversity();
    }
  };

  const handleUpdateEssay = (essayId: string, updates: Partial<Essay>) => {
    const updatedEssays = university.essays.map(essay =>
      essay.id === essayId ? { ...essay, ...updates } : essay
    );
    updateUniversity(university.id, { essays: updatedEssays });
    loadUniversity();
  };

  const handleDeleteEssay = (essayId: string) => {
    if (confirm('Delete this essay?')) {
      const updatedEssays = university.essays.filter(essay => essay.id !== essayId);
      updateUniversity(university.id, { essays: updatedEssays });
      loadUniversity();
    }
  };

  const handleAddInterview = () => {
    const date = prompt('Interview date (YYYY-MM-DD):');
    if (date) {
      const newInterview: Interview = {
        id: generateId(),
        universityId: university.id,
        date,
        time: '',
        type: 'virtual',
        notes: '',
        completed: false,
      };
      updateUniversity(university.id, {
        interviews: [...university.interviews, newInterview],
      });
      loadUniversity();
    }
  };

  const handleUpdateInterview = (interviewId: string, updates: Partial<Interview>) => {
    const updatedInterviews = university.interviews.map(interview =>
      interview.id === interviewId ? { ...interview, ...updates } : interview
    );
    updateUniversity(university.id, { interviews: updatedInterviews });
    loadUniversity();
  };

  const handleDeleteInterview = (interviewId: string) => {
    if (confirm('Delete this interview?')) {
      const updatedInterviews = university.interviews.filter(interview => interview.id !== interviewId);
      updateUniversity(university.id, { interviews: updatedInterviews });
      loadUniversity();
    }
  };

  const statusColor = getStatusColor(university.status);

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <Link 
          to="/" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            color: 'var(--primary)',
            textDecoration: 'none',
            marginBottom: '1rem',
            fontSize: '0.875rem',
            fontWeight: 500
          }}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ marginBottom: '0.5rem' }}>{university.name}</h1>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} />
                  {university.location} • {university.region}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={16} />
                  {getSchoolSizeLabel(university.schoolSize)}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={16} />
                  Deadline: {formatDate(university.applicationDeadline)}
                </span>
              </div>

              <div>
                <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Application Status</label>
                <select
                  value={university.status}
                  onChange={(e) => handleStatusChange(e.target.value as ApplicationStatus)}
                  style={{ 
                    maxWidth: '300px',
                    backgroundColor: `${statusColor}10`,
                    borderColor: statusColor,
                    color: statusColor,
                    fontWeight: 600
                  }}
                >
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="submitted">Submitted</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="waitlisted">Waitlisted</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="btn btn-secondary"
            >
              <Edit size={18} />
              Edit Info
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ 
        borderBottom: '2px solid var(--border)',
        marginBottom: '2rem',
        display: 'flex',
        gap: '1rem',
        overflowX: 'auto'
      }}>
        {[
          { id: 'overview', label: 'Overview', icon: FileText },
          { id: 'checklist', label: 'Checklist', icon: CheckSquare, count: university.checklist.length },
          { id: 'essays', label: 'Essays', icon: FileText, count: university.essays.length },
          { id: 'interviews', label: 'Interviews', icon: Video, count: university.interviews.length },
          { id: 'soccer', label: 'Soccer', icon: Trophy, count: soccerPrograms.length + coaches.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '1rem 1.5rem',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap',
                marginBottom: '-2px'
              }}
            >
              <Icon size={18} />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="badge" style={{
                  backgroundColor: isActive ? 'var(--primary)' : 'var(--gray-300)',
                  color: isActive ? 'white' : 'var(--text-primary)'
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div>
          {/* Admission Statistics - Always Show */}
          <div className="card" style={{ 
            marginBottom: '2rem',
            background: 'rgba(236, 72, 153, 0.05)',
            border: '2px solid var(--primary)'
          }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>📊 Admission Statistics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Acceptance Rate
                </div>
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: 700, 
                  color: university.admissionRate !== undefined ? 'var(--primary)' : 'var(--text-secondary)'
                }}>
                  {university.admissionRate !== undefined ? `${(university.admissionRate * 100).toFixed(1)}%` : 'Not Available'}
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Average IB Score
                </div>
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: 700, 
                  color: university.averageIB !== undefined ? 'var(--primary)' : 'var(--text-secondary)'
                }}>
                  {university.averageIB !== undefined ? university.averageIB : 'Not Available'}
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Average GPA
                </div>
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: 700, 
                  color: university.averageGPA !== undefined ? 'var(--primary)' : 'var(--text-secondary)'
                }}>
                  {university.averageGPA !== undefined ? university.averageGPA.toFixed(2) : 'Not Available'}
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Average SAT
                </div>
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: 700, 
                  color: university.averageSAT !== undefined ? 'var(--primary)' : 'var(--text-secondary)'
                }}>
                  {university.averageSAT !== undefined ? university.averageSAT : 'Not Available'}
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Average ACT
                </div>
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: 700, 
                  color: university.averageACT !== undefined ? 'var(--primary)' : 'var(--text-secondary)'
                }}>
                  {university.averageACT !== undefined ? university.averageACT : 'Not Available'}
                </div>
              </div>
            </div>
            {university.admissionStatsNotes && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '1rem', 
                backgroundColor: 'var(--bg-primary)',
                borderRadius: 'var(--radius)',
                fontSize: '0.875rem',
                lineHeight: 1.6
              }}>
                <strong>💡 What They Look For:</strong> {university.admissionStatsNotes}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Notes</h3>
            <textarea
              value={university.notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Add notes about this university, requirements, impressions, etc."
              rows={10}
              style={{ marginBottom: '1rem' }}
            />
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Last updated: {formatDateTime(university.updatedAt)}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'checklist' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Application Checklist</h3>
            <button onClick={handleAddChecklistItem} className="btn btn-primary btn-sm">
              <Plus size={16} />
              Add Task
            </button>
          </div>

          {university.checklist.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <CheckSquare size={48} color="var(--gray-400)" style={{ marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-secondary)' }}>No checklist items yet. Add your first task!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {university.checklist.map((item) => (
                <div
                  key={item.id}
                  className="card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleToggleChecklistItem(item.id)}
                    style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
                  />
                  <span style={{
                    flex: 1,
                    textDecoration: item.completed ? 'line-through' : 'none',
                    color: item.completed ? 'var(--text-secondary)' : 'var(--text-primary)'
                  }}>
                    {item.text}
                  </span>
                  {item.dueDate && (
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      Due: {formatDate(item.dueDate)}
                    </span>
                  )}
                  <button
                    onClick={() => handleDeleteChecklistItem(item.id)}
                    style={{
                      padding: '0.25rem',
                      backgroundColor: 'transparent',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'essays' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Application Essays</h3>
            <button onClick={handleAddEssay} className="btn btn-primary btn-sm">
              <Plus size={16} />
              Add Essay
            </button>
          </div>

          {university.essays.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <FileText size={48} color="var(--gray-400)" style={{ marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-secondary)' }}>No essays yet. Add your first essay!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {university.essays.map((essay) => (
                <div key={essay.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <input
                      type="text"
                      value={essay.title}
                      onChange={(e) => handleUpdateEssay(essay.id, { title: e.target.value })}
                      style={{ 
                        fontSize: '1.125rem', 
                        fontWeight: 600,
                        border: '1px solid transparent',
                        padding: '0.25rem 0.5rem',
                        marginLeft: '-0.5rem'
                      }}
                    />
                    <button
                      onClick={() => handleDeleteEssay(essay.id)}
                      style={{
                        padding: '0.25rem',
                        backgroundColor: 'transparent',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label>Status</label>
                    <select
                      value={essay.status}
                      onChange={(e) => handleUpdateEssay(essay.id, { status: e.target.value as any })}
                      style={{ maxWidth: '200px' }}
                    >
                      <option value="not_started">Not Started</option>
                      <option value="draft">Draft</option>
                      <option value="review">In Review</option>
                      <option value="final">Final</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label>Prompt</label>
                    <textarea
                      value={essay.prompt}
                      onChange={(e) => handleUpdateEssay(essay.id, { prompt: e.target.value })}
                      placeholder="Enter the essay prompt..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <label>Your Essay {essay.wordLimit && `(${essay.wordLimit} word limit)`}</label>
                    <textarea
                      value={essay.content}
                      onChange={(e) => handleUpdateEssay(essay.id, { content: e.target.value })}
                      placeholder="Write your essay here..."
                      rows={8}
                    />
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                      Word count: {essay.content.split(/\s+/).filter(w => w.length > 0).length}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'interviews' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Interviews</h3>
            <button onClick={handleAddInterview} className="btn btn-primary btn-sm">
              <Plus size={16} />
              Add Interview
            </button>
          </div>

          {university.interviews.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <Video size={48} color="var(--gray-400)" style={{ marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-secondary)' }}>No interviews scheduled yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {university.interviews.map((interview) => (
                <div key={interview.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        checked={interview.completed}
                        onChange={() => handleUpdateInterview(interview.id, { completed: !interview.completed })}
                        style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
                      />
                      <span style={{ fontWeight: 600, fontSize: '1.125rem' }}>
                        {interview.completed ? '✓ ' : ''}Interview - {formatDate(interview.date)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteInterview(interview.id)}
                      style={{
                        padding: '0.25rem',
                        backgroundColor: 'transparent',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label>Date</label>
                      <input
                        type="date"
                        value={interview.date}
                        onChange={(e) => handleUpdateInterview(interview.id, { date: e.target.value })}
                      />
                    </div>
                    <div>
                      <label>Time</label>
                      <input
                        type="time"
                        value={interview.time}
                        onChange={(e) => handleUpdateInterview(interview.id, { time: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label>Type</label>
                      <select
                        value={interview.type}
                        onChange={(e) => handleUpdateInterview(interview.id, { type: e.target.value as any })}
                      >
                        <option value="virtual">Virtual</option>
                        <option value="in_person">In Person</option>
                        <option value="phone">Phone</option>
                      </select>
                    </div>
                    <div>
                      <label>Interviewer</label>
                      <input
                        type="text"
                        value={interview.interviewer || ''}
                        onChange={(e) => handleUpdateInterview(interview.id, { interviewer: e.target.value })}
                        placeholder="Name"
                      />
                    </div>
                  </div>

                  <div>
                    <label>Notes</label>
                    <textarea
                      value={interview.notes}
                      onChange={(e) => handleUpdateInterview(interview.id, { notes: e.target.value })}
                      placeholder="Preparation notes, questions, impressions..."
                      rows={4}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Soccer Tab */}
      {activeTab === 'soccer' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Soccer / Football Program</h3>
            {soccerPrograms.length === 0 && (
              <button onClick={() => setIsProgramModalOpen(true)} className="btn btn-primary btn-sm">
                <Plus size={16} />
                Add Soccer Program
              </button>
            )}
          </div>

          {soccerPrograms.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <Trophy size={48} color="var(--gray-400)" style={{ marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                No soccer program added yet for this university.
              </p>
              <button onClick={() => setIsProgramModalOpen(true)} className="btn btn-primary">
                <Plus size={20} />
                Add Soccer Program
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {soccerPrograms.map((program) => {
                const programCoaches = coaches.filter(c => c.soccerProgramId === program.id);
                
                return (
                  <div key={program.id} className="card">
                    {/* Program Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <h4 style={{ marginBottom: '0.5rem' }}>{program.programName}</h4>
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                          <span className="badge" style={{
                            backgroundColor: 'var(--primary)',
                            color: 'white'
                          }}>
                            {program.level}
                          </span>
                          {program.conference && (
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                              {program.conference}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setEditingProgram(program);
                          setIsProgramModalOpen(true);
                        }}
                        className="btn btn-secondary btn-sm"
                      >
                        <Edit size={14} />
                      </button>
                    </div>

                    {/* Program Details */}
                    {(program.styleTags && program.styleTags.length > 0) && (
                      <div style={{ marginBottom: '0.75rem' }}>
                        <strong style={{ fontSize: '0.875rem' }}>Playing Style: </strong>
                        {program.styleTags.map(tag => (
                          <span key={tag} className="badge" style={{ marginRight: '0.5rem', backgroundColor: 'var(--gray-200)', color: 'var(--text-primary)' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {program.intlPlayersCount !== undefined && (
                      <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                        <strong>International Players:</strong> {program.intlPlayersCount}
                        {program.intlPlayersRatio !== undefined && ` (${(program.intlPlayersRatio * 100).toFixed(0)}%)`}
                      </div>
                    )}

                    {program.recentRecordSummary && (
                      <div style={{
                        padding: '0.75rem',
                        backgroundColor: 'var(--gray-50)',
                        borderRadius: 'var(--radius)',
                        marginBottom: '1rem',
                        fontSize: '0.875rem'
                      }}>
                        <strong>Recent Record:</strong> {program.recentRecordSummary}
                      </div>
                    )}

                    {/* Links */}
                    {(program.officialSiteUrl || program.rosterUrl || program.staffUrl) && (
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        {program.officialSiteUrl && (
                          <a href={program.officialSiteUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                            Team Site
                          </a>
                        )}
                        {program.rosterUrl && (
                          <a href={program.rosterUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                            Roster
                          </a>
                        )}
                        {program.staffUrl && (
                          <a href={program.staffUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                            Staff
                          </a>
                        )}
                      </div>
                    )}

                    {program.notes && (
                      <div style={{
                        padding: '0.75rem',
                        backgroundColor: '#FEF3C7',
                        borderRadius: 'var(--radius)',
                        marginBottom: '1rem',
                        fontSize: '0.875rem'
                      }}>
                        <strong>Your Notes:</strong> {program.notes}
                      </div>
                    )}

                    {/* Coaches Section */}
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h4>Coaches ({programCoaches.length})</h4>
                        <button
                          onClick={() => {
                            setSelectedProgramId(program.id);
                            setEditingCoach(undefined);
                            setIsCoachModalOpen(true);
                          }}
                          className="btn btn-primary btn-sm"
                        >
                          <Plus size={16} />
                          Add Coach
                        </button>
                      </div>

                      {programCoaches.length === 0 ? (
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>
                          No coaches added yet
                        </p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {programCoaches.map((coach) => (
                            <div
                              key={coach.id}
                              style={{
                                padding: '1rem',
                                backgroundColor: 'var(--gray-50)',
                                borderRadius: 'var(--radius)',
                                borderLeft: '3px solid var(--primary)'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                <div>
                                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{coach.name}</div>
                                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{coach.role}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                  <button
                                    onClick={() => {
                                      setSelectedCoach(coach);
                                      setIsEmailGeneratorOpen(true);
                                    }}
                                    className="btn btn-primary btn-sm"
                                    title="Generate Email"
                                  >
                                    <Mail size={14} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedProgramId(program.id);
                                      setEditingCoach(coach);
                                      setIsCoachModalOpen(true);
                                    }}
                                    className="btn btn-secondary btn-sm"
                                  >
                                    <Edit size={14} />
                                  </button>
                                </div>
                              </div>

                              {/* Contact Info */}
                              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                                {coach.email && <span>📧 {coach.email}</span>}
                                {coach.phone && <span>📞 {coach.phone}</span>}
                              </div>

                              {/* Quick Info */}
                              {(coach.almaMater || coach.recruitingFocus) && (
                                <div style={{ marginTop: '0.75rem', fontSize: '0.875rem' }}>
                                  {coach.almaMater && (
                                    <div style={{ color: 'var(--text-secondary)' }}>
                                      <strong>Alma Mater:</strong> {coach.almaMater}
                                    </div>
                                  )}
                                  {coach.recruitingFocus && (
                                    <div style={{ color: 'var(--text-secondary)' }}>
                                      <strong>Recruiting Focus:</strong> {coach.recruitingFocus}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Links */}
                              {(coach.bioUrl || coach.linkedinUrl) && (
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                                  {coach.bioUrl && (
                                    <a href={coach.bioUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                                      Bio
                                    </a>
                                  )}
                                  {coach.linkedinUrl && (
                                    <a href={coach.linkedinUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                                      LinkedIn
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <AddUniversityModal
          university={university}
          onClose={() => setIsEditModalOpen(false)}
          onAdd={() => {
            loadUniversity();
            setIsEditModalOpen(false);
          }}
        />
      )}

      {/* Soccer Modals */}
      {isProgramModalOpen && (
        <SoccerProgramForm
          program={editingProgram}
          universityId={university.id}
          onClose={() => {
            setIsProgramModalOpen(false);
            setEditingProgram(undefined);
          }}
          onSave={() => {
            loadUniversity();
            setIsProgramModalOpen(false);
            setEditingProgram(undefined);
          }}
        />
      )}

      {isCoachModalOpen && (
        <CoachForm
          coach={editingCoach}
          soccerProgramId={selectedProgramId}
          onClose={() => {
            setIsCoachModalOpen(false);
            setEditingCoach(undefined);
            setSelectedProgramId('');
          }}
          onSave={() => {
            loadUniversity();
            setIsCoachModalOpen(false);
            setEditingCoach(undefined);
            setSelectedProgramId('');
          }}
        />
      )}

      {isEmailGeneratorOpen && selectedCoach && (
        <CoachEmailGenerator
          coach={selectedCoach}
          program={soccerPrograms.find(p => p.id === selectedCoach.soccerProgramId)!}
          universityName={university.name}
          playerProfile={getPlayerProfile()}
          highlightPackages={getHighlightPackages()}
          onClose={() => {
            setIsEmailGeneratorOpen(false);
            setSelectedCoach(undefined);
          }}
          onSent={() => {
            loadUniversity();
          }}
        />
      )}
    </div>
  );
};

export default UniversityDetail;

