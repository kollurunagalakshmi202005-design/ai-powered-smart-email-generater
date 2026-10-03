/**
 * AI Email Generation Service (Gemini API with Smart Fallback Engine)
 * Adheres strictly to SRS Section 3.2.4 (FR-4) & Appendix B
 */

const buildPrompt = ({ purpose, emailType, tone }) => {
  return `You are a professional email writing assistant.
Please generate a well-structured, grammatically flawless email based on the following requirements:
- Email Type: ${emailType}
- Tone: ${tone}
- Purpose / Key Details: ${purpose}

Requirements:
1. Start with a clear, concise subject line on the very first line starting with: "Subject: <Subject Here>"
2. Provide a suitable salutation / greeting (e.g. "Dear [Recipient Name or Title],")
3. Provide clear, professional body paragraphs tailored to the specified tone and email type.
4. Provide an appropriate professional closing and sign-off (e.g. "Sincerely,", "Best regards," followed by "[Your Name]").
5. Do NOT include markdown code blocks, conversational pleasantries, or preamble. Return only the email content.`;
};

const parseEmailResponse = (text) => {
  const lines = text.trim().split('\n');
  let subject = 'Subject: Professional Communication';
  let bodyLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.toLowerCase().startsWith('subject:')) {
      subject = line.replace(/^subject:\s*/i, '').trim();
    } else {
      bodyLines.push(lines[i]);
    }
  }

  // Join body text, trimming extraneous whitespace
  const generatedContent = bodyLines.join('\n').trim();

  return {
    subject: subject || 'Subject: Regarding Your Request',
    generatedContent: generatedContent || text.trim(),
  };
};

/**
 * Intelligent Rule-Based Email Generator Engine
 * Used when GEMINI_API_KEY is not configured or rate limits/quota are exceeded
 * Produces contextually tailored subjects, greetings, bodies, and closings
 */
const generateMockEmail = ({ purpose, emailType, tone }) => {
  const cleanPurpose = purpose.trim();

  const greetings = {
    Formal: 'Dear Sir / Madam,',
    Professional: 'Dear [Manager / Team Lead Name],',
    Friendly: 'Hi [Name],',
    Polite: 'Respected [Sir / Madam],'
  };

  const closings = {
    Formal: 'Sincerely,\n[Your Full Name]\n[Your Contact Information / Department]',
    Professional: 'Best regards,\n[Your Name]\n[Your Title / Role]',
    Friendly: 'Warm regards,\n[Your Name]',
    Polite: 'Thank you very much for your time and kind consideration.\n\nRespectfully,\n[Your Name]'
  };

  let subject = '';
  let body = '';

  switch (emailType) {
    case 'Leave Request':
      subject = tone === 'Formal' 
        ? `Formal Application for Leave of Absence - [Your Name]`
        : `Leave Request: [Your Name] - Regarding ${cleanPurpose.slice(0, 30)}...`;
      
      body = `${greetings[tone] || 'Dear Sir / Madam,'}

I am writing to formally request a leave of absence due to the following reason: ${cleanPurpose}.

During my absence, I have ensured that my immediate responsibilities and ongoing tasks are organized and documented so there is minimal disruption to the workflow. In case of any urgent matters, I can be reached via email or phone.

I would be grateful if you could kindly approve my leave for the requested duration. Please let me know if any additional details or formal documentation are required.

${closings[tone] || 'Sincerely,\n[Your Name]'}`;
      break;

    case 'Permission Request':
      subject = `Request for Permission - ${cleanPurpose.slice(0, 40)}`;
      body = `${greetings[tone] || 'Dear Respected Authority,'}

I hope this email finds you well. I am writing to formally seek your permission regarding the following matter: ${cleanPurpose}.

I have thoroughly reviewed the requirements and guidelines for this initiative and will ensure complete adherence to all necessary protocols. Granting this permission will significantly contribute toward the successful completion of this objective.

Thank you in advance for considering this request. I look forward to your favorable response.

${closings[tone] || 'Best regards,\n[Your Name]'}`;
      break;

    case 'Complaint':
      subject = `Formal Complaint Regarding: ${cleanPurpose.slice(0, 35)}`;
      body = `${greetings[tone] || 'Dear Customer Support / Management Team,'}

I am writing to bring an urgent issue to your attention and register a formal complaint regarding: ${cleanPurpose}.

This situation has caused noticeable inconvenience and falls below the expected standards of service and reliability. I have already attempted basic troubleshooting, but the problem persists.

I kindly request that your team investigate this matter promptly and provide a clear resolution or update within an appropriate timeframe.

${closings[tone] || 'Sincerely,\n[Your Name]'}`;
      break;

    case 'Job/Internship':
      subject = `Application for Position / Internship Opportunity - [Your Name]`;
      body = `${greetings[tone] || 'Dear Hiring Manager,'}

I am writing to express my strong enthusiasm and interest in applying for opportunities within your esteemed organization, specifically regarding: ${cleanPurpose}.

With a strong foundation in modern technical and collaborative practices, I am eager to contribute my skills and dedication to your team's ongoing initiatives. I welcome the opportunity to learn, innovate, and add meaningful value to your projects.

Attached is my resume for your review. I would appreciate the chance to discuss how my qualifications align with your organizational goals in an interview.

${closings[tone] || 'Best regards,\n[Your Name]'}`;
      break;

    case 'Thank You':
      subject = `Heartfelt Thank You - ${cleanPurpose.slice(0, 35)}`;
      body = `${greetings[tone] || 'Dear [Name / Team],'}

I wanted to take a moment to express my sincere appreciation and gratitude regarding: ${cleanPurpose}.

Your support, prompt assistance, and valuable guidance made a meaningful difference, and I truly value the time and effort you dedicated to helping me achieve this outcome.

Thank you once again for your kindness and collaboration. I look forward to working with you again in the future.

${closings[tone] || 'Warm regards,\n[Your Name]'}`;
      break;

    case 'General Request':
    default:
      subject = `Inquiry & Request: ${cleanPurpose.slice(0, 40)}`;
      body = `${greetings[tone] || 'Dear [Recipient Name],'}

I hope you are having a productive day. I am reaching out to submit a request regarding: ${cleanPurpose}.

Could you kindly share the relevant information, guidance, or next steps to proceed with this matter? If any additional details or background materials are needed from my end, I would be pleased to provide them immediately.

Thank you very much for your assistance and support.

${closings[tone] || 'Best regards,\n[Your Name]'}`;
      break;
  }

  return {
    subject,
    generatedContent: body,
  };
};

/**
 * Main generateEmail function that calls Gemini API if key exists,
 * or safely falls back to high-grade rule-based generation
 */
const generateEmail = async ({ purpose, emailType, tone }) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    // Zero-friction fallback when no API key configured
    // Small artificial delay to simulate realistic AI generation feel
    await new Promise(resolve => setTimeout(resolve, 800));
    return generateMockEmail({ purpose, emailType, tone });
  }

  try {
    const prompt = buildPrompt({ purpose, emailType, tone });
    
    // Call Gemini 1.5 Flash endpoint (Free Tier eligible model)
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn('[Gemini API] Request failed with status', response.status, errorData);
      
      // Check for rate limit or quota exhaustion (HTTP 429)
      if (response.status === 429) {
        console.warn('[Gemini API] Quota/Rate limit encountered. Falling back to rule-based generation.');
      }
      // Graceful fallback so user demonstration never breaks
      return generateMockEmail({ purpose, emailType, tone });
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      return generateMockEmail({ purpose, emailType, tone });
    }

    return parseEmailResponse(candidateText);
  } catch (error) {
    console.error('[Gemini Service] Error generating email via API:', error.message);
    // Graceful fallback as required by SRS Section 3.2.4 (FR-4.6)
    return generateMockEmail({ purpose, emailType, tone });
  }
};

module.exports = {
  generateEmail,
  buildPrompt,
  parseEmailResponse,
  generateMockEmail,
};
