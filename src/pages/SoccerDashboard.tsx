import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Video, User, Trophy, Users, Mail, AlertCircle, ExternalLink, Edit } from 'lucide-react';
import {
  getSoccerPrograms,
  getCoaches,
  getCoachContacts,
  getHighlightPackages,
  getPlayerProfile,
  getUniversities,
} from '../utils/storage';
import { SoccerProgram, Coach, CoachContact, HighlightPackage, PlayerProfile } from '../types';
import { formatDateTime, isDeadlineApproaching } from '../utils/helpers';
import PlayerProfileForm from '../components/PlayerProfileForm';
import HighlightPackageForm from '../components/HighlightPackageForm';

const SoccerDashboard = () => {
  const [soccerPrograms, setSoccerPrograms] = useState<SoccerProgram[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [coachContacts, setCoachContacts] = useState<CoachContact[]>([]);
  const [highlightPackages, setHighlightPackages] = useState<HighlightPackage[]>([]);
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null);
  const [universities, setUniversities] = useState<any[]>([]);
  
  const [isPlayerProfileModalOpen, setIsPlayerProfileModalOpen] = useState(false);
  const [isHighlightModalOpen, setIsHighlightModalOpen] = useState(false);
  const [editingHighlight, setEditingHighlight] = useState<HighlightPackage | undefined>();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setSoccerPrograms(getSoccerPrograms());
    setCoaches(getCoaches());
    setCoachContacts(getCoachContacts());
    setHighlightPackages(getHighlightPackages());
    setPlayerProfile(getPlayerProfile());
    setUniversities(getUniversities());
  };

  const handleProfileSaved = () => {
    loadData();
    setIsPlayerProfileModalOpen(false);
  };

  const handleHighlightSaved = () => {
    loadData();
    setIsHighlightModalOpen(false);
    setEditingHighlight(undefined);
  };

  const handleEditHighlight = (pkg: HighlightPackage) => {
    setEditingHighlight(pkg);
    setIsHighlightModalOpen(true);
  };

  // Statistics
  const varsityPrograms = soccerPrograms.filter(p => p.level !== 'Club').length;
  const totalCoaches = coaches.length;
  const contactsMade = coachContacts.length;
  const followUpsDue = coachContacts.filter(c => 
    c.nextActionDate && 
    isDeadlineApproaching(c.nextActionDate, 7) && 
    (c.status === 'no_response' || c.status === 'follow_up_scheduled')
  ).length;

  // Recent coach contacts
  const recentContacts = coachContacts
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Trophy size={32} color="var(--primary)" />
              Soccer Recruiting Hub ⚽
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
              Showcase your skills, research programs, and connect with coaches.<br/>
              <strong style={{ color: 'var(--primary)' }}>This is where you take control of your recruiting journey!</strong>
            </p>
          </div>
        </div>

        {/* Quick Tips */}
        {!playerProfile && highlightPackages.length === 0 && soccerPrograms.length === 0 && (
          <div style={{
            padding: '1.5rem',
            backgroundColor: '#EFF6FF',
            border: '2px solid var(--primary)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🚀 Getting Started with Soccer Recruiting
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
              <div>
                <strong>Step 1:</strong> Create your player profile below to showcase who you are
              </div>
              <div>
                <strong>Step 2:</strong> Add your highlight videos so coaches can see you play
              </div>
              <div>
                <strong>Step 3:</strong> Research programs on your university pages (Soccer tab)
              </div>
              <div>
                <strong>Step 4:</strong> Add coaches and use the email generator to reach out!
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <Trophy size={24} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>
            {varsityPrograms}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Varsity Programs
          </div>
        </div>
        
        <div className="card" style={{ textAlign: 'center' }}>
          <Users size={24} color="var(--secondary)" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--secondary)' }}>
            {totalCoaches}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Total Coaches
          </div>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <Mail size={24} color="var(--info)" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--info)' }}>
            {contactsMade}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Contacts Made
          </div>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <AlertCircle size={24} color={followUpsDue > 0 ? 'var(--warning)' : 'var(--success)'} style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '2rem', fontWeight: 700, color: followUpsDue > 0 ? 'var(--warning)' : 'var(--success)' }}>
            {followUpsDue}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Follow-ups Due
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Player Profile */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={20} />
                Player Profile
              </h3>
              <button
                onClick={() => setIsPlayerProfileModalOpen(true)}
                className="btn btn-primary btn-sm"
              >
                {playerProfile ? <Edit size={16} /> : <Plus size={16} />}
                {playerProfile ? 'Edit' : 'Create'}
              </button>
            </div>

            {playerProfile ? (
              <div>
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ marginBottom: '0.5rem' }}>{playerProfile.name}</h4>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <span>Position: <strong>{playerProfile.primaryPosition}</strong></span>
                    {playerProfile.height && <span>Height: <strong>{playerProfile.height}</strong></span>}
                    {playerProfile.dominantFoot && <span>Foot: <strong>{playerProfile.dominantFoot}</strong></span>}
                  </div>
                </div>
                {playerProfile.summary && (
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {playerProfile.summary}
                  </p>
                )}
                {playerProfile.secondaryPositions && playerProfile.secondaryPositions.length > 0 && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <strong style={{ fontSize: '0.875rem' }}>Also plays:</strong>{' '}
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {playerProfile.secondaryPositions.join(', ')}
                    </span>
                  </div>
                )}
                {playerProfile.languages && playerProfile.languages.length > 0 && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <strong style={{ fontSize: '0.875rem' }}>Languages:</strong>{' '}
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {playerProfile.languages.join(', ')}
                    </span>
                  </div>
                )}
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '0.75rem', 
                  backgroundColor: '#D1FAE5', 
                  borderRadius: 'var(--radius)',
                  fontSize: '0.875rem',
                  color: '#065F46'
                }}>
                  <strong>✓ Profile Complete!</strong> Coaches can now learn about you through your emails.
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                <User size={48} color="var(--gray-400)" style={{ marginBottom: '1rem' }} />
                <p style={{ marginBottom: '0.5rem' }}>Create your player profile to get started!</p>
                <p style={{ fontSize: '0.875rem', fontStyle: 'italic' }}>
                  💡 This will be automatically included in your coach emails
                </p>
              </div>
            )}
          </div>

          {/* Highlight Videos */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Video size={20} />
                Highlight Videos ({highlightPackages.length})
              </h3>
              <button
                onClick={() => {
                  setEditingHighlight(undefined);
                  setIsHighlightModalOpen(true);
                }}
                className="btn btn-primary btn-sm"
              >
                <Plus size={16} />
                Add Video
              </button>
            </div>

            {highlightPackages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                <Video size={48} color="var(--gray-400)" style={{ marginBottom: '1rem' }} />
                <p>No highlight videos yet. Add your first video package!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {highlightPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    style={{
                      padding: '1rem',
                      backgroundColor: 'var(--gray-50)',
                      borderRadius: 'var(--radius)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                        {pkg.playerName} - {pkg.primaryPosition}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        {pkg.tags && pkg.tags.length > 0 && pkg.tags.map(tag => (
                          <span key={tag} className="badge" style={{ marginRight: '0.5rem', backgroundColor: 'var(--gray-300)', color: 'var(--text-primary)' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {pkg.youtubeUrl && (
                          <a href={pkg.youtubeUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                            <ExternalLink size={14} />
                            YouTube
                          </a>
                        )}
                        {pkg.vimeoUrl && (
                          <a href={pkg.vimeoUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                            <ExternalLink size={14} />
                            Vimeo
                          </a>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleEditHighlight(pkg)}
                      className="btn btn-secondary btn-sm"
                    >
                      <Edit size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Programs by University */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Soccer Programs by University ({soccerPrograms.length})</h3>
            
            {soccerPrograms.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                <Trophy size={48} color="var(--gray-400)" style={{ marginBottom: '1rem' }} />
                <p>No soccer programs added yet.</p>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  Go to a university detail page to add its soccer program.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {soccerPrograms.map((program) => {
                  const university = universities.find(u => u.id === program.universityId);
                  const programCoaches = coaches.filter(c => c.soccerProgramId === program.id);
                  const programContacts = coachContacts.filter(c => 
                    programCoaches.some(coach => coach.id === c.coachId)
                  );

                  return (
                    <div
                      key={program.id}
                      style={{
                        padding: '1rem',
                        backgroundColor: 'var(--gray-50)',
                        borderRadius: 'var(--radius)',
                        borderLeft: `4px solid ${
                          program.level === 'D1' ? 'var(--primary)' :
                          program.level === 'D2' ? 'var(--secondary)' :
                          program.level === 'D3' ? 'var(--info)' :
                          'var(--gray-400)'
                        }`
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div>
                          <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                            {program.programName}
                          </div>
                          {university && (
                            <Link
                              to={`/university/${university.id}`}
                              style={{
                                fontSize: '0.875rem',
                                color: 'var(--primary)',
                                textDecoration: 'none'
                              }}
                            >
                              {university.name} →
                            </Link>
                          )}
                        </div>
                        <span className="badge" style={{
                          backgroundColor: 'var(--primary)',
                          color: 'white'
                        }}>
                          {program.level}
                        </span>
                      </div>
                      
                      {program.conference && (
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                          {program.conference}
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', marginTop: '0.75rem' }}>
                        <span>
                          <strong>{programCoaches.length}</strong> {programCoaches.length === 1 ? 'coach' : 'coaches'}
                        </span>
                        <span>
                          <strong>{programContacts.length}</strong> {programContacts.length === 1 ? 'contact' : 'contacts'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Coach Contacts / Follow-ups */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Recent Coach Contacts</h3>
            
            {recentContacts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                <Mail size={48} color="var(--gray-400)" style={{ marginBottom: '1rem' }} />
                <p>No coach contacts yet. Start reaching out!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {recentContacts.map((contact) => {
                  const coach = coaches.find(c => c.id === contact.coachId);
                  const program = coach ? soccerPrograms.find(p => p.id === coach.soccerProgramId) : null;
                  const university = program ? universities.find(u => u.id === program.universityId) : null;

                  return (
                    <div
                      key={contact.id}
                      style={{
                        padding: '0.75rem',
                        backgroundColor: 'var(--gray-50)',
                        borderRadius: 'var(--radius)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                            {coach?.name || 'Unknown Coach'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {university?.name || 'Unknown University'}
                          </div>
                        </div>
                        <span className="badge" style={{
                          backgroundColor: 
                            contact.status === 'replied' ? '#D1FAE5' :
                            contact.status === 'no_response' ? '#FEE2E2' :
                            contact.status === 'follow_up_scheduled' ? '#FEF3C7' :
                            '#E5E7EB',
                          color:
                            contact.status === 'replied' ? '#065F46' :
                            contact.status === 'no_response' ? '#991B1B' :
                            contact.status === 'follow_up_scheduled' ? '#92400E' :
                            '#374151',
                          fontSize: '0.625rem'
                        }}>
                          {contact.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {formatDateTime(contact.timestamp)} · {contact.channel}
                      </div>
                      {contact.nextActionDate && (
                        <div style={{ 
                          fontSize: '0.75rem',
                          marginTop: '0.5rem',
                          color: isDeadlineApproaching(contact.nextActionDate, 7) ? 'var(--warning)' : 'var(--text-secondary)'
                        }}>
                          Follow-up: {formatDateTime(contact.nextActionDate)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {coachContacts.length > 5 && (
              <Link
                to="/communications"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  marginTop: '1rem',
                  color: 'var(--primary)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                View All Contacts →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {isPlayerProfileModalOpen && (
        <PlayerProfileForm
          profile={playerProfile}
          onClose={() => setIsPlayerProfileModalOpen(false)}
          onSave={handleProfileSaved}
        />
      )}

      {isHighlightModalOpen && (
        <HighlightPackageForm
          package={editingHighlight}
          onClose={() => {
            setIsHighlightModalOpen(false);
            setEditingHighlight(undefined);
          }}
          onSave={handleHighlightSaved}
        />
      )}
    </div>
  );
};

export default SoccerDashboard;

