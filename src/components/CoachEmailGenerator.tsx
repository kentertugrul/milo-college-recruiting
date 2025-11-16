import { useState } from 'react';
import { X, Copy, Check, Send } from 'lucide-react';
import { Coach, SoccerProgram, PlayerProfile, HighlightPackage } from '../types';
import { addCoachContact } from '../utils/storage';
import { generateId } from '../utils/helpers';

interface CoachEmailGeneratorProps {
  coach: Coach;
  program: SoccerProgram;
  universityName: string;
  playerProfile: PlayerProfile | null;
  highlightPackages: HighlightPackage[];
  onClose: () => void;
  onSent?: () => void;
}

const CoachEmailGenerator = ({
  coach,
  program,
  universityName,
  playerProfile,
  highlightPackages,
  onClose,
  onSent,
}: CoachEmailGeneratorProps) => {
  const [copied, setCopied] = useState(false);
  const [customSubject, setCustomSubject] = useState('');
  const [customBody, setCustomBody] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  // Generate default email
  const generateEmail = () => {
    const playerName = playerProfile?.name || 'Milo Ertugrul';
    const position = playerProfile?.primaryPosition || 'player';
    const videoUrl = highlightPackages[0]?.youtubeUrl || highlightPackages[0]?.vimeoUrl || '';
    
    const subject = `${playerName} - ${position} Interested in ${universityName} Soccer`;
    
    let body = `Dear Coach ${coach.name},\n\n`;
    body += `My name is ${playerName}, and I am a ${position} with a strong interest in joining the ${program.programName} program at ${universityName}.\n\n`;
    
    if (playerProfile?.summary) {
      body += `${playerProfile.summary}\n\n`;
    }
    
    if (playerProfile?.height || playerProfile?.dominantFoot) {
      body += `Player Profile:\n`;
      if (playerProfile.height) body += `- Height: ${playerProfile.height}\n`;
      if (playerProfile.dominantFoot) body += `- Dominant Foot: ${playerProfile.dominantFoot}\n`;
      if (playerProfile.primaryPosition) body += `- Primary Position: ${playerProfile.primaryPosition}\n`;
      if (playerProfile.secondaryPositions && playerProfile.secondaryPositions.length > 0) {
        body += `- Also plays: ${playerProfile.secondaryPositions.join(', ')}\n`;
      }
      body += `\n`;
    }
    
    if (coach.recruitingFocus) {
      body += `I understand that you focus on recruiting ${coach.recruitingFocus}, which aligns well with my background and playing style.\n\n`;
    }
    
    if (program.styleTags && program.styleTags.length > 0) {
      body += `I've researched your program and am particularly drawn to your ${program.styleTags.join(', ')} style of play, which matches my strengths and development goals.\n\n`;
    }
    
    if (playerProfile?.languages && playerProfile.languages.length > 1) {
      body += `I am multilingual, speaking ${playerProfile.languages.join(', ')}, which I believe would contribute positively to the team's diversity.\n\n`;
    }
    
    if (videoUrl) {
      body += `I would love for you to review my highlight video to get a better sense of my abilities:\n${videoUrl}\n\n`;
    } else {
      body += `I would be happy to send you my highlight video upon request.\n\n`;
    }
    
    if (coach.almaMater) {
      body += `I noticed you played/studied at ${coach.almaMater} - I'd love to hear about your experience there and how it shaped your coaching philosophy.\n\n`;
    }
    
    body += `I am very interested in learning more about ${universityName} and the ${program.programName} program. Would you be available for a brief call or meeting to discuss potential opportunities?\n\n`;
    body += `Thank you for your time and consideration. I look forward to hearing from you.\n\n`;
    body += `Best regards,\n${playerName}`;
    
    if (playerProfile?.clubs && playerProfile.clubs.length > 0) {
      body += `\nCurrent Club: ${playerProfile.clubs[0]}`;
    }

    return { subject, body };
  };

  const defaultEmail = generateEmail();
  const finalSubject = useCustom && customSubject ? customSubject : defaultEmail.subject;
  const finalBody = useCustom && customBody ? customBody : defaultEmail.body;

  const handleCopy = () => {
    const fullEmail = `Subject: ${finalSubject}\n\n${finalBody}`;
    navigator.clipboard.writeText(fullEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyBody = () => {
    navigator.clipboard.writeText(finalBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogAsSent = () => {
    const contact = {
      id: generateId(),
      coachId: coach.id,
      timestamp: new Date().toISOString(),
      channel: 'email' as const,
      subject: finalSubject,
      messagePreview: finalBody.substring(0, 200) + (finalBody.length > 200 ? '...' : ''),
      status: 'sent' as const,
      notes: 'Email generated and sent via Coach Email Generator',
    };

    addCoachContact(contact);
    
    if (onSent) {
      onSent();
    }
    
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '2rem', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h2>Generate Coach Email</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              To: {coach.name} ({coach.role}) at {universityName}
            </p>
          </div>
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

        {/* Toggle Custom Mode */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={useCustom}
              onChange={(e) => {
                setUseCustom(e.target.checked);
                if (e.target.checked && !customSubject) {
                  setCustomSubject(defaultEmail.subject);
                  setCustomBody(defaultEmail.body);
                }
              }}
            />
            <span style={{ fontSize: '0.875rem' }}>Edit email before sending</span>
          </label>
        </div>

        {/* Email Preview/Edit */}
        <div className="card" style={{ backgroundColor: 'var(--gray-50)', marginBottom: '1.5rem' }}>
          {/* Subject */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Subject:</label>
            {useCustom ? (
              <input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                style={{ width: '100%', marginTop: '0.5rem' }}
              />
            ) : (
              <div style={{
                padding: '0.75rem',
                backgroundColor: 'white',
                borderRadius: 'var(--radius)',
                marginTop: '0.5rem',
                fontWeight: 500
              }}>
                {finalSubject}
              </div>
            )}
          </div>

          {/* Body */}
          <div>
            <label style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Email Body:</label>
            {useCustom ? (
              <textarea
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
                style={{ width: '100%', minHeight: '400px', fontFamily: 'inherit', marginTop: '0.5rem' }}
              />
            ) : (
              <div style={{
                padding: '1rem',
                backgroundColor: 'white',
                borderRadius: 'var(--radius)',
                whiteSpace: 'pre-wrap',
                fontFamily: 'inherit',
                lineHeight: 1.6,
                marginTop: '0.5rem',
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                {finalBody}
              </div>
            )}
          </div>
        </div>

        {/* Key Talking Points */}
        <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: '#FEF3C7' }}>
          <h4 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            💡 Key Talking Points
          </h4>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.875rem', lineHeight: 1.8 }}>
            {coach.recruitingFocus && (
              <li>Coach focuses on: {coach.recruitingFocus}</li>
            )}
            {program.styleTags && program.styleTags.length > 0 && (
              <li>Team style: {program.styleTags.join(', ')}</li>
            )}
            {coach.almaMater && (
              <li>Coach's alma mater: {coach.almaMater}</li>
            )}
            {coach.favoriteFormations && coach.favoriteFormations.length > 0 && (
              <li>Preferred formations: {coach.favoriteFormations.join(', ')}</li>
            )}
            {coach.personalNotes && (
              <li>Your notes: {coach.personalNotes}</li>
            )}
          </ul>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleCopyBody}
            className="btn btn-secondary"
            style={{ flex: '1 1 200px' }}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'Copied!' : 'Copy Email Body'}
          </button>
          
          <button
            onClick={handleCopy}
            className="btn btn-secondary"
            style={{ flex: '1 1 200px' }}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'Copied!' : 'Copy Full Email'}
          </button>

          <button
            onClick={handleLogAsSent}
            className="btn btn-primary"
            style={{ flex: '1 1 200px' }}
          >
            <Send size={18} />
            Mark as Sent & Log
          </button>
        </div>

        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '1rem', textAlign: 'center' }}>
          Copy the email and paste it into your email client, then click "Mark as Sent" to log this contact.
        </p>
      </div>
    </div>
  );
};

export default CoachEmailGenerator;

