import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { HighlightPackage } from '../types';
import { addHighlightPackage, updateHighlightPackage, deleteHighlightPackage } from '../utils/storage';
import { generateId } from '../utils/helpers';

interface HighlightPackageFormProps {
  package?: HighlightPackage;
  onClose: () => void;
  onSave: () => void;
}

const HighlightPackageForm = ({ package: pkg, onClose, onSave }: HighlightPackageFormProps) => {
  const [formData, setFormData] = useState({
    playerName: pkg?.playerName || '',
    primaryPosition: pkg?.primaryPosition || '',
    secondaryPositions: pkg?.secondaryPositions?.join(', ') || '',
    height: pkg?.height || '',
    dominantFoot: pkg?.dominantFoot || '' as '' | 'left' | 'right' | 'both',
    youtubeUrl: pkg?.youtubeUrl || '',
    vimeoUrl: pkg?.vimeoUrl || '',
    fullMatchLinks: pkg?.fullMatchLinks?.join('\n') || '',
    tags: pkg?.tags?.join(', ') || '',
    videoNotes: pkg?.videoNotes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const packageData: HighlightPackage = {
      id: pkg?.id || generateId(),
      playerName: formData.playerName,
      primaryPosition: formData.primaryPosition,
      secondaryPositions: formData.secondaryPositions
        ? formData.secondaryPositions.split(',').map(s => s.trim()).filter(s => s)
        : undefined,
      height: formData.height || undefined,
      dominantFoot: formData.dominantFoot || undefined,
      youtubeUrl: formData.youtubeUrl || undefined,
      vimeoUrl: formData.vimeoUrl || undefined,
      fullMatchLinks: formData.fullMatchLinks
        ? formData.fullMatchLinks.split('\n').map(s => s.trim()).filter(s => s)
        : undefined,
      tags: formData.tags
        ? formData.tags.split(',').map(s => s.trim()).filter(s => s)
        : undefined,
      videoNotes: formData.videoNotes || undefined,
      createdAt: pkg?.createdAt || new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    if (pkg) {
      updateHighlightPackage(pkg.id, packageData);
    } else {
      addHighlightPackage(packageData);
    }

    onSave();
  };

  const handleDelete = () => {
    if (pkg && confirm('Are you sure you want to delete this highlight package?')) {
      deleteHighlightPackage(pkg.id);
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
          <h2>{pkg ? 'Edit Highlight Package' : 'Add Highlight Package'}</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {pkg && (
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
            {/* Player Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label htmlFor="playerName">Player Name *</label>
                <input
                  type="text"
                  id="playerName"
                  name="playerName"
                  value={formData.playerName}
                  onChange={handleChange}
                  required
                  placeholder="Player name"
                />
              </div>

              <div>
                <label htmlFor="primaryPosition">Primary Position *</label>
                <input
                  type="text"
                  id="primaryPosition"
                  name="primaryPosition"
                  value={formData.primaryPosition}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Center Back"
                />
              </div>
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
            </div>

            {/* Height and Foot */}
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

            {/* Video URLs */}
            <div>
              <label htmlFor="youtubeUrl">YouTube Highlight URL</label>
              <input
                type="url"
                id="youtubeUrl"
                name="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={handleChange}
                placeholder="https://youtube.com/..."
              />
            </div>

            <div>
              <label htmlFor="vimeoUrl">Vimeo Highlight URL</label>
              <input
                type="url"
                id="vimeoUrl"
                name="vimeoUrl"
                value={formData.vimeoUrl}
                onChange={handleChange}
                placeholder="https://vimeo.com/..."
              />
            </div>

            {/* Full Match Links */}
            <div>
              <label htmlFor="fullMatchLinks">Full Match Links</label>
              <textarea
                id="fullMatchLinks"
                name="fullMatchLinks"
                value={formData.fullMatchLinks}
                onChange={handleChange}
                placeholder="One URL per line"
                rows={3}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Enter one URL per line
              </div>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags">Tags</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g., 2024 season, club, tournament"
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Separate tags with commas
              </div>
            </div>

            {/* Video Notes */}
            <div>
              <label htmlFor="videoNotes">Video Notes</label>
              <textarea
                id="videoNotes"
                name="videoNotes"
                value={formData.videoNotes}
                onChange={handleChange}
                placeholder="Describe what's in the video, key plays, context..."
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
                {pkg ? 'Save Changes' : 'Add Package'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HighlightPackageForm;

