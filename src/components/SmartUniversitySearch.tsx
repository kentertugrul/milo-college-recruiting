import { useState } from 'react';
import { Search, Loader, Check, X, Sparkles, AlertCircle, Key } from 'lucide-react';
import { searchUniversity, UniversityResearchData, isAPIKeyConfigured, setOpenAIKey } from '../utils/openai';
import { University, SoccerProgram } from '../types';
import { addUniversity, addSoccerProgram } from '../utils/storage';
import { generateId } from '../utils/helpers';

interface SmartUniversitySearchProps {
  onClose: () => void;
  onAdd: () => void;
}

const SmartUniversitySearch = ({ onClose, onAdd }: SmartUniversitySearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [researchData, setResearchData] = useState<UniversityResearchData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAPIKeyPrompt, setShowAPIKeyPrompt] = useState(!isAPIKeyConfigured());
  const [apiKey, setApiKeyInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  // Editable form state
  const [formData, setFormData] = useState<Partial<UniversityResearchData>>({});

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError(null);
    setResearchData(null);

    try {
      const data = await searchUniversity(searchQuery);
      setResearchData(data);
      setFormData(data || {});
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to search university. Please try again.');
      if (err.message?.includes('API key')) {
        setShowAPIKeyPrompt(true);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveAPIKey = () => {
    if (apiKey.trim()) {
      setOpenAIKey(apiKey.trim());
      setShowAPIKeyPrompt(false);
      setApiKeyInput('');
    }
  };

  const handleConfirmAndAdd = () => {
    if (!formData) return;

    const now = new Date().toISOString();

    // Create university
    const newUniversity: University = {
      id: generateId(),
      name: formData.name || '',
      location: formData.location || '',
      region: formData.region || 'Northeast',
      schoolSize: formData.schoolSize || 'medium',
      status: 'not_started',
      applicationDeadline: formData.applicationDeadline || '',
      earlyDeadline: formData.earlyDeadline,
      notes: formData.notes || '',
      admissionRate: formData.admissionRate,
      averageIB: formData.averageIB,
      averageGPA: formData.averageGPA,
      averageSAT: formData.averageSAT,
      averageACT: formData.averageACT,
      admissionStatsNotes: formData.admissionStatsNotes,
      checklist: [],
      essays: [],
      interviews: [],
      createdAt: now,
      updatedAt: now,
    };

    addUniversity(newUniversity);

    // Create soccer program if applicable
    if (formData.hasSoccerProgram && formData.soccerProgramName) {
      const soccerProgram: SoccerProgram = {
        id: generateId(),
        universityId: newUniversity.id,
        programName: formData.soccerProgramName,
        level: formData.soccerLevel || 'D1',
        conference: formData.conference,
        officialSiteUrl: formData.soccerWebsiteUrl,
        rosterUrl: formData.rosterUrl,
        staffUrl: formData.staffUrl,
        notes: 'Auto-populated from research',
        createdAt: now,
        updatedAt: now,
      };

      addSoccerProgram(soccerProgram);
    }

    onAdd();
  };

  const handleFormChange = (field: keyof UniversityResearchData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Sparkles size={24} color="var(--primary)" />
            Smart University Search
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              borderRadius: 'var(--radius)'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* API Key Prompt */}
        {showAPIKeyPrompt && (
          <div style={{
            padding: '1.5rem',
            backgroundColor: 'rgba(236, 72, 153, 0.1)',
            border: '2px solid var(--primary)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
              <Key size={20} />
              OpenAI API Key Required
            </h3>
            <p style={{ fontSize: '0.875rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
              To use smart university search, you need an OpenAI API key. This enables automatic research and data population.
              <br /><br />
              <strong>Get your API key:</strong> <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>platform.openai.com/api-keys</a>
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="sk-..."
                style={{ flex: 1 }}
              />
              <button onClick={handleSaveAPIKey} className="btn btn-primary">
                <Key size={16} />
                Save Key
              </button>
            </div>
            <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              💡 Your API key is stored locally and never shared. You can remove it anytime.
            </p>
          </div>
        )}

        {/* Search Input */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
            Enter University Name
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search 
                size={20} 
                style={{ 
                  position: 'absolute', 
                  left: '0.75rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: 'var(--text-secondary)'
                }} 
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isSearching) {
                    handleSearch();
                  }
                }}
                placeholder="e.g., Harvard University, Stanford, MIT..."
                style={{ paddingLeft: '2.5rem' }}
                disabled={isSearching || showAPIKeyPrompt}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim() || showAPIKeyPrompt}
              className="btn btn-primary"
              style={{ minWidth: '120px' }}
            >
              {isSearching ? (
                <>
                  <Loader size={18} className="spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Research
                </>
              )}
            </button>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', fontStyle: 'italic' }}>
            💡 AI will automatically research the university and populate all available information
          </p>
        </div>

        {/* Loading State */}
        {isSearching && (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <Loader size={48} color="var(--primary)" className="spin" style={{ marginBottom: '1rem' }} />
            <p style={{ color: 'var(--text-secondary)' }}>
              Researching {searchQuery}...
              <br />
              <span style={{ fontSize: '0.875rem' }}>Fetching university details, deadlines, and soccer program info</span>
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{
            padding: '1.5rem',
            backgroundColor: 'rgba(248, 113, 113, 0.1)',
            border: '1px solid var(--danger)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem'
          }}>
            <AlertCircle size={24} color="var(--danger)" />
            <div style={{ flex: 1 }}>
              <h4 style={{ marginBottom: '0.5rem', color: 'var(--danger)' }}>Search Failed</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {researchData && !isSearching && (
          <div>
            {/* Confirmation Header */}
            <div style={{
              padding: '1.5rem',
              backgroundColor: 'rgba(236, 72, 153, 0.1)',
              border: '2px solid var(--primary)',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={24} />
                Is this correct?
              </h3>
              <h4 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                {formData.name || researchData.name}
              </h4>
              <p style={{ color: 'var(--text-secondary)' }}>
                {formData.location || researchData.location}
              </p>
            </div>

            {/* Edit/View Toggle */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn btn-secondary btn-sm"
              >
                {isEditing ? 'View Mode' : 'Edit Details'}
              </button>
            </div>

            {/* Data Preview/Edit */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>University Information</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Name */}
                <div>
                  <label>University Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                    />
                  ) : (
                    <div style={{ padding: '0.5rem 0.75rem', backgroundColor: 'var(--gray-100)', borderRadius: 'var(--radius)' }}>
                      {formData.name}
                    </div>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label>Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => handleFormChange('location', e.target.value)}
                    />
                  ) : (
                    <div style={{ padding: '0.5rem 0.75rem', backgroundColor: 'var(--gray-100)', borderRadius: 'var(--radius)' }}>
                      {formData.location}
                    </div>
                  )}
                </div>

                {/* Region and Size */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label>Region</label>
                    {isEditing ? (
                      <select
                        value={formData.region || ''}
                        onChange={(e) => handleFormChange('region', e.target.value)}
                      >
                        <option value="Northeast">Northeast</option>
                        <option value="Southeast">Southeast</option>
                        <option value="Midwest">Midwest</option>
                        <option value="Southwest">Southwest</option>
                        <option value="West">West</option>
                        <option value="International">International</option>
                      </select>
                    ) : (
                      <div style={{ padding: '0.5rem 0.75rem', backgroundColor: 'var(--gray-100)', borderRadius: 'var(--radius)' }}>
                        {formData.region}
                      </div>
                    )}
                  </div>

                  <div>
                    <label>School Size</label>
                    {isEditing ? (
                      <select
                        value={formData.schoolSize || ''}
                        onChange={(e) => handleFormChange('schoolSize', e.target.value)}
                      >
                        <option value="small">Small (less than 2,000)</option>
                        <option value="medium">Medium (2,000-10,000)</option>
                        <option value="large">Large (10,000-20,000)</option>
                        <option value="very_large">Very Large (over 20,000)</option>
                      </select>
                    ) : (
                      <div style={{ padding: '0.5rem 0.75rem', backgroundColor: 'var(--gray-100)', borderRadius: 'var(--radius)' }}>
                        {formData.schoolSize === 'small' ? 'Small (<2,000)' :
                         formData.schoolSize === 'medium' ? 'Medium (2,000-10,000)' :
                         formData.schoolSize === 'large' ? 'Large (10,000-20,000)' :
                         'Very Large (>20,000)'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Deadlines */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label>Application Deadline</label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={formData.applicationDeadline || ''}
                        onChange={(e) => handleFormChange('applicationDeadline', e.target.value)}
                      />
                    ) : (
                      <div style={{ padding: '0.5rem 0.75rem', backgroundColor: 'var(--gray-100)', borderRadius: 'var(--radius)' }}>
                        {formData.applicationDeadline ? new Date(formData.applicationDeadline).toLocaleDateString() : 'Not set'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label>Early Deadline</label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={formData.earlyDeadline || ''}
                        onChange={(e) => handleFormChange('earlyDeadline', e.target.value)}
                      />
                    ) : (
                      <div style={{ padding: '0.5rem 0.75rem', backgroundColor: 'var(--gray-100)', borderRadius: 'var(--radius)' }}>
                        {formData.earlyDeadline ? new Date(formData.earlyDeadline).toLocaleDateString() : 'Not applicable'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label>Notes & Overview</label>
                  {isEditing ? (
                    <textarea
                      value={formData.notes || ''}
                      onChange={(e) => handleFormChange('notes', e.target.value)}
                      rows={4}
                    />
                  ) : (
                    <div style={{ 
                      padding: '0.75rem', 
                      backgroundColor: 'var(--gray-100)', 
                      borderRadius: 'var(--radius)',
                      fontSize: '0.875rem',
                      lineHeight: 1.6
                    }}>
                      {formData.notes}
                    </div>
                  )}
                </div>

                {/* Admission Statistics */}
                {(formData.admissionRate || formData.averageIB || formData.averageGPA || formData.averageSAT || formData.averageACT) && (
                  <div style={{
                    padding: '1rem',
                    backgroundColor: 'rgba(236, 72, 153, 0.1)',
                    border: '1px solid var(--primary)',
                    borderRadius: 'var(--radius)',
                  }}>
                    <h5 style={{ marginBottom: '0.75rem', color: 'var(--primary)' }}>📊 Admission Statistics</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem', fontSize: '0.875rem' }}>
                      {formData.admissionRate !== undefined && (
                        <div>
                          <strong>Acceptance Rate:</strong><br/>
                          <span style={{ fontSize: '1.25rem', color: 'var(--primary)', fontWeight: 700 }}>
                            {(formData.admissionRate * 100).toFixed(1)}%
                          </span>
                        </div>
                      )}
                      {formData.averageIB !== undefined && (
                        <div>
                          <strong>Average IB:</strong><br/>
                          <span style={{ fontSize: '1.25rem', color: 'var(--primary)', fontWeight: 700 }}>
                            {formData.averageIB}
                          </span>
                        </div>
                      )}
                      {formData.averageGPA !== undefined && (
                        <div>
                          <strong>Average GPA:</strong><br/>
                          <span style={{ fontSize: '1.25rem', color: 'var(--primary)', fontWeight: 700 }}>
                            {formData.averageGPA.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {formData.averageSAT !== undefined && (
                        <div>
                          <strong>Average SAT:</strong><br/>
                          <span style={{ fontSize: '1.25rem', color: 'var(--primary)', fontWeight: 700 }}>
                            {formData.averageSAT}
                          </span>
                        </div>
                      )}
                      {formData.averageACT !== undefined && (
                        <div>
                          <strong>Average ACT:</strong><br/>
                          <span style={{ fontSize: '1.25rem', color: 'var(--primary)', fontWeight: 700 }}>
                            {formData.averageACT}
                          </span>
                        </div>
                      )}
                    </div>
                    {formData.admissionStatsNotes && (
                      <p style={{ fontSize: '0.875rem', marginTop: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                        💡 {formData.admissionStatsNotes}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Soccer Program Data */}
            {formData.hasSoccerProgram && (
              <div className="card" style={{ 
                marginBottom: '1.5rem',
                background: 'rgba(236, 72, 153, 0.05)',
                borderLeft: '4px solid var(--primary)'
              }}>
                <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  ⚽ Soccer Program Found!
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                  <div>
                    <strong>Program:</strong> {formData.soccerProgramName}
                  </div>
                  <div>
                    <strong>Division:</strong> {formData.soccerLevel}
                  </div>
                  {formData.conference && (
                    <div>
                      <strong>Conference:</strong> {formData.conference}
                    </div>
                  )}
                  {(formData.soccerWebsiteUrl || formData.rosterUrl || formData.staffUrl) && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                      {formData.soccerWebsiteUrl && (
                        <a href={formData.soccerWebsiteUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                          Team Site
                        </a>
                      )}
                      {formData.rosterUrl && (
                        <a href={formData.rosterUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                          Roster
                        </a>
                      )}
                      {formData.staffUrl && (
                        <a href={formData.staffUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                          Staff
                        </a>
                      )}
                    </div>
                  )}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '1rem', fontStyle: 'italic' }}>
                  ✨ Soccer program will be automatically added to this university
                </p>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                onClick={() => {
                  setResearchData(null);
                  setFormData({});
                  setSearchQuery('');
                  setError(null);
                }}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Search Again
              </button>
              <button
                onClick={handleConfirmAndAdd}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                <Check size={20} />
                Confirm & Add to My List
              </button>
            </div>
          </div>
        )}

        <style>{`
          .spin {
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default SmartUniversitySearch;

