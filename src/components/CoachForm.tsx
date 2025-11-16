import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Coach } from '../types';
import { addCoach, updateCoach, deleteCoach } from '../utils/storage';
import { generateId } from '../utils/helpers';

interface CoachFormProps {
  coach?: Coach;
  soccerProgramId: string;
  onClose: () => void;
  onSave: () => void;
}

const CoachForm = ({ coach, soccerProgramId, onClose, onSave }: CoachFormProps) => {
  const [formData, setFormData] = useState({
    name: coach?.name || '',
    role: coach?.role || '',
    email: coach?.email || '',
    phone: coach?.phone || '',
    bioUrl: coach?.bioUrl || '',
    linkedinUrl: coach?.linkedinUrl || '',
    almaMater: coach?.almaMater || '',
    coachingHistory: coach?.coachingHistory || '',
    playingBackground: coach?.playingBackground || '',
    recruitingFocus: coach?.recruitingFocus || '',
    favoriteFormations: coach?.favoriteFormations?.join(', ') || '',
    personalNotes: coach?.personalNotes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const coachData: Coach = {
      id: coach?.id || generateId(),
      soccerProgramId,
      name: formData.name,
      role: formData.role,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      bioUrl: formData.bioUrl || undefined,
      linkedinUrl: formData.linkedinUrl || undefined,
      almaMater: formData.almaMater || undefined,
      coachingHistory: formData.coachingHistory || undefined,
      playingBackground: formData.playingBackground || undefined,
      recruitingFocus: formData.recruitingFocus || undefined,
      favoriteFormations: formData.favoriteFormations
        ? formData.favoriteFormations.split(',').map(s => s.trim()).filter(s => s)
        : undefined,
      personalNotes: formData.personalNotes || undefined,
      createdAt: coach?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (coach) {
      updateCoach(coach.id, coachData);
    } else {
      addCoach(coachData);
    }

    onSave();
  };

  const handleDelete = () => {
    if (coach && confirm('Are you sure you want to delete this coach? This will also delete all contact history.')) {
      deleteCoach(coach.id);
      onSave();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem', maxWidth: '700px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>{coach ? 'Edit Coach' : 'Add Coach'}</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {coach && (
              <button
                type="button"
                onClick={handleDelete}
                className="btn btn-danger btn-sm"
              >
                <Trash2 size={16} />
              </button>
            )}
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
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Name and Role */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div>
                <label htmlFor="name">Coach Name *</label>
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

              <div>
                <label htmlFor="role">Role *</label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Head Coach"
                />
              </div>
            </div>

            {/* Contact Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="coach@university.edu"
                />
              </div>

              <div>
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            {/* URLs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label htmlFor="bioUrl">Bio/Profile URL</label>
                <input
                  type="url"
                  id="bioUrl"
                  name="bioUrl"
                  value={formData.bioUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label htmlFor="linkedinUrl">LinkedIn URL</label>
                <input
                  type="url"
                  id="linkedinUrl"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
            </div>

            {/* Alma Mater */}
            <div>
              <label htmlFor="almaMater">Alma Mater</label>
              <input
                type="text"
                id="almaMater"
                name="almaMater"
                value={formData.almaMater}
                onChange={handleChange}
                placeholder="Where they played/studied"
              />
            </div>

            {/* Coaching History */}
            <div>
              <label htmlFor="coachingHistory">Coaching History</label>
              <textarea
                id="coachingHistory"
                name="coachingHistory"
                value={formData.coachingHistory}
                onChange={handleChange}
                placeholder="Previous coaching positions, achievements..."
                rows={3}
              />
            </div>

            {/* Playing Background */}
            <div>
              <label htmlFor="playingBackground">Playing Background</label>
              <textarea
                id="playingBackground"
                name="playingBackground"
                value={formData.playingBackground}
                onChange={handleChange}
                placeholder="Professional/collegiate playing experience..."
                rows={3}
              />
            </div>

            {/* Recruiting Focus */}
            <div>
              <label htmlFor="recruitingFocus">Recruiting Focus</label>
              <input
                type="text"
                id="recruitingFocus"
                name="recruitingFocus"
                value={formData.recruitingFocus}
                onChange={handleChange}
                placeholder="e.g., international players, defenders, midfielders"
              />
            </div>

            {/* Favorite Formations */}
            <div>
              <label htmlFor="favoriteFormations">Favorite Formations</label>
              <input
                type="text"
                id="favoriteFormations"
                name="favoriteFormations"
                value={formData.favoriteFormations}
                onChange={handleChange}
                placeholder="e.g., 4-3-3, 3-5-2, 4-2-3-1"
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Separate formations with commas
              </div>
            </div>

            {/* Personal Notes */}
            <div>
              <label htmlFor="personalNotes">Your Personal Notes</label>
              <textarea
                id="personalNotes"
                name="personalNotes"
                value={formData.personalNotes}
                onChange={handleChange}
                placeholder="Key talking points, connections, research insights..."
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
                {coach ? 'Save Changes' : 'Add Coach'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CoachForm;

