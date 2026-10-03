/**
 * Client-Side Mock AI Service
 * Simulates intelligent AI response generation with realistic 800ms delay
 * Adheres to SRS Section 3.2.4 (FR-4) with zero external API dependencies
 */

const sleep = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

export const emailTemplates = {
  'Leave Request': {
    Formal: {
      subject: (p) => `Formal Application for Leave of Absence - ${p.slice(0, 30)}`,
      salutation: 'Dear Respected Authority,',
      body: (p) => `I am writing to formally request a leave of absence from my responsibilities. The primary reason for this request is as follows: ${p}.\n\nI have taken the necessary steps to delegate my urgent tasks and ensure that all pending deliverables are appropriately documented. Should any critical matters arise during my absence, I will remain accessible via email.\n\nI kindly request your approval of this leave application. Thank you for your understanding and consideration.`,
      closing: 'Sincerely,\n[Your Full Name]\n[Roll No / Employee ID]'
    },
    Professional: {
      subject: (p) => `Leave Request: [Your Name] - ${p.slice(0, 30)}`,
      salutation: 'Dear Team Lead,',
      body: (p) => `I am writing to request time off regarding: ${p}.\n\nI have organized my current assignments and briefed my team to ensure our workflow continues smoothly. I will ensure all urgent responsibilities are completed before my departure.\n\nPlease let me know if you need any further information to process this request.`,
      closing: 'Best regards,\n[Your Name]'
    },
    Friendly: {
      subject: (p) => `Quick note: Time off request (${p.slice(0, 25)})`,
      salutation: 'Hi Team,',
      body: (p) => `Hope you're all having a great week! I am reaching out to let you know that I will need some time off for: ${p}.\n\nEverything on my desk is either wrapped up or handed over to the team. I will jump right back in once I am back!\n\nThanks so much for understanding.`,
      closing: 'Cheers,\n[Your Name]'
    },
    Polite: {
      subject: (p) => `Humbly Requesting Leave of Absence - ${p.slice(0, 30)}`,
      salutation: 'Respected Sir / Madam,',
      body: (p) => `I most respectfully submit this leave application for your kind consideration regarding: ${p}.\n\nI have ensured that all my duties are up-to-date and have made arrangements to cover any unexpected requirements. I shall be immensely grateful for your kind approval.\n\nThanking you in anticipation.`,
      closing: 'Yours obediently,\n[Your Full Name]'
    }
  },
  'Permission Request': {
    Formal: {
      subject: (p) => `Request for Formal Permission - ${p.slice(0, 35)}`,
      salutation: 'Dear Sir / Madam,',
      body: (p) => `I am writing to formally seek your institutional permission regarding: ${p}.\n\nThis opportunity will greatly aid my professional development and academic progress. I assure you that all required guidelines and responsibilities will be strictly maintained.\n\nI request you to kindly grant the requisite permission at your earliest convenience.`,
      closing: 'Respectfully yours,\n[Your Name]'
    },
    Professional: {
      subject: (p) => `Permission Request: ${p.slice(0, 35)}`,
      salutation: 'Dear [Coordinator / Manager Name],',
      body: (p) => `I would like to request permission regarding the following matter: ${p}.\n\nI have prepared the necessary roadmap and completed preliminary preparations. Participating in this will bring valuable insights and positive outcomes to our ongoing initiatives.\n\nThank you for your guidance and support.`,
      closing: 'Best regards,\n[Your Name]'
    },
    Friendly: {
      subject: (p) => `Seeking your approval for ${p.slice(0, 25)}`,
      salutation: 'Hi [Name],',
      body: (p) => `I wanted to quickly check in and get your green light on: ${p}.\n\nIt looks like a great opportunity to explore and bring back valuable learnings for the whole group. Let me know if this works for you!`,
      closing: 'Warmly,\n[Your Name]'
    },
    Polite: {
      subject: (p) => `Kind Request for Permission Regarding ${p.slice(0, 30)}`,
      salutation: 'Respected Authority,',
      body: (p) => `I humbly submit this letter seeking your kind permission for: ${p}.\n\nYour favorable consent will be of tremendous support to my academic endeavors. I promise to fulfill all prerequisites without fail.\n\nThank you very much for your time and guidance.`,
      closing: 'With highest regards,\n[Your Name]'
    }
  },
  'Complaint': {
    Formal: {
      subject: (p) => `Notice of Formal Grievance: ${p.slice(0, 35)}`,
      salutation: 'To the Grievance & Support Committee,',
      body: (p) => `I am writing to register an official complaint regarding: ${p}.\n\nDespite previous attempts to resolve this issue through regular channels, no satisfactory resolution has been provided. This has caused considerable inconvenience and disrupted normal operations.\n\nI expect an official acknowledgment and an expedited resolution within an acceptable timeline.`,
      closing: 'Sincerely,\n[Your Name]\n[Contact Information]'
    },
    Professional: {
      subject: (p) => `Issue Escalation: ${p.slice(0, 35)}`,
      salutation: 'Dear Support Team,',
      body: (p) => `I am reaching out to escalate an issue regarding: ${p}.\n\nThe current situation is significantly affecting progress. I have documented all necessary details and would appreciate an urgent investigation into the root cause.\n\nPlease provide an update on expected resolution steps as soon as possible.`,
      closing: 'Best regards,\n[Your Name]'
    },
    Friendly: {
      subject: (p) => `Need a hand resolving an issue: ${p.slice(0, 30)}`,
      salutation: 'Hi [Support / Team],',
      body: (p) => `Hope you're doing well. I ran into a bit of a snag regarding: ${p}.\n\nI tried getting it sorted out on my end, but it looks like I need your expertise to get things back on track. Could you take a look when you have a moment?\n\nReally appreciate your help!`,
      closing: 'Best,\n[Your Name]'
    },
    Polite: {
      subject: (p) => `Humble Representation Regarding Inconvenience: ${p.slice(0, 30)}`,
      salutation: 'Dear Customer Support Team,',
      body: (p) => `I wish to bring to your kind notice a matter that requires prompt attention: ${p}.\n\nI understand that operational challenges happen, but resolving this promptly would bring great relief and restore smooth functionality.\n\nThank you kindly for looking into this matter.`,
      closing: 'Sincerely,\n[Your Name]'
    }
  },
  'Job/Internship': {
    Formal: {
      subject: (p) => `Application for Position / Opportunity - [Your Name]`,
      salutation: 'Dear Hiring Committee,',
      body: (p) => `I am writing to express my eager candidacy for the position regarding: ${p}.\n\nWith a disciplined academic background and strong hands-on problem solving capabilities, I am confident in my ability to contribute meaningfully to your organization's vision. My resume is attached for your detailed consideration.\n\nI would be honored to discuss my background and qualifications in an interview.`,
      closing: 'Respectfully yours,\n[Your Full Name]\n[Portfolio / LinkedIn / Phone]'
    },
    Professional: {
      subject: (p) => `Job Application: [Your Name] - ${p.slice(0, 30)}`,
      salutation: 'Dear Hiring Manager,',
      body: (p) => `I am pleased to submit my application in response to: ${p}.\n\nHaving honed skills in modern development and collaborative teamwork, I believe my background aligns well with your team's current technical needs and goals. I look forward to the prospect of adding immediate value to your projects.\n\nThank you for reviewing my application. I look forward to hearing from you.`,
      closing: 'Best regards,\n[Your Name]'
    },
    Friendly: {
      subject: (p) => `Excited to connect regarding opportunities in ${p.slice(0, 25)}!`,
      salutation: 'Hi [Hiring Team / Recruiter Name],',
      body: (p) => `I've been following your company's incredible journey and was excited to see openings related to: ${p}.\n\nMy profile matches what you are building, and I would love the chance to jump in and contribute to the team culture and mission. Let's set up a quick chat if you see a fit!`,
      closing: 'Best,\n[Your Name]'
    },
    Polite: {
      subject: (p) => `Kind Submission of Job Application - [Your Name]`,
      salutation: 'Respected Sir / Madam,',
      body: (p) => `I humbly submit my application for consideration regarding: ${p}.\n\nI am eager to learn, dedicate myself completely, and contribute diligently to your esteemed organization under your esteemed guidance. Please find my credentials attached.\n\nThank you very much for your precious time and kind consideration.`,
      closing: 'Yours sincerely,\n[Your Name]'
    }
  },
  'Thank You': {
    Formal: {
      subject: (p) => `Expression of Gratitude - ${p.slice(0, 35)}`,
      salutation: 'Dear Sir / Madam,',
      body: (p) => `I am writing to express my sincere appreciation and gratitude for: ${p}.\n\nYour invaluable support, counsel, and timely assistance were instrumental in achieving a successful outcome. I deeply appreciate the dedication and professional courtesy extended to me.`,
      closing: 'With highest regards,\n[Your Name]'
    },
    Professional: {
      subject: (p) => `Thank You: ${p.slice(0, 35)}`,
      salutation: 'Dear [Colleague / Partner],',
      body: (p) => `Thank you very much for your collaboration regarding: ${p}.\n\nWorking alongside you made the process efficient and seamless. I look forward to our continued partnership on upcoming milestones.`,
      closing: 'Best regards,\n[Your Name]'
    },
    Friendly: {
      subject: (p) => `Big thank you for ${p.slice(0, 25)}! 😊`,
      salutation: 'Hi [Name],',
      body: (p) => `Just wanted to drop a quick note to say a huge thank you for: ${p}!\n\nYou really saved the day and made things so much easier. Drinks or coffee on me next time we connect!`,
      closing: 'Warmly,\n[Your Name]'
    },
    Polite: {
      subject: (p) => `Heartfelt Thanks for Your Kind Assistance`,
      salutation: 'Respected [Sir / Madam / Team],',
      body: (p) => `I would like to extend my heartfelt gratitude for your benevolence regarding: ${p}.\n\nYour generosity and support have left a lasting positive impression. May your kindness always be rewarded.`,
      closing: 'Respectfully and gratefully,\n[Your Name]'
    }
  },
  'General Request': {
    Formal: {
      subject: (p) => `Formal Request for Information: ${p.slice(0, 35)}`,
      salutation: 'Dear Sir / Madam,',
      body: (p) => `I am writing to formally request information regarding: ${p}.\n\nCould you kindly direct me to the relevant documentation, procedures, or designated personnel who oversee this matter? If additional verification is needed from my end, I will provide it immediately.\n\nThank you for your assistance.`,
      closing: 'Sincerely,\n[Your Name]'
    },
    Professional: {
      subject: (p) => `Inquiry: ${p.slice(0, 35)}`,
      salutation: 'Dear [Name / Team],',
      body: (p) => `I am reaching out regarding: ${p}.\n\nCould you please share your insights or the latest update on this matter when you get a chance? Let me know if a brief sync would be helpful.`,
      closing: 'Best regards,\n[Your Name]'
    },
    Friendly: {
      subject: (p) => `Quick question about ${p.slice(0, 25)}`,
      salutation: 'Hi [Name],',
      body: (p) => `Hope your week is going great! I wanted to check in quickly regarding: ${p}.\n\nDo you have any quick pointers or advice on how best to tackle this? Any help would be awesome!`,
      closing: 'Thanks a ton,\n[Your Name]'
    },
    Polite: {
      subject: (p) => `Humble Inquiry Concerning ${p.slice(0, 30)}`,
      salutation: 'Respected Sir / Madam,',
      body: (p) => `I kindly request a few moments of your time to inquire regarding: ${p}.\n\nAny guidance or clarification you can generously provide will be of immense benefit. Thank you very much for your kindness and consideration.`,
      closing: 'With respectful regards,\n[Your Name]'
    }
  }
};

/**
 * Generate email using client-side mock AI
 */
export const generateEmailAI = async ({ purpose, emailType, tone }) => {
  await sleep(800); // 800ms simulated generation delay

  const typeConfig = emailTemplates[emailType] || emailTemplates['General Request'];
  const toneConfig = typeConfig[tone] || typeConfig['Professional'];

  const subject = toneConfig.subject(purpose);
  const body = `${toneConfig.salutation}\n\n${toneConfig.body(purpose)}\n\n${toneConfig.closing}`;

  return {
    subject,
    generatedContent: body,
  };
};

/**
 * Career Guidance & Mentorship Mock Functions (for FYP evaluation and prompt compliance)
 */
export const getCareerRecommendations = async (profile) => {
  await sleep(800);
  return {
    recommendedRoles: [
      { title: 'Full Stack MERN Developer', matchRate: '95%', description: 'Building scalable modern web applications' },
      { title: 'AI Integration Engineer', matchRate: '88%', description: 'Connecting LLM capabilities with enterprise software' },
      { title: 'Cloud Backend Architect', matchRate: '82%', description: 'Managing microservices, databases and APIs' }
    ]
  };
};

export const generateRoadmap = async (career) => {
  await sleep(800);
  return {
    career,
    phases: [
      { step: 1, title: 'Foundations', skills: ['JavaScript ES6+', 'HTML5', 'CSS3 / Tailwind', 'Git & GitHub'] },
      { step: 2, title: 'Backend & DB', skills: ['Node.js', 'Express.js', 'MongoDB / Mongoose', 'REST API Design'] },
      { step: 3, title: 'Frontend Mastery', skills: ['React.js', 'Hooks', 'Context API', 'State Management'] },
      { step: 4, title: 'AI & Production', skills: ['LLM Prompts & APIs', 'Docker', 'Vercel / Render Deployment'] }
    ]
  };
};

export const analyzeReadiness = async (skills, jd) => {
  await sleep(800);
  return {
    readinessScore: 88,
    strengths: ['Modern JavaScript', 'RESTful API Integration', 'Responsive Design'],
    gaps: ['Advanced Caching (Redis)', 'CI/CD Pipelines'],
    recommendation: 'Practice deployment pipelines and caching to achieve 100% readiness.'
  };
};

export const answerMentorQuestion = async (question) => {
  await sleep(800);
  return {
    question,
    answer: 'Focus on clean separation of concerns: modular controllers, robust validation, and error boundaries. A well-structured project communicates professionalism immediately.',
    timestamp: new Date().toISOString()
  };
};

export default {
  generateEmailAI,
  getCareerRecommendations,
  generateRoadmap,
  analyzeReadiness,
  answerMentorQuestion,
};
