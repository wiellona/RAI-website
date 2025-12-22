import { GoogleGenerativeAI } from "@google/generative-ai";

// Support server and public env keys to avoid config issues
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY not found in environment variables");
}

export async function analyzeUniversityMetrics(
  universityName: string,
  metrics: {
    transparency: number;
    auditability: number;
    dataPrivacy: number;
    policyMaturity: number;
  },
  trustScore: number
) {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key is not configured");
  }

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `You are an AI ethics and responsible AI governance expert. Analyze the following university's AI responsibility metrics and provide detailed recommendations.

University: ${universityName}

Current Metrics (0-100 scale):
- Transparency: ${metrics.transparency}/100
- Auditability: ${metrics.auditability}/100
- Data Privacy: ${metrics.dataPrivacy}/100
- Policy Maturity: ${metrics.policyMaturity}/100
- Overall Trust Score: ${trustScore}/100

Please provide:
1. **Overall Assessment**: Brief summary of the university's AI responsibility standing
2. **Strengths**: What metrics are performing well and why
3. **Areas for Improvement**: Which metrics need attention
4. **Specific Recommendations**: Actionable steps to improve each weak metric (be specific and practical)
5. **Priority Actions**: Top 3 most important actions to take immediately

Format your response in clear sections with bullet points where appropriate. Be constructive, specific, and provide actionable insights.`;

  // Generate content
  const result = await model.generateContent(prompt);
  const response = await result.response;
  
  return response.text();
}

// Analyzer using 8 Responsible AI dimensions available in the app
export async function analyzeUniversityRAI(
  universityName: string,
  raiMetrics: {
    collaboration: number | null;
    privacy: number | null;
    accountability: number | null;
    security: number | null;
    ethicsInAI: number | null;
    fairness: number | null;
    transparency: number | null;
    continuousLearning: number | null;
  },
  trustScore: number
) {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key is not configured");
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const fmt = (v: number | null) => (v == null ? "N/A" : `${v}/100`);

  const prompt = `You are an AI ethics and responsible AI governance expert. Analyze the following university's Responsible AI metrics and provide detailed, practical recommendations.

University: ${universityName}

Current Metrics (0-100 scale):
- Collaboration: ${fmt(raiMetrics.collaboration)}
- Privacy: ${fmt(raiMetrics.privacy)}
- Accountability: ${fmt(raiMetrics.accountability)}
- Security: ${fmt(raiMetrics.security)}
- Ethics in AI: ${fmt(raiMetrics.ethicsInAI)}
- Fairness: ${fmt(raiMetrics.fairness)}
- Transparency: ${fmt(raiMetrics.transparency)}
- Continuous Learning: ${fmt(raiMetrics.continuousLearning)}
- Overall Trust Score: ${trustScore}/100

Please provide:
1. Overall Assessment
2. Strengths (what is performing well and why)
3. Areas for Improvement (which metrics need attention)
4. Specific Recommendations (actionable steps for each weaker metric)
5. Priority Actions (top 3 actions to take immediately)

Format your response in clear sections with bullet points where appropriate. Be constructive, specific, and provide actionable insights.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
