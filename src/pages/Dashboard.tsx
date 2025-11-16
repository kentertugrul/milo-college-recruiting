import { useState, useEffect } from 'react';
import { Plus, Search, Filter, AlertCircle, Sparkles } from 'lucide-react';
import { University, Region, SchoolSize, ApplicationStatus } from '../types';
import { getUniversities, deleteUniversity } from '../utils/storage';
import { sortUniversities, isDeadlineApproaching, isOverdue } from '../utils/helpers';
import { isAPIKeyConfigured } from '../utils/openai';
import UniversityCard from '../components/UniversityCard';
import AddUniversityModal from '../components/AddUniversityModal';
import SmartUniversitySearch from '../components/SmartUniversitySearch';

const Dashboard = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSmartSearchOpen, setIsSmartSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<Region | 'all'>('all');
  const [selectedSize, setSelectedSize] = useState<SchoolSize | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'deadline' | 'status' | 'region'>('deadline');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadUniversities();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [universities, searchTerm, selectedRegion, selectedSize, selectedStatus, sortBy, sortDirection]);

  const loadUniversities = () => {
    const data = getUniversities();
    setUniversities(data);
  };

  const applyFiltersAndSort = () => {
    let filtered = [...universities];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Region filter
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(u => u.region === selectedRegion);
    }

    // Size filter
    if (selectedSize !== 'all') {
      filtered = filtered.filter(u => u.schoolSize === selectedSize);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(u => u.status === selectedStatus);
    }

    // Sort
    filtered = sortUniversities(filtered, sortBy, sortDirection);

    setFilteredUniversities(filtered);
  };

  const handleAddUniversity = () => {
    loadUniversities();
    setIsAddModalOpen(false);
  };

  const handleDeleteUniversity = (id: string) => {
    if (confirm('Are you sure you want to delete this university?')) {
      deleteUniversity(id);
      loadUniversities();
    }
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const urgentDeadlines = universities.filter(u => 
    isDeadlineApproaching(u.applicationDeadline, 14) && 
    (u.status === 'not_started' || u.status === 'in_progress')
  );

  const overdueApplications = universities.filter(u =>
    isOverdue(u.applicationDeadline) &&
    (u.status === 'not_started' || u.status === 'in_progress')
  );

  return (
    <div className="fade-in">
      {/* Header Section */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ marginBottom: '0.5rem' }}>Welcome Back, Milo! 👋</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
              Track your college applications and manage your soccer recruiting journey all in one place.<br/>
              <strong style={{ color: 'var(--primary)' }}>You've got this!</strong> Every step you take here brings you closer to your goals.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsSmartSearchOpen(true)}
              className="btn btn-primary btn-lg"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Sparkles size={20} />
              Smart Search
              {isAPIKeyConfigured() && (
                <span className="badge" style={{ backgroundColor: '#34D399', color: 'white', fontSize: '0.625rem' }}>
                  AI
                </span>
              )}
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-secondary btn-lg"
            >
              <Plus size={20} />
              Add Manually
            </button>
          </div>
        </div>

        {/* Alerts */}
        {overdueApplications.length > 0 && (
          <div style={{
            backgroundColor: '#FEE2E2',
            border: '1px solid #EF4444',
            borderRadius: 'var(--radius)',
            padding: '1rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <AlertCircle size={20} color="#EF4444" />
            <span style={{ color: '#991B1B', fontWeight: 500 }}>
              {overdueApplications.length} application{overdueApplications.length !== 1 ? 's' : ''} overdue!
            </span>
          </div>
        )}

        {urgentDeadlines.length > 0 && overdueApplications.length === 0 && (
          <div style={{
            backgroundColor: '#FEF3C7',
            border: '1px solid #F59E0B',
            borderRadius: 'var(--radius)',
            padding: '1rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <AlertCircle size={20} color="#F59E0B" />
            <span style={{ color: '#92400E', fontWeight: 500 }}>
              {urgentDeadlines.length} deadline{urgentDeadlines.length !== 1 ? 's' : ''} approaching within 2 weeks
            </span>
          </div>
        )}
      </div>

      {/* Search and Filter Bar */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: showFilters ? '1rem' : '0' }}>
          {/* Search */}
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
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
              placeholder="Search universities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Filter size={20} />
            Filters
            {(selectedRegion !== 'all' || selectedSize !== 'all' || selectedStatus !== 'all') && (
              <span className="badge" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                Active
              </span>
            )}
          </button>

          {/* Sort */}
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{ minWidth: '150px' }}
          >
            <option value="deadline">Sort by Deadline</option>
            <option value="name">Sort by Name</option>
            <option value="status">Sort by Status</option>
            <option value="region">Sort by Region</option>
          </select>

          <button
            onClick={toggleSortDirection}
            className="btn btn-secondary"
            style={{ padding: '0.5rem 1rem' }}
          >
            {sortDirection === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border)'
          }}>
            <div>
              <label>Region</label>
              <select 
                value={selectedRegion} 
                onChange={(e) => setSelectedRegion(e.target.value as any)}
              >
                <option value="all">All Regions</option>
                <option value="Northeast">Northeast</option>
                <option value="Southeast">Southeast</option>
                <option value="Midwest">Midwest</option>
                <option value="Southwest">Southwest</option>
                <option value="West">West</option>
                <option value="International">International</option>
              </select>
            </div>

            <div>
              <label>School Size</label>
              <select 
                value={selectedSize} 
                onChange={(e) => setSelectedSize(e.target.value as any)}
              >
                <option value="all">All Sizes</option>
                <option value="small">Small (&lt;2,000)</option>
                <option value="medium">Medium (2,000-10,000)</option>
                <option value="large">Large (10,000-20,000)</option>
                <option value="very_large">Very Large (&gt;20,000)</option>
              </select>
            </div>

            <div>
              <label>Status</label>
              <select 
                value={selectedStatus} 
                onChange={(e) => setSelectedStatus(e.target.value as any)}
              >
                <option value="all">All Statuses</option>
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="submitted">Submitted</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="waitlisted">Waitlisted</option>
              </select>
            </div>

            {(selectedRegion !== 'all' || selectedSize !== 'all' || selectedStatus !== 'all') && (
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button
                  onClick={() => {
                    setSelectedRegion('all');
                    setSelectedSize('all');
                    setSelectedStatus('all');
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%' }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Universities Grid */}
      {filteredUniversities.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
          <h3 style={{ marginBottom: '0.5rem' }}>
            {universities.length === 0 ? 'Ready to Start Your Journey?' : 'No universities found'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', maxWidth: '500px', margin: '0 auto' }}>
            {universities.length === 0 
              ? 'Add your first university to begin tracking applications. Don\'t worry about having everything perfect - you can always update details later!'
              : 'Try adjusting your search or filters to find what you\'re looking for.'
            }
          </p>
          {universities.length === 0 && (
            <>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                💡 Tip: Use <strong style={{ color: 'var(--primary)' }}>Smart Search</strong> with AI to automatically research universities!
                <br/>
                Also check out the <strong>Soccer</strong> section to start your recruiting process.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setIsSmartSearchOpen(true)}
                  className="btn btn-primary"
                >
                  <Sparkles size={20} />
                  Smart Search University
                </button>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="btn btn-secondary"
                >
                  <Plus size={20} />
                  Or Add Manually
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredUniversities.map((university) => (
            <UniversityCard
              key={university.id}
              university={university}
              onDelete={handleDeleteUniversity}
            />
          ))}
        </div>
      )}

      {/* Stats Footer */}
      {universities.length > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: 'var(--bg-primary)',
          borderRadius: 'var(--radius-lg)',
          flexWrap: 'wrap'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>
              {universities.length}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Total Universities
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--warning)' }}>
              {universities.filter(u => u.status === 'in_progress').length}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              In Progress
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--secondary)' }}>
              {universities.filter(u => u.status === 'submitted').length}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Submitted
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>
              {universities.filter(u => u.status === 'accepted').length}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Accepted
            </div>
          </div>
        </div>
      )}

      {/* Add University Modal */}
      {isAddModalOpen && (
        <AddUniversityModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddUniversity}
        />
      )}

      {/* Smart Search Modal */}
      {isSmartSearchOpen && (
        <SmartUniversitySearch
          onClose={() => setIsSmartSearchOpen(false)}
          onAdd={() => {
            loadUniversities();
            setIsSmartSearchOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;

