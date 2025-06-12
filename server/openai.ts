import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface CVOptimizationResult {
  optimizedContent: string;
  suggestions: string[];
  improvements: string[];
  score: number;
}

export class AIOptimizationService {
  async optimizeCV(profileData: any): Promise<CVOptimizationResult> {
    const prompt = `
    Analyze and optimize this CV profile for maximum professional impact. Provide specific improvements and suggestions.
    
    Profile Data:
    Name: ${profileData.name}
    Tagline: ${profileData.tagline}
    Bio: ${profileData.bio}
    Skills: ${profileData.skills?.join(', ')}
    Work History: ${JSON.stringify(profileData.workHistory || [])}
    Projects: ${JSON.stringify(profileData.projects || [])}
    
    Please provide a JSON response with:
    - optimizedContent: Improved version of the bio and tagline
    - suggestions: Array of specific improvement suggestions
    - improvements: Array of what was improved and why
    - score: Professional impact score from 1-100
    `;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a professional career coach and CV optimization expert. Provide detailed, actionable feedback to improve professional profiles. Always respond with valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1500
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        optimizedContent: result.optimizedContent || profileData.bio,
        suggestions: result.suggestions || [],
        improvements: result.improvements || [],
        score: Math.max(1, Math.min(100, result.score || 75))
      };
    } catch (error: any) {
      throw new Error("Failed to optimize CV: " + (error?.message || 'Unknown error'));
    }
  }

  async generateProfessionalSummary(workHistory: any[], skills: string[]): Promise<string> {
    const prompt = `
    Create a compelling professional summary based on this work history and skills:
    
    Work History: ${JSON.stringify(workHistory)}
    Skills: ${skills.join(', ')}
    
    Write a 2-3 sentence professional summary that highlights key achievements and expertise.
    `;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a professional resume writer. Create compelling, concise professional summaries."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 200
      });

      return response.choices[0].message.content || "";
    } catch (error: any) {
      throw new Error("Failed to generate summary: " + (error?.message || 'Unknown error'));
    }
  }

  async improveJobDescription(description: string, position: string, company: string): Promise<string> {
    const prompt = `
    Improve this job description to be more impactful and achievement-focused:
    
    Position: ${position}
    Company: ${company}
    Current Description: ${description}
    
    Rewrite to emphasize achievements, quantify results where possible, and use strong action verbs.
    `;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a professional resume writer. Transform job descriptions into achievement-focused statements with strong action verbs and quantified results."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 300
      });

      return response.choices[0].message.content || description;
    } catch (error: any) {
      throw new Error("Failed to improve description: " + (error?.message || 'Unknown error'));
    }
  }

  async suggestSkills(workHistory: any[], currentSkills: string[]): Promise<string[]> {
    const prompt = `
    Based on this work history and current skills, suggest 5-10 additional relevant skills that would strengthen this professional profile:
    
    Work History: ${JSON.stringify(workHistory)}
    Current Skills: ${currentSkills.join(', ')}
    
    Respond with a JSON array of skill suggestions: ["skill1", "skill2", "skill3"]
    `;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a career advisor. Suggest relevant professional skills based on work experience. Respond with valid JSON array format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 200
      });

      const result = JSON.parse(response.choices[0].message.content || '{"skills": []}');
      return result.skills || [];
    } catch (error: any) {
      throw new Error("Failed to suggest skills: " + (error?.message || 'Unknown error'));
    }
  }
}

export const aiOptimizationService = new AIOptimizationService();

export interface CVSuggestion {
  section: string;
  originalContent: string;
  improvedContent: string;
  suggestions: string[];
  reasoning: string;
  impact: "high" | "medium" | "low";
  keywords: string[];
}

export interface CVSuggestionResponse {
  suggestions: CVSuggestion[];
  overallScore: number;
  improvementAreas: string[];
  strengthAreas: string[];
}

export class CVSuggestionService {
  async generateSectionSuggestions(
    section: string,
    content: string,
    targetRole?: string,
    industry?: string
  ): Promise<CVSuggestionResponse> {
    const prompt = this.buildSuggestionPrompt(section, content, targetRole, industry);

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `You are an expert CV optimization consultant with deep knowledge of recruitment practices across industries. 
            Analyze the provided CV section and provide detailed, actionable suggestions for improvement.
            
            Focus on:
            - Impact-driven language and quantifiable achievements
            - Industry-specific keywords and terminology
            - ATS (Applicant Tracking System) optimization
            - Professional presentation and clarity
            - Relevance to target role and industry
            
            Respond with valid JSON only, no additional text.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return this.validateAndFormatResponse(result, section, content);
    } catch (error) {
      console.error("CV suggestion generation failed:", error);
      throw new Error("Failed to generate CV suggestions");
    }
  }

  private buildSuggestionPrompt(
    section: string,
    content: string,
    targetRole?: string,
    industry?: string
  ): string {
    const roleContext = targetRole ? `Target Role: ${targetRole}` : "";
    const industryContext = industry ? `Industry: ${industry}` : "";
    
    return `
Analyze this CV ${section} section and provide optimization suggestions:

${roleContext}
${industryContext}

Current Content:
"${content}"

Provide a JSON response with this structure:
{
  "suggestions": [{
    "section": "${section}",
    "originalContent": "original text excerpt",
    "improvedContent": "enhanced version",
    "suggestions": ["specific improvement tip 1", "specific improvement tip 2"],
    "reasoning": "explanation of why these changes improve the content",
    "impact": "high|medium|low",
    "keywords": ["relevant keyword 1", "relevant keyword 2"]
  }],
  "overallScore": 75,
  "improvementAreas": ["area that needs improvement"],
  "strengthAreas": ["existing strength in the content"]
}

Focus on:
- Action verbs and quantifiable achievements
- Industry-specific terminology and keywords
- ATS optimization
- Professional impact and clarity
- Relevance to target role/industry
    `.trim();
  }

  private validateAndFormatResponse(
    result: any,
    section: string,
    originalContent: string
  ): CVSuggestionResponse {
    // Ensure response has required structure
    const suggestions: CVSuggestion[] = (result.suggestions || []).map((suggestion: any) => ({
      section: suggestion.section || section,
      originalContent: suggestion.originalContent || originalContent.substring(0, 200),
      improvedContent: suggestion.improvedContent || "",
      suggestions: Array.isArray(suggestion.suggestions) ? suggestion.suggestions : [],
      reasoning: suggestion.reasoning || "",
      impact: ["high", "medium", "low"].includes(suggestion.impact) ? suggestion.impact : "medium",
      keywords: Array.isArray(suggestion.keywords) ? suggestion.keywords : []
    }));

    return {
      suggestions,
      overallScore: Math.min(100, Math.max(0, result.overallScore || 50)),
      improvementAreas: Array.isArray(result.improvementAreas) ? result.improvementAreas : [],
      strengthAreas: Array.isArray(result.strengthAreas) ? result.strengthAreas : []
    };
  }
}

export const cvSuggestionService = new CVSuggestionService();