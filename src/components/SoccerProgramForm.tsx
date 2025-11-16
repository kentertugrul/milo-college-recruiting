import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { SoccerProgram } from '../types';
import { addSoccerProgram, updateSoccerProgram, deleteSoccerProgram } from '../utils/storage';
import { generateId } from '../utils/helpers';

interface SoccerProgramFormProps {
  program?: SoccerProgram;
  universityId: string;
  onClose: () => void;
  onSave: () => void;
}

const SoccerProgramForm = ({ program, universityId, onClose, onSave }: SoccerProgramFormProps) => {
  const [formData, setFormData] = useState({
    programName: program?.programName || '',
    level: program?.level || 'D1' as 'D1' | 'D2' | 'D3' | 'Club',
    conference: program?.conference || '',
    officialSiteUrl: program?.officialSiteUrl || '',
    rosterUrl: program?.rosterUrl || '',
    staffUrl: program?.staffUrl || '',
    intlPlayersCount: program?.intlPlayersCount?.toString() || '',
    intlPlayersRatio: program?.intlPlayersRatio?.toString() || '',
    styleTags: program?.styleTags?.join(', ') || '',
    recentRecordSummary: program?.recentRecordSummary || '',
    notes: program?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const programData: SoccerProgram = {
      id: program?.id || generateId(),
      universityId,
      programName: formData.programName,
      level: formData.level,
      conference: formData.conference || undefined,
      officialSiteUrl: formData.officialSiteUrl || undefined,
      rosterUrl: formData.rosterUrl || undefined,
      staffUrl: formData.staffUrl || undefined,
      intlPlayersCount: formData.intlPlayersCount ? parseInt(formData.intlPlayersCount) : undefined,
      intlPlayersRatio: formData.intlPlayersRatio ? parseFloat(formData.intlPlayersRatio) : undefined,
      styleTags: formData.styleTags
        ? formData.styleTags.split(',').map(s => s.trim()).filter(s => s)
        : undefined,
      recentRecordSummary: formData.recentRecordSummary || undefined,
      notes: formData.notes || undefined,
      createdAt: program?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (program) {
      updateSoccerProgram(program.id, programData);
    } else {
      addSoccerProgram(programData);
    }

    onSave();
  };

  const handleDelete = () => {
    if (program && confirm('Are you sure you want to delete this soccer program? This will also delete all associated coaches.')) {
      deleteSoccerProgram(program.id);
      onSave();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
          <h2>{program ? 'Edit Soccer Program' : 'Add Soccer Program'}</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {program && (
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
            {/* Program Name and Level */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div>
                <label htmlFor="programName">Program Name *</label>
                <input
                  type="text"
                  id="programName"
                  name="programName"
                  value={formData.programName}
                  onChange={handleChange}
                  required
                  placeholder="e.g., UCLA Men's Soccer"
                />
              </div>

              <div>
                <label htmlFor="level">Level *</label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  required
                >
                  <option value="D1">Division I</option>
                  <option value="D2">Division II</option>
                  <option value="D3">Division III</option>
                  <option value="Club">Club</option>
                </select>
              </div>
            </div>

            {/* Conference */}
            <div>
              <label htmlFor="conference">Conference</label>
              <input
                type="text"
                id="conference"
                name="conference"
                value={formData.conference}
                onChange={handleChange}
                placeholder="e.g., ACC, Big Ten, Pac-12"
              />
            </div>

            {/* URLs */}
            <div>
              <label htmlFor="officialSiteUrl">Official Team Website</label>
              <input
                type="url"
                id="officialSiteUrl"
                name="officialSiteUrl"
                value={formData.officialSiteUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label htmlFor="rosterUrl">Roster URL</label>
                <input
                  type="url"
                  id="rosterUrl"
                  name="rosterUrl"
                  value={formData.rosterUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label htmlFor="staffUrl">Staff/Coaching URL</label>
                <input
                  type="url"
                  id="staffUrl"
                  name="staffUrl"
                  value={formData.staffUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* International Players */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label htmlFor="intlPlayersCount">International Players Count</label>
                <input
                  type="number"
                  id="intlPlayersCount"
                  name="intlPlayersCount"
                  value={formData.intlPlayersCount}
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g., 8"
                />
              </div>

              <div>
                <label htmlFor="intlPlayersRatio">Intl Players Ratio</label>
                <input
                  type="number"
                  id="intlPlayersRatio"
                  name="intlPlayersRatio"
                  value={formData.intlPlayersRatio}
                  onChange={handleChange}
                  min="0"
                  max="1"
                  step="0.01"
                  placeholder="e.g., 0.35 (35%)"
                />
              </div>
            </div>

            {/* Style Tags */}
            <div>
              <label htmlFor="styleTags">Playing Style Tags</label>
              <input
                type="text"
                id="styleTags"
                name="styleTags"
                value={formData.styleTags}
                onChange={handleChange}
                placeholder="e.g., possession, high press, counter attack"
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Separate tags with commas
              </div>
            </div>

            {/* Recent Record */}
            <div>
              <label htmlFor="recentRecordSummary">Recent Record Summary</label>
              <textarea
                id="recentRecordSummary"
                name="recentRecordSummary"
                value={formData.recentRecordSummary}
                onChange={handleChange}
                placeholder="e.g., 15-3-2 in 2024, Made NCAA tournament quarterfinals..."
                rows={3}
              />
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes">Your Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Personal observations, research notes..."
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
                {program ? 'Save Changes' : 'Add Program'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SoccerProgramForm;

