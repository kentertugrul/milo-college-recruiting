import { 
  University, 
  MessageTemplate, 
  Communication, 
  Reminder,
  SoccerProgram,
  Coach,
  CoachContact,
  HighlightPackage,
  PlayerProfile
} from '../types';

const STORAGE_KEYS = {
  UNIVERSITIES: 'college_tracker_universities',
  TEMPLATES: 'college_tracker_templates',
  COMMUNICATIONS: 'college_tracker_communications',
  REMINDERS: 'college_tracker_reminders',
  SOCCER_PROGRAMS: 'milo_soccer_programs',
  COACHES: 'milo_coaches',
  COACH_CONTACTS: 'milo_coach_contacts',
  HIGHLIGHT_PACKAGES: 'milo_highlight_packages',
  PLAYER_PROFILE: 'milo_player_profile',
};

// Generic storage functions
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
};

// University operations
export const getUniversities = (): University[] => {
  return storage.get<University[]>(STORAGE_KEYS.UNIVERSITIES, []);
};

export const saveUniversities = (universities: University[]): void => {
  storage.set(STORAGE_KEYS.UNIVERSITIES, universities);
};

export const getUniversityById = (id: string): University | undefined => {
  const universities = getUniversities();
  return universities.find(u => u.id === id);
};

export const addUniversity = (university: University): void => {
  const universities = getUniversities();
  universities.push(university);
  saveUniversities(universities);
};

export const updateUniversity = (id: string, updates: Partial<University>): void => {
  const universities = getUniversities();
  const index = universities.findIndex(u => u.id === id);
  if (index !== -1) {
    universities[index] = { 
      ...universities[index], 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveUniversities(universities);
  }
};

export const deleteUniversity = (id: string): void => {
  const universities = getUniversities();
  const filtered = universities.filter(u => u.id !== id);
  saveUniversities(filtered);
};

// Message Template operations
export const getMessageTemplates = (): MessageTemplate[] => {
  return storage.get<MessageTemplate[]>(STORAGE_KEYS.TEMPLATES, []);
};

export const saveMessageTemplates = (templates: MessageTemplate[]): void => {
  storage.set(STORAGE_KEYS.TEMPLATES, templates);
};

export const addMessageTemplate = (template: MessageTemplate): void => {
  const templates = getMessageTemplates();
  templates.push(template);
  saveMessageTemplates(templates);
};

export const updateMessageTemplate = (id: string, updates: Partial<MessageTemplate>): void => {
  const templates = getMessageTemplates();
  const index = templates.findIndex(t => t.id === id);
  if (index !== -1) {
    templates[index] = { ...templates[index], ...updates };
    saveMessageTemplates(templates);
  }
};

export const deleteMessageTemplate = (id: string): void => {
  const templates = getMessageTemplates();
  const filtered = templates.filter(t => t.id !== id);
  saveMessageTemplates(filtered);
};

// Communication operations
export const getCommunications = (universityId?: string): Communication[] => {
  const communications = storage.get<Communication[]>(STORAGE_KEYS.COMMUNICATIONS, []);
  return universityId 
    ? communications.filter(c => c.universityId === universityId)
    : communications;
};

export const saveCommunications = (communications: Communication[]): void => {
  storage.set(STORAGE_KEYS.COMMUNICATIONS, communications);
};

export const addCommunication = (communication: Communication): void => {
  const communications = getCommunications();
  communications.push(communication);
  saveCommunications(communications);
};

export const updateCommunication = (id: string, updates: Partial<Communication>): void => {
  const communications = getCommunications();
  const index = communications.findIndex(c => c.id === id);
  if (index !== -1) {
    communications[index] = { ...communications[index], ...updates };
    saveCommunications(communications);
  }
};

export const deleteCommunication = (id: string): void => {
  const communications = getCommunications();
  const filtered = communications.filter(c => c.id !== id);
  saveCommunications(filtered);
};

// Reminder operations
export const getReminders = (universityId?: string): Reminder[] => {
  const reminders = storage.get<Reminder[]>(STORAGE_KEYS.REMINDERS, []);
  return universityId 
    ? reminders.filter(r => r.universityId === universityId)
    : reminders;
};

export const saveReminders = (reminders: Reminder[]): void => {
  storage.set(STORAGE_KEYS.REMINDERS, reminders);
};

export const addReminder = (reminder: Reminder): void => {
  const reminders = getReminders();
  reminders.push(reminder);
  saveReminders(reminders);
};

export const updateReminder = (id: string, updates: Partial<Reminder>): void => {
  const reminders = getReminders();
  const index = reminders.findIndex(r => r.id === id);
  if (index !== -1) {
    reminders[index] = { ...reminders[index], ...updates };
    saveReminders(reminders);
  }
};

export const deleteReminder = (id: string): void => {
  const reminders = getReminders();
  const filtered = reminders.filter(r => r.id !== id);
  saveReminders(filtered);
};

// Soccer Program operations
export const getSoccerPrograms = (universityId?: string): SoccerProgram[] => {
  const programs = storage.get<SoccerProgram[]>(STORAGE_KEYS.SOCCER_PROGRAMS, []);
  return universityId 
    ? programs.filter(p => p.universityId === universityId)
    : programs;
};

export const saveSoccerPrograms = (programs: SoccerProgram[]): void => {
  storage.set(STORAGE_KEYS.SOCCER_PROGRAMS, programs);
};

export const addSoccerProgram = (program: SoccerProgram): void => {
  const programs = getSoccerPrograms();
  programs.push(program);
  saveSoccerPrograms(programs);
};

export const updateSoccerProgram = (id: string, updates: Partial<SoccerProgram>): void => {
  const programs = getSoccerPrograms();
  const index = programs.findIndex(p => p.id === id);
  if (index !== -1) {
    programs[index] = { 
      ...programs[index], 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveSoccerPrograms(programs);
  }
};

export const deleteSoccerProgram = (id: string): void => {
  const programs = getSoccerPrograms();
  const filtered = programs.filter(p => p.id !== id);
  saveSoccerPrograms(filtered);
  
  // Also delete associated coaches
  const coaches = getCoaches();
  const filteredCoaches = coaches.filter(c => c.soccerProgramId !== id);
  saveCoaches(filteredCoaches);
};

// Coach operations
export const getCoaches = (soccerProgramId?: string): Coach[] => {
  const coaches = storage.get<Coach[]>(STORAGE_KEYS.COACHES, []);
  return soccerProgramId 
    ? coaches.filter(c => c.soccerProgramId === soccerProgramId)
    : coaches;
};

export const saveCoaches = (coaches: Coach[]): void => {
  storage.set(STORAGE_KEYS.COACHES, coaches);
};

export const addCoach = (coach: Coach): void => {
  const coaches = getCoaches();
  coaches.push(coach);
  saveCoaches(coaches);
};

export const updateCoach = (id: string, updates: Partial<Coach>): void => {
  const coaches = getCoaches();
  const index = coaches.findIndex(c => c.id === id);
  if (index !== -1) {
    coaches[index] = { 
      ...coaches[index], 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveCoaches(coaches);
  }
};

export const deleteCoach = (id: string): void => {
  const coaches = getCoaches();
  const filtered = coaches.filter(c => c.id !== id);
  saveCoaches(filtered);
  
  // Also delete associated coach contacts
  const contacts = getCoachContacts();
  const filteredContacts = contacts.filter(c => c.coachId !== id);
  saveCoachContacts(filteredContacts);
};

// Coach Contact operations
export const getCoachContacts = (coachId?: string): CoachContact[] => {
  const contacts = storage.get<CoachContact[]>(STORAGE_KEYS.COACH_CONTACTS, []);
  return coachId 
    ? contacts.filter(c => c.coachId === coachId)
    : contacts;
};

export const saveCoachContacts = (contacts: CoachContact[]): void => {
  storage.set(STORAGE_KEYS.COACH_CONTACTS, contacts);
};

export const addCoachContact = (contact: CoachContact): void => {
  const contacts = getCoachContacts();
  contacts.push(contact);
  saveCoachContacts(contacts);
};

export const updateCoachContact = (id: string, updates: Partial<CoachContact>): void => {
  const contacts = getCoachContacts();
  const index = contacts.findIndex(c => c.id === id);
  if (index !== -1) {
    contacts[index] = { ...contacts[index], ...updates };
    saveCoachContacts(contacts);
  }
};

export const deleteCoachContact = (id: string): void => {
  const contacts = getCoachContacts();
  const filtered = contacts.filter(c => c.id !== id);
  saveCoachContacts(filtered);
};

// Highlight Package operations
export const getHighlightPackages = (): HighlightPackage[] => {
  return storage.get<HighlightPackage[]>(STORAGE_KEYS.HIGHLIGHT_PACKAGES, []);
};

export const saveHighlightPackages = (packages: HighlightPackage[]): void => {
  storage.set(STORAGE_KEYS.HIGHLIGHT_PACKAGES, packages);
};

export const addHighlightPackage = (pkg: HighlightPackage): void => {
  const packages = getHighlightPackages();
  packages.push(pkg);
  saveHighlightPackages(packages);
};

export const updateHighlightPackage = (id: string, updates: Partial<HighlightPackage>): void => {
  const packages = getHighlightPackages();
  const index = packages.findIndex(p => p.id === id);
  if (index !== -1) {
    packages[index] = { 
      ...packages[index], 
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    saveHighlightPackages(packages);
  }
};

export const deleteHighlightPackage = (id: string): void => {
  const packages = getHighlightPackages();
  const filtered = packages.filter(p => p.id !== id);
  saveHighlightPackages(filtered);
};

// Player Profile operations
export const getPlayerProfile = (): PlayerProfile | null => {
  return storage.get<PlayerProfile | null>(STORAGE_KEYS.PLAYER_PROFILE, null);
};

export const savePlayerProfile = (profile: PlayerProfile | null): void => {
  if (!profile) {
    storage.remove(STORAGE_KEYS.PLAYER_PROFILE);
  } else {
    storage.set(STORAGE_KEYS.PLAYER_PROFILE, profile);
  }
};

export const updatePlayerProfile = (updates: Partial<PlayerProfile>): void => {
  const profile = getPlayerProfile();
  if (profile) {
    const updated = {
      ...profile,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    savePlayerProfile(updated);
  }
};

