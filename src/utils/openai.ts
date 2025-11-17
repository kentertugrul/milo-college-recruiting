// OpenAI API integration for university research

// API key from environment variable (set in .env.local or deployment)
// For local: add to .env.local
// For deployment: add as GitHub secret and environment variable
const API_KEY_FROM_ENV = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;

const OPENAI_API_KEY_STORAGE = 'milo_openai_api_key';

export const getOpenAIKey = (): string | null => {
  // Priority 1: Environment variable (recommended)
  if (API_KEY_FROM_ENV) {
    return API_KEY_FROM_ENV;
  }
  
  // Priority 2: Fall back to localStorage
  return localStorage.getItem(OPENAI_API_KEY_STORAGE);
};

export const setOpenAIKey = (key: string): void => {
  localStorage.setItem(OPENAI_API_KEY_STORAGE, key);
};

export const removeOpenAIKey = (): void => {
  localStorage.removeItem(OPENAI_API_KEY_STORAGE);
};

export interface UniversityResearchData {
  name: string;
  location: string;
  region: 'Northeast' | 'Southeast' | 'Midwest' | 'Southwest' | 'West' | 'International';
  schoolSize: 'small' | 'medium' | 'large' | 'very_large';
  applicationDeadline: string;
  earlyDeadline?: string;
  notes: string;
  // Admission Statistics
  admissionRate?: number;
  averageIB?: number;
  averageGPA?: number;
  averageSAT?: number;
  averageACT?: number;
  admissionStatsNotes?: string;
  // Soccer data
  hasSoccerProgram: boolean;
  soccerProgramName?: string;
  soccerLevel?: 'D1' | 'D2' | 'D3' | 'Club';
  conference?: string;
  officialSiteUrl?: string;
  soccerWebsiteUrl?: string;
  rosterUrl?: string;
  staffUrl?: string;
}

export const searchUniversity = async (universityName: string): Promise<UniversityResearchData | null> => {
  const apiKey = getOpenAIKey();
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const prompt = `You are helping a student research colleges. Provide detailed, accurate information about ${universityName}.

Return a JSON object with this exact structure (use null for unknown fields):
{
  "name": "Official university name",
  "location": "City, State (or City, Country for international)",
  "region": "One of: Northeast, Southeast, Midwest, Southwest, West, or International",
  "schoolSize": "One of: small (<2000), medium (2000-10000), large (10000-20000), very_large (>20000)",
  "studentCount": approximate number,
  "applicationDeadline": "Typical regular decision deadline in YYYY-MM-DD format (use next year's likely date)",
  "earlyDeadline": "Early decision/action deadline in YYYY-MM-DD format if applicable, or null",
  "notes": "Brief 2-3 sentence overview covering academics, notable programs, campus culture, and any unique features",
  "admissionRate": decimal admission rate (e.g., 0.05 for 5%, 0.15 for 15%) or null,
  "averageIB": typical IB score of admitted students (e.g., 40, 42) or null,
  "averageGPA": average unweighted GPA of admitted students on 4.0 scale (e.g., 3.9) or null,
  "averageSAT": average SAT score (e.g., 1500) or null,
  "averageACT": average ACT score (e.g., 33) or null,
  "admissionStatsNotes": "Brief note about admission competitiveness and what they look for in applicants" or null,
  "hasSoccerProgram": true/false,
  "soccerProgramName": "Official team name (e.g., 'Stanford Cardinal Men's Soccer') or null",
  "soccerLevel": "D1, D2, D3, or Club (null if no program)",
  "conference": "Athletic conference name (e.g., 'ACC', 'Big Ten') or null",
  "officialSiteUrl": "Main university website or null",
  "soccerWebsiteUrl": "Soccer team website or null",
  "rosterUrl": "Link to soccer roster or null",
  "staffUrl": "Link to coaching staff page or null"
}

Important: Return ONLY the JSON object, no additional text or markdown.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that provides accurate information about universities and their athletic programs. Always return valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API request failed');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    const universityData = JSON.parse(content.trim());
    
    // Map to our interface
    const result: UniversityResearchData = {
      name: universityData.name,
      location: universityData.location,
      region: universityData.region,
      schoolSize: universityData.schoolSize,
      applicationDeadline: universityData.applicationDeadline,
      earlyDeadline: universityData.earlyDeadline || undefined,
      notes: universityData.notes || '',
      admissionRate: universityData.admissionRate || undefined,
      averageIB: universityData.averageIB || undefined,
      averageGPA: universityData.averageGPA || undefined,
      averageSAT: universityData.averageSAT || undefined,
      averageACT: universityData.averageACT || undefined,
      admissionStatsNotes: universityData.admissionStatsNotes || undefined,
      hasSoccerProgram: universityData.hasSoccerProgram || false,
      soccerProgramName: universityData.soccerProgramName || undefined,
      soccerLevel: universityData.soccerLevel || undefined,
      conference: universityData.conference || undefined,
      officialSiteUrl: universityData.officialSiteUrl || undefined,
      soccerWebsiteUrl: universityData.soccerWebsiteUrl || undefined,
      rosterUrl: universityData.rosterUrl || undefined,
      staffUrl: universityData.staffUrl || undefined,
    };

    return result;
  } catch (error) {
    console.error('Error searching university:', error);
    throw error;
  }
};

export const isAPIKeyConfigured = (): boolean => {
  return !!getOpenAIKey();
};

