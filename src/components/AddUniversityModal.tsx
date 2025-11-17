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
    admissionRate: university?.admissionRate ? (university.admissionRate * 100).toString() : '',
    averageIB: university?.averageIB?.toString() || '',
    averageGPA: university?.averageGPA?.toString() || '',
    averageSAT: university?.averageSAT?.toString() || '',
    averageACT: university?.averageACT?.toString() || '',
    admissionStatsNotes: university?.admissionStatsNotes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const universityData = {
      ...formData,
      admissionRate: formData.admissionRate ? parseFloat(formData.admissionRate) / 100 : undefined,
      averageIB: formData.averageIB ? parseFloat(formData.averageIB) : undefined,
      averageGPA: formData.averageGPA ? parseFloat(formData.averageGPA) : undefined,
      averageSAT: formData.averageSAT ? parseInt(formData.averageSAT) : undefined,
      averageACT: formData.averageACT ? parseInt(formData.averageACT) : undefined,
    };

    if (isEditing && university) {
      updateUniversity(university.id, universityData);
    } else {
      const newUniversity: University = {
        id: generateId(),
        name: universityData.name,
        location: universityData.location,
        region: universityData.region,
        schoolSize: universityData.schoolSize,
        applicationDeadline: universityData.applicationDeadline,
        earlyDeadline: universityData.earlyDeadline,
        notes: universityData.notes,
        admissionRate: universityData.admissionRate,
        averageIB: universityData.averageIB,
        averageGPA: universityData.averageGPA,
        averageSAT: universityData.averageSAT,
        averageACT: universityData.averageACT,
        admissionStatsNotes: universityData.admissionStatsNotes,
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

            {/* Admission Statistics Section */}
            <div style={{ 
              borderTop: '1px solid var(--border)', 
              paddingTop: '1rem',
              marginTop: '1rem'
            }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>📊 Admission Statistics (Optional)</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label htmlFor="admissionRate">Acceptance Rate (%)</label>
                  <input
                    type="number"
                    id="admissionRate"
                    name="admissionRate"
                    value={formData.admissionRate}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="e.g., 5.2 for 5.2%"
                  />
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Enter as percentage (e.g., 5.2 for 5.2%)
                  </div>
                </div>

                <div>
                  <label htmlFor="averageIB">Average IB Score</label>
                  <input
                    type="number"
                    id="averageIB"
                    name="averageIB"
                    value={formData.averageIB}
                    onChange={handleChange}
                    min="24"
                    max="45"
                    step="0.1"
                    placeholder="e.g., 40"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <div>
                  <label htmlFor="averageGPA">Average GPA</label>
                  <input
                    type="number"
                    id="averageGPA"
                    name="averageGPA"
                    value={formData.averageGPA}
                    onChange={handleChange}
                    min="0"
                    max="4"
                    step="0.01"
                    placeholder="e.g., 3.9"
                  />
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Out of 4.0
                  </div>
                </div>

                <div>
                  <label htmlFor="averageSAT">Average SAT</label>
                  <input
                    type="number"
                    id="averageSAT"
                    name="averageSAT"
                    value={formData.averageSAT}
                    onChange={handleChange}
                    min="400"
                    max="1600"
                    step="10"
                    placeholder="e.g., 1500"
                  />
                </div>

                <div>
                  <label htmlFor="averageACT">Average ACT</label>
                  <input
                    type="number"
                    id="averageACT"
                    name="averageACT"
                    value={formData.averageACT}
                    onChange={handleChange}
                    min="1"
                    max="36"
                    step="1"
                    placeholder="e.g., 33"
                  />
                </div>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <label htmlFor="admissionStatsNotes">Admission Notes</label>
                <textarea
                  id="admissionStatsNotes"
                  name="admissionStatsNotes"
                  value={formData.admissionStatsNotes}
                  onChange={handleChange}
                  placeholder="What they look for in applicants, competitiveness notes..."
                  rows={2}
                />
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
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

