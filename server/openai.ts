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