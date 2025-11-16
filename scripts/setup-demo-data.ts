/**
 * Demo Data Setup Script
 * 
 * This script can be used to populate the application with sample data for testing.
 * To use: Copy the contents of the functions below and run them in your browser console.
 */

import { University, MessageTemplate, Reminder } from '../src/types';
import { generateId } from '../src/utils/helpers';

// Sample Universities
export const sampleUniversities: Omit<University, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: "Harvard University",
    location: "Cambridge, MA",
    region: "Northeast",
    schoolSize: "medium",
    status: "in_progress",
    applicationDeadline: "2026-01-01",
    earlyDeadline: "2025-11-01",
    notes: "Great programs in economics and computer science. Need to prepare for supplemental essays.",
    checklist: [
      { id: generateId(), text: "Request transcripts", completed: true },
      { id: generateId(), text: "Complete Common App", completed: true },
      { id: generateId(), text: "Write supplemental essays", completed: false },
      { id: generateId(), text: "Submit SAT scores", completed: false },
    ],
    essays: [],
    interviews: [],
  },
  {
    name: "Stanford University",
    location: "Stanford, CA",
    region: "West",
    schoolSize: "medium",
    status: "not_started",
    applicationDeadline: "2026-01-05",
    notes: "Strong engineering program. Located in Silicon Valley with great tech connections.",
    checklist: [],
    essays: [],
    interviews: [],
  },
  {
    name: "MIT",
    location: "Cambridge, MA",
    region: "Northeast",
    schoolSize: "medium",
    status: "not_started",
    applicationDeadline: "2026-01-01",
    notes: "Top choice for STEM. Very competitive but amazing research opportunities.",
    checklist: [],
    essays: [],
    interviews: [],
  },
];

// Sample Message Templates
export const sampleTemplates: Omit<MessageTemplate, 'id' | 'createdAt'>[] = [
  {
    title: "Request for Recommendation Letter",
    category: "recommendation",
    subject: "Recommendation Letter Request for College Application",
    body: `Dear [Teacher/Counselor Name],

I hope this email finds you well. I am writing to ask if you would be willing to write a letter of recommendation for my college applications.

I am applying to [University Name] for the [Academic Year] academic year, and the deadline for submission is [Deadline Date]. I believe your perspective on my academic performance and personal growth would add significant value to my application.

If you agree, I would be happy to provide you with:
- My current resume
- A list of my accomplishments
- Information about the universities I'm applying to
- Any forms or submission instructions

Please let me know if you have any questions or if there's anything I can do to make this process easier for you.

Thank you for considering my request.

Best regards,
Milo Ertugrul`
  },
  {
    title: "General Inquiry to Admissions",
    category: "inquiry",
    subject: "Question About Application Requirements",
    body: `Dear Admissions Office,

My name is Milo Ertugrul, and I am planning to apply for admission to [University Name] for the [Academic Year] academic year.

I have a question regarding [specific question about requirements/deadlines/process].

Could you please provide clarification on this matter?

Thank you for your time and assistance.

Best regards,
Milo Ertugrul
[Contact Information]`
  },
  {
    title: "Thank You After Interview",
    category: "thank_you",
    subject: "Thank You - Interview Follow-up",
    body: `Dear [Interviewer Name],

Thank you so much for taking the time to speak with me [yesterday/on date] about [University Name]. I truly enjoyed our conversation and learning more about the university's programs and campus culture.

Our discussion about [specific topic discussed] was particularly enlightening and has further strengthened my interest in attending [University Name].

I am very excited about the possibility of joining your community and contributing to [specific program/aspect discussed].

Thank you again for your time and consideration.

Best regards,
Milo Ertugrul`
  },
];

// Sample Reminders
export const sampleReminders: Omit<Reminder, 'id'>[] = [
  {
    title: "Submit Harvard Application",
    description: "Complete and submit all Harvard application materials including essays and test scores",
    dueDate: "2026-01-01",
    priority: "high",
    type: "deadline",
    completed: false,
  },
  {
    title: "Request Letters of Recommendation",
    description: "Follow up with teachers to ensure recommendation letters are submitted on time",
    dueDate: "2025-12-15",
    priority: "high",
    type: "follow_up",
    completed: false,
  },
];

// Function to setup demo data (run in browser console after localStorage.clear())
export const setupDemoData = () => {
  // Add sample universities
  const universities = sampleUniversities.map(u => ({
    ...u,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
  localStorage.setItem('college_tracker_universities', JSON.stringify(universities));

  // Add sample templates
  const templates = sampleTemplates.map(t => ({
    ...t,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }));
  localStorage.setItem('college_tracker_templates', JSON.stringify(templates));

  // Add sample reminders
  const reminders = sampleReminders.map(r => ({
    ...r,
    id: generateId(),
    universityId: universities[0].id, // Link first reminder to Harvard
  }));
  localStorage.setItem('college_tracker_reminders', JSON.stringify(reminders));

  console.log('Demo data loaded successfully!');
  window.location.reload();
};

// To use this script:
// 1. Open browser console (F12)
// 2. Copy and paste the setupDemoData function
// 3. Run: setupDemoData()

