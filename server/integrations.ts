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

  async generateDiscountCode(userId: string) {
    // Generate exclusive 50% discount for new NameDrop users
    const discountCode = `NAMEDROP50-${userId.slice(-8).toUpperCase()}`;
    
    if (!this.apiKey) {
      // Return the discount code even without API for frontend display
      return {
        code: discountCode,
        discount: 50,
        durationMonths: 3,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        claimUrl: `https://preppair.me/signup?code=${discountCode}&partner=namedrop`
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/promotions/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: discountCode,
          discountPercent: 50,
          durationMonths: 3,
          partnerId: 'namedrop',
          userId: userId,
          maxUses: 1
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate discount code');
      }

      return response.json();
    } catch (error) {
      // Fallback if API is unavailable
      return {
        code: discountCode,
        discount: 50,
        durationMonths: 3,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        claimUrl: `https://preppair.me/signup?code=${discountCode}&partner=namedrop`
      };
    }
  }
}

export const resumeFormatterAPI = new ResumeFormatterAPI();
export const prepPairAPI = new PrepPairAPI();