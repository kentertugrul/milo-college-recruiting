export type ApplicationStatus = 
  | 'not_started' 
  | 'in_progress' 
  | 'submitted' 
  | 'accepted' 
  | 'rejected' 
  | 'waitlisted';

export type Region = 
  | 'Northeast' 
  | 'Southeast' 
  | 'Midwest' 
  | 'Southwest' 
  | 'West' 
  | 'International';

export type SchoolSize = 'small' | 'medium' | 'large' | 'very_large';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;
}

export interface University {
  id: string;
  name: string;
  location: string;
  region: Region;
  schoolSize: SchoolSize;
  status: ApplicationStatus;
  applicationDeadline: string;
  earlyDeadline?: string;
  notes: string;
  checklist: ChecklistItem[];
  essays: Essay[];
  interviews: Interview[];
  createdAt: string;
  updatedAt: string;
}

export interface Essay {
  id: string;
  universityId: string;
  title: string;
  prompt: string;
  content: string;
  wordLimit?: number;
  dueDate?: string;
  status: 'not_started' | 'draft' | 'review' | 'final';
}

export interface Interview {
  id: string;
  universityId: string;
  date: string;
  time: string;
  type: 'in_person' | 'virtual' | 'phone';
  interviewer?: string;
  notes: string;
  completed: boolean;
}

export interface MessageTemplate {
  id: string;
  title: string;
  subject: string;
  body: string;
  category: 'inquiry' | 'recommendation' | 'follow_up' | 'thank_you' | 'coach_outreach' | 'other';
  createdAt: string;
}

export interface Communication {
  id: string;
  universityId: string;
  coachId?: string; // Link to coach for soccer recruiting
  date: string;
  type: 'email' | 'phone' | 'mail';
  direction: 'sent' | 'received';
  subject: string;
  content: string;
  followUpNeeded: boolean;
  followUpDate?: string;
}

export interface Reminder {
  id: string;
  universityId?: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  type: 'deadline' | 'interview' | 'follow_up' | 'task';
}

// Soccer / Football Recruiting Types

export interface SoccerProgram {
  id: string;
  universityId: string; // link to University.id
  programName: string;  // e.g. "UCLA Men's Soccer"
  level: 'D1' | 'D2' | 'D3' | 'Club';
  conference?: string;  // e.g. "ACC", "Big Ten"
  officialSiteUrl?: string;
  rosterUrl?: string;
  staffUrl?: string;
  intlPlayersCount?: number;
  intlPlayersRatio?: number; // 0–1
  styleTags?: string[];      // e.g. ["possession", "high_press"]
  recentRecordSummary?: string; // short human text
  notes?: string;            // Milo's own notes
  createdAt: string;
  updatedAt: string;
}

export interface Coach {
  id: string;
  soccerProgramId: string;
  name: string;
  role: string;            // "Head Coach", "Assistant Coach" etc.
  email?: string;
  phone?: string;
  bioUrl?: string;
  linkedinUrl?: string;
  almaMater?: string;
  coachingHistory?: string;   // short text summary
  playingBackground?: string; // short text summary
  recruitingFocus?: string;   // "international", "defenders", etc.
  favoriteFormations?: string[];
  personalNotes?: string;     // Milo's tailored notes
  createdAt: string;
  updatedAt: string;
}

export type CoachContactChannel =
  | 'email'
  | 'phone'
  | 'online_meeting'
  | 'campus_visit'
  | 'id_camp';

export type CoachContactStatus =
  | 'sent'
  | 'opened'
  | 'replied'
  | 'no_response'
  | 'follow_up_scheduled';

export interface CoachContact {
  id: string;
  coachId: string;
  timestamp: string;          // ISO string
  channel: CoachContactChannel;
  subject?: string;
  messagePreview?: string;    // short text / snippet
  status: CoachContactStatus;
  nextActionDate?: string;    // ISO string if follow-up needed
  notes?: string;             // e.g. "asked for full match video"
}

export interface HighlightPackage {
  id: string;
  playerName: string;
  primaryPosition: string;
  secondaryPositions?: string[];
  height?: string;            // text "5'10" / "178cm"
  dominantFoot?: 'left' | 'right' | 'both';
  youtubeUrl?: string;
  vimeoUrl?: string;
  fullMatchLinks?: string[];
  tags?: string[];            // e.g. ["2024 season", "club"]
  videoNotes?: string;        // explanation of clips
  createdAt: string;
  lastUpdated: string;
}

export interface PlayerProfile {
  id: string;
  name: string;
  primaryPosition: string;
  secondaryPositions?: string[];
  height?: string;
  dominantFoot?: 'left' | 'right' | 'both';
  languages?: string[];
  clubs?: string[];       // past/current clubs
  summary?: string;       // short bio paragraph
  highlightPackageIds?: string[]; // references HighlightPackage.id
  createdAt: string;
  updatedAt: string;
}

