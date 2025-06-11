import { Request, Response } from "express";

// ResumeFormatter.io API Integration
export class ResumeFormatterAPI {
  private baseUrl = 'https://api.resumeformatter.io/v1';
  private apiKey = process.env.RESUMEFORMATTER_API_KEY;

  async importResume(userId: string, resumeFormatterId: string) {
    if (!this.apiKey) {
      throw new Error('ResumeFormatter API key not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/resumes/${resumeFormatterId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`ResumeFormatter API error: ${response.statusText}`);
      }

      const resumeData = await response.json();
      
      return {
        name: resumeData.personalInfo?.fullName || '',
        email: resumeData.personalInfo?.email || '',
        phone: resumeData.personalInfo?.phone || '',
        bio: resumeData.summary || '',
        workHistory: resumeData.experience?.map((exp: any) => ({
          company: exp.company,
          position: exp.position,
          startDate: exp.startDate,
          endDate: exp.endDate,
          description: exp.description,
          current: exp.current || false
        })) || [],
        skills: resumeData.skills || [],
        socialLinks: {
          linkedin: resumeData.personalInfo?.linkedin || '',
          website: resumeData.personalInfo?.website || '',
          email: resumeData.personalInfo?.email || ''
        }
      };
    } catch (error) {
      console.error('ResumeFormatter import error:', error);
      throw error;
    }
  }

  async syncResume(userId: string, profileData: any) {
    if (!this.apiKey) {
      throw new Error('ResumeFormatter API key not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          profileData
        })
      });

      if (!response.ok) {
        throw new Error(`ResumeFormatter sync error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('ResumeFormatter sync error:', error);
      throw error;
    }
  }
}

// PrepPair.me API Integration
export class PrepPairAPI {
  private baseUrl = 'https://api.preppair.me/v1';
  private apiKey = process.env.PREPPAIR_API_KEY;

  async getUserProgress(userId: string, preppairUserId: string) {
    if (!this.apiKey) {
      throw new Error('PrepPair API key not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/users/${preppairUserId}/progress`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`PrepPair API error: ${response.statusText}`);
      }

      const progressData = await response.json();
      
      return {
        interviewsSummary: {
          completed: progressData.totalInterviews || 0,
          skillsImproved: progressData.skillsWorkedOn || [],
          averageScore: progressData.averageScore || 0,
          certificatesEarned: progressData.certificates || []
        },
        recentActivity: progressData.recentSessions || []
      };
    } catch (error) {
      console.error('PrepPair progress error:', error);
      throw error;
    }
  }

  async linkAccount(userId: string, preppairToken: string) {
    if (!this.apiKey) {
      throw new Error('PrepPair API key not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/link`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          namedropUserId: userId,
          preppairToken
        })
      });

      if (!response.ok) {
        throw new Error(`PrepPair link error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('PrepPair link error:', error);
      throw error;
    }
  }
}

export const resumeFormatterAPI = new ResumeFormatterAPI();
export const prepPairAPI = new PrepPairAPI();