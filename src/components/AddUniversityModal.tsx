import { useState } from 'react';
import { X } from 'lucide-react';
import { University, Region, SchoolSize } from '../types';
import { addUniversity, updateUniversity } from '../utils/storage';
import { generateId } from '../utils/helpers';

interface AddUniversityModalProps {
  onClose: () => void;
  onAdd: () => void;
  university?: University;
}

const AddUniversityModal = ({ onClose, onAdd, university }: AddUniversityModalProps) => {
  const isEditing = !!university;
  
  const [formData, setFormData] = useState({
    name: university?.name || '',
    location: university?.location || '',
    region: university?.region || 'Northeast' as Region,
    schoolSize: university?.schoolSize || 'medium' as SchoolSize,
    applicationDeadline: university?.applicationDeadline || '',
    earlyDeadline: university?.earlyDeadline || '',
    notes: university?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && university) {
      updateUniversity(university.id, formData);
    } else {
      const newUniversity: University = {
        id: generateId(),
        ...formData,
        status: 'not_started',
        checklist: [],
        essays: [],
        interviews: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addUniversity(newUniversity);
    }

    onAdd();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>{isEditing ? 'Edit University' : 'Add New University'}</h2>
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
            {/* University Name */}
            <div>
              <label htmlFor="name">University Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Harvard University"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g., Cambridge, MA"
              />
            </div>

            {/* Region and Size */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label htmlFor="region">Region *</label>
                <select
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  required
                >
                  <option value="Northeast">Northeast</option>
                  <option value="Southeast">Southeast</option>
                  <option value="Midwest">Midwest</option>
                  <option value="Southwest">Southwest</option>
                  <option value="West">West</option>
                  <option value="International">International</option>
                </select>
              </div>

              <div>
                <label htmlFor="schoolSize">School Size *</label>
                <select
                  id="schoolSize"
                  name="schoolSize"
                  value={formData.schoolSize}
                  onChange={handleChange}
                  required
                >
                  <option value="small">Small (&lt;2,000)</option>
                  <option value="medium">Medium (2,000-10,000)</option>
                  <option value="large">Large (10,000-20,000)</option>
                  <option value="very_large">Very Large (&gt;20,000)</option>
                </select>
              </div>
            </div>

            {/* Deadlines */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label htmlFor="applicationDeadline">Application Deadline *</label>
                <input
                  type="date"
                  id="applicationDeadline"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="earlyDeadline">Early Decision/Action Deadline</label>
                <input
                  type="date"
                  id="earlyDeadline"
                  name="earlyDeadline"
                  value={formData.earlyDeadline}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any notes about this university..."
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
                {isEditing ? 'Save Changes' : 'Add University'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUniversityModal;

