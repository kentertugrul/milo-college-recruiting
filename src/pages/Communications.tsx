import { useState, useEffect } from 'react';
import { Plus, Mail, Phone, FileText, Trash2, Copy, Check, Search } from 'lucide-react';
import { MessageTemplate, Communication } from '../types';
import { 
  getMessageTemplates, 
  addMessageTemplate, 
  deleteMessageTemplate,
  getCommunications,
  addCommunication,
  deleteCommunication,
  updateCommunication,
  getUniversities
} from '../utils/storage';
import { generateId, formatDateTime } from '../utils/helpers';

const Communications = () => {
  const [activeTab, setActiveTab] = useState<'templates' | 'history'>('templates');
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [isAddTemplateOpen, setIsAddTemplateOpen] = useState(false);
  const [isAddCommunicationOpen, setIsAddCommunicationOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTemplates(getMessageTemplates());
    setCommunications(getCommunications());
    setUniversities(getUniversities());
  };

  const handleAddTemplate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newTemplate: MessageTemplate = {
      id: generateId(),
      title: formData.get('title') as string,
      subject: formData.get('subject') as string,
      body: formData.get('body') as string,
      category: formData.get('category') as any,
      createdAt: new Date().toISOString(),
    };

    addMessageTemplate(newTemplate);
    loadData();
    setIsAddTemplateOpen(false);
    e.currentTarget.reset();
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm('Delete this template?')) {
      deleteMessageTemplate(id);
      loadData();
    }
  };

  const handleCopyTemplate = (template: MessageTemplate) => {
    const text = `Subject: ${template.subject}\n\n${template.body}`;
    navigator.clipboard.writeText(text);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddCommunication = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newCommunication: Communication = {
      id: generateId(),
      universityId: formData.get('universityId') as string,
      date: formData.get('date') as string,
      type: formData.get('type') as any,
      direction: formData.get('direction') as any,
      subject: formData.get('subject') as string,
      content: formData.get('content') as string,
      followUpNeeded: formData.get('followUpNeeded') === 'true',
      followUpDate: formData.get('followUpDate') as string || undefined,
    };

    addCommunication(newCommunication);
    loadData();
    setIsAddCommunicationOpen(false);
    e.currentTarget.reset();
  };

  const handleDeleteCommunication = (id: string) => {
    if (confirm('Delete this communication?')) {
      deleteCommunication(id);
      loadData();
    }
  };

  const handleToggleFollowUp = (id: string, completed: boolean) => {
    updateCommunication(id, { followUpNeeded: !completed });
    loadData();
  };

  const filteredTemplates = templates.filter(t => 
    searchTerm === '' || 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCommunications = communications.filter(c => {
    if (searchTerm === '') return true;
    const university = universities.find(u => u.id === c.universityId);
    return c.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
           c.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
           university?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Communication Hub 💬</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
          Keep track of every email, call, and conversation. Professional organization impresses everyone!<br/>
          <strong style={{ color: 'var(--primary)' }}>Templates save time, tracking shows you're serious.</strong>
        </p>
      </div>

      {/* Search */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ position: 'relative' }}>
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
            placeholder="Search templates and communications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ 
        borderBottom: '2px solid var(--border)',
        marginBottom: '2rem',
        display: 'flex',
        gap: '1rem'
      }}>
        {[
          { id: 'templates', label: 'Message Templates', count: templates.length },
          { id: 'history', label: 'Communication History', count: communications.length },
        ].map((tab) => {
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
                marginBottom: '-2px'
              }}
            >
              {tab.label}
              <span className="badge" style={{
                backgroundColor: isActive ? 'var(--primary)' : 'var(--gray-300)',
                color: isActive ? 'white' : 'var(--text-primary)'
              }}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Email Templates</h3>
            <button 
              onClick={() => setIsAddTemplateOpen(!isAddTemplateOpen)} 
              className="btn btn-primary"
            >
              <Plus size={20} />
              {isAddTemplateOpen ? 'Cancel' : 'New Template'}
            </button>
          </div>

          {/* Add Template Form */}
          {isAddTemplateOpen && (
            <form onSubmit={handleAddTemplate} className="card" style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>Create New Template</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label htmlFor="title">Template Name *</label>
                  <input type="text" id="title" name="title" required placeholder="e.g., Request for Recommendation" />
                </div>
              <div>
                <label htmlFor="category">Category *</label>
                <select id="category" name="category" required>
                  <option value="inquiry">Inquiry</option>
                  <option value="recommendation">Recommendation Request</option>
                  <option value="follow_up">Follow-up</option>
                  <option value="thank_you">Thank You</option>
                  <option value="coach_outreach">Coach Outreach</option>
                  <option value="other">Other</option>
                </select>
              </div>                <div>
                  <label htmlFor="subject">Email Subject *</label>
                  <input type="text" id="subject" name="subject" required placeholder="e.g., Application Materials Inquiry" />
                </div>
                <div>
                  <label htmlFor="body">Email Body *</label>
                  <textarea id="body" name="body" rows={8} required placeholder="Write your email template..."></textarea>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="button" onClick={() => setIsAddTemplateOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Create Template
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Templates List */}
          {filteredTemplates.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <Mail size={48} color="var(--gray-400)" style={{ marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-secondary)' }}>
                {templates.length === 0 ? 'No templates yet. Create your first template!' : 'No templates match your search.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {filteredTemplates.map((template) => (
                <div key={template.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <h4>{template.title}</h4>
                        <span className="badge" style={{
                          backgroundColor: 'var(--gray-200)',
                          color: 'var(--text-primary)',
                          textTransform: 'capitalize'
                        }}>
                          {template.category.replace('_', ' ')}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        Created {formatDateTime(template.createdAt)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleCopyTemplate(template)}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                      >
                        {copiedId === template.id ? <Check size={16} /> : <Copy size={16} />}
                        {copiedId === template.id ? 'Copied!' : 'Copy'}
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="btn btn-danger btn-sm"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div style={{
                    padding: '1rem',
                    backgroundColor: 'var(--gray-50)',
                    borderRadius: 'var(--radius)',
                    borderLeft: '3px solid var(--primary)'
                  }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                      Subject: {template.subject}
                    </div>
                    <div style={{ 
                      whiteSpace: 'pre-wrap', 
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6
                    }}>
                      {template.body}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Communication History Tab */}
      {activeTab === 'history' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Communication Log</h3>
            <button 
              onClick={() => setIsAddCommunicationOpen(!isAddCommunicationOpen)} 
              className="btn btn-primary"
            >
              <Plus size={20} />
              {isAddCommunicationOpen ? 'Cancel' : 'Log Communication'}
            </button>
          </div>

          {/* Add Communication Form */}
          {isAddCommunicationOpen && (
            <form onSubmit={handleAddCommunication} className="card" style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>Log New Communication</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label htmlFor="comm-universityId">University *</label>
                  <select id="comm-universityId" name="universityId" required>
                    <option value="">Select a university</option>
                    {universities.map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label htmlFor="comm-date">Date *</label>
                    <input type="date" id="comm-date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div>
                    <label htmlFor="comm-type">Type *</label>
                    <select id="comm-type" name="type" required>
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="mail">Mail</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="comm-direction">Direction *</label>
                    <select id="comm-direction" name="direction" required>
                      <option value="sent">Sent</option>
                      <option value="received">Received</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="comm-subject">Subject *</label>
                  <input type="text" id="comm-subject" name="subject" required placeholder="Brief description" />
                </div>
                <div>
                  <label htmlFor="comm-content">Content *</label>
                  <textarea id="comm-content" name="content" rows={6} required placeholder="Communication details..."></textarea>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label htmlFor="comm-followUpNeeded">Follow-up Needed?</label>
                    <select id="comm-followUpNeeded" name="followUpNeeded">
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="comm-followUpDate">Follow-up Date</label>
                    <input type="date" id="comm-followUpDate" name="followUpDate" />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="button" onClick={() => setIsAddCommunicationOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Log Communication
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Communications List */}
          {filteredCommunications.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <FileText size={48} color="var(--gray-400)" style={{ marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-secondary)' }}>
                {communications.length === 0 ? 'No communications logged yet.' : 'No communications match your search.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {filteredCommunications.map((comm) => {
                const university = universities.find(u => u.id === comm.universityId);
                const IconComponent = comm.type === 'email' ? Mail : comm.type === 'phone' ? Phone : FileText;
                
                return (
                  <div key={comm.id} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                          <IconComponent size={18} color="var(--primary)" />
                          <h4>{comm.subject}</h4>
                          <span className="badge" style={{
                            backgroundColor: comm.direction === 'sent' ? '#DBEAFE' : '#FEF3C7',
                            color: comm.direction === 'sent' ? '#1E40AF' : '#92400E'
                          }}>
                            {comm.direction === 'sent' ? '→ Sent' : '← Received'}
                          </span>
                          {comm.followUpNeeded && (
                            <span className="badge" style={{
                              backgroundColor: '#FEE2E2',
                              color: '#991B1B'
                            }}>
                              Follow-up needed
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          {university?.name} • {formatDateTime(comm.date)}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteCommunication(comm.id)}
                        className="btn btn-danger btn-sm"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div style={{
                      padding: '1rem',
                      backgroundColor: 'var(--gray-50)',
                      borderRadius: 'var(--radius)',
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap'
                    }}>
                      {comm.content}
                    </div>
                    {comm.followUpNeeded && comm.followUpDate && (
                      <div style={{ 
                        marginTop: '0.75rem', 
                        padding: '0.75rem',
                        backgroundColor: '#FEF3C7',
                        borderRadius: 'var(--radius)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                          Follow up by: {formatDateTime(comm.followUpDate)}
                        </span>
                        <button
                          onClick={() => handleToggleFollowUp(comm.id, false)}
                          className="btn btn-success btn-sm"
                        >
                          Mark Complete
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Communications;

