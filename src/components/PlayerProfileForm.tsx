import { useState } from 'react';
import { X } from 'lucide-react';
import { PlayerProfile } from '../types';
import { savePlayerProfile } from '../utils/storage';
import { generateId } from '../utils/helpers';

interface PlayerProfileFormProps {
  profile: PlayerProfile | null;
  onClose: () => void;
  onSave: () => void;
}

const PlayerProfileForm = ({ profile, onClose, onSave }: PlayerProfileFormProps) => {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    primaryPosition: profile?.primaryPosition || '',
    secondaryPositions: profile?.secondaryPositions?.join(', ') || '',
    height: profile?.height || '',
    dominantFoot: profile?.dominantFoot || '' as '' | 'left' | 'right' | 'both',
    languages: profile?.languages?.join(', ') || '',
    clubs: profile?.clubs?.join(', ') || '',
    summary: profile?.summary || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const profileData: PlayerProfile = {
      id: profile?.id || generateId(),
      name: formData.name,
      primaryPosition: formData.primaryPosition,
      secondaryPositions: formData.secondaryPositions
        ? formData.secondaryPositions.split(',').map(s => s.trim()).filter(s => s)
        : undefined,
      height: formData.height || undefined,
      dominantFoot: formData.dominantFoot || undefined,
      languages: formData.languages
        ? formData.languages.split(',').map(s => s.trim()).filter(s => s)
        : undefined,
      clubs: formData.clubs
        ? formData.clubs.split(',').map(s => s.trim()).filter(s => s)
        : undefined,
      summary: formData.summary || undefined,
      highlightPackageIds: profile?.highlightPackageIds || [],
      createdAt: profile?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    savePlayerProfile(profileData);
    onSave();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem', maxWidth: '600px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>{profile ? 'Edit Player Profile' : 'Create Player Profile'}</h2>
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

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Name */}
            <div>
              <label htmlFor="name">Player Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Full name"
              />
            </div>

            {/* Primary Position */}
            <div>
              <label htmlFor="primaryPosition">Primary Position *</label>
              <input
                type="text"
                id="primaryPosition"
                name="primaryPosition"
                value={formData.primaryPosition}
                onChange={handleChange}
                required
                placeholder="e.g., Center Back, Striker, Midfielder"
              />
            </div>

            {/* Secondary Positions */}
            <div>
              <label htmlFor="secondaryPositions">Secondary Positions</label>
              <input
                type="text"
                id="secondaryPositions"
                name="secondaryPositions"
                value={formData.secondaryPositions}
                onChange={handleChange}
                placeholder="Comma separated, e.g., Right Back, Defensive Midfielder"
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Separate positions with commas
              </div>
            </div>

            {/* Height and Dominant Foot */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label htmlFor="height">Height</label>
                <input
                  type="text"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="e.g., 5'10 or 178cm"
                />
              </div>

              <div>
                <label htmlFor="dominantFoot">Dominant Foot</label>
                <select
                  id="dominantFoot"
                  name="dominantFoot"
                  value={formData.dominantFoot}
                  onChange={handleChange}
                >
                  <option value="">Select...</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                  <option value="both">Both</option>
                </select>
              </div>
            </div>

            {/* Languages */}
            <div>
              <label htmlFor="languages">Languages</label>
              <input
                type="text"
                id="languages"
                name="languages"
                value={formData.languages}
                onChange={handleChange}
                placeholder="e.g., English, Spanish, Turkish"
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Separate languages with commas
              </div>
            </div>

            {/* Clubs */}
            <div>
              <label htmlFor="clubs">Current/Past Clubs</label>
              <input
                type="text"
                id="clubs"
                name="clubs"
                value={formData.clubs}
                onChange={handleChange}
                placeholder="e.g., FC Barcelona Academy, Local High School Team"
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Separate clubs with commas
              </div>
            </div>

            {/* Summary */}
            <div>
              <label htmlFor="summary">Player Bio / Summary</label>
              <textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                placeholder="Brief summary of your playing style, achievements, and aspirations..."
                rows={4}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                {profile ? 'Save Changes' : 'Create Profile'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlayerProfileForm;

