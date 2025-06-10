import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { getInitials, formatDate } from "@/lib/utils";
import { 
  Download, 
  ExternalLink, 
  Mail, 
  Phone, 
  MapPin,
  Globe,
  Calendar,
  Building
} from "lucide-react";
import { FaLinkedin, FaGithub, FaTwitter, FaGlobe } from "react-icons/fa";

interface PublicProfile {
  id: number;
  name: string;
  tagline: string;
  bio: string;
  skills: string[];
  workHistory: WorkExperience[];
  projects: Project[];
  socialLinks: SocialLinks;
  theme: string;
  isPublished: boolean;
}

interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  current: boolean;
}

interface Project {
  name: string;
  description: string;
  url?: string;
  technologies: string[];
  startDate: string;
  endDate?: string;
}

interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
  email?: string;
  phone?: string;
  location?: string;
}

export default function Preview() {
  const [, params] = useRoute("/preview/:slug");
  const [isReporting, setIsReporting] = useState(false);
  const { toast } = useToast();
  const slug = params?.slug;

  const { data: profile, isLoading, error } = useQuery<PublicProfile>({
    queryKey: [`/api/preview/${slug}`],
    enabled: !!slug,
    retry: false,
  });

  useEffect(() => {
    if (profile) {
      // Set page title and meta description
      document.title = `${profile.name}${profile.tagline ? ` - ${profile.tagline}` : ''} | NameDrop.cv`;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          profile.bio || `Professional CV of ${profile.name}${profile.tagline ? `, ${profile.tagline}` : ''}`
        );
      }
    }
  }, [profile]);

  const handleDownloadResume = () => {
    // In a real implementation, this would download the user's uploaded resume
    toast({
      title: "Download not available",
      description: "Resume download is only available for Pro users with uploaded resumes.",
    });
  };

  const handleReport = () => {
    setIsReporting(true);
    // In a real implementation, this would open a report modal
    setTimeout(() => {
      setIsReporting(false);
      toast({
        title: "Report submitted",
        description: "Thank you for helping us keep NameDrop.cv safe.",
      });
    }, 1000);
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin':
        return <FaLinkedin className="h-5 w-5" />;
      case 'github':
        return <FaGithub className="h-5 w-5" />;
      case 'twitter':
        return <FaTwitter className="h-5 w-5" />;
      case 'website':
        return <FaGlobe className="h-5 w-5" />;
      default:
        return <Globe className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading CV...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center p-8">
          <h1 className="text-2xl font-bold mb-4">CV Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The CV you're looking for doesn't exist or has been made private.
          </p>
          <Button asChild>
            <a href="/">Visit NameDrop.cv</a>
          </Button>
        </Card>
      </div>
    );
  }

  if (!profile.isPublished) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center p-8">
          <h1 className="text-2xl font-bold mb-4">CV Not Available</h1>
          <p className="text-muted-foreground mb-6">
            This CV is currently private and not accessible to the public.
          </p>
          <Button asChild>
            <a href="/">Visit NameDrop.cv</a>
          </Button>
        </Card>
      </div>
    );
  }

  const themeClasses = {
    classic: "cv-classic bg-white text-gray-900",
    modern: "cv-modern",
    minimal: "cv-minimal bg-white text-gray-900"
  };

  return (
    <div className={`min-h-screen ${themeClasses[profile.theme as keyof typeof themeClasses] || themeClasses.classic}`}>
      {/* Header Actions */}
      <div className="fixed top-4 right-4 z-50 flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-white/90 backdrop-blur-sm"
          onClick={handleDownloadResume}
        >
          <Download className="h-4 w-4 mr-2" />
          Resume
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-white/90 backdrop-blur-sm"
          onClick={handleReport}
          disabled={isReporting}
        >
          {isReporting ? "..." : "Report"}
        </Button>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {profile.theme === 'modern' ? (
          // Modern Theme with Gradient Header
          <div className="coral-gradient rounded-t-2xl p-8 text-white">
            <div className="text-center">
              <Avatar className="w-32 h-32 mx-auto mb-6 border-4 border-white/30">
                <AvatarImage src="" alt={profile.name} />
                <AvatarFallback className="text-2xl bg-white/20 text-white">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-4xl font-bold mb-2">{profile.name}</h1>
              <p className="text-xl mb-6 opacity-90">{profile.tagline}</p>
              
              {/* Contact Info */}
              <div className="flex justify-center space-x-6 mb-6">
                {profile.socialLinks.email && (
                  <a href={`mailto:${profile.socialLinks.email}`} className="hover:opacity-80">
                    <Mail className="h-5 w-5" />
                  </a>
                )}
                {profile.socialLinks.phone && (
                  <a href={`tel:${profile.socialLinks.phone}`} className="hover:opacity-80">
                    <Phone className="h-5 w-5" />
                  </a>
                )}
                {profile.socialLinks.linkedin && (
                  <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                    <FaLinkedin className="h-5 w-5" />
                  </a>
                )}
                {profile.socialLinks.github && (
                  <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                    <FaGithub className="h-5 w-5" />
                  </a>
                )}
                {profile.socialLinks.website && (
                  <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                    <FaGlobe className="h-5 w-5" />
                  </a>
                )}
              </div>
              
              <Button 
                variant="secondary" 
                className="bg-white text-primary hover:bg-gray-100"
                onClick={handleDownloadResume}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Resume
              </Button>
            </div>
          </div>
        ) : (
          // Classic and Minimal Theme Header
          <div className="text-center mb-12">
            <Avatar className="w-32 h-32 mx-auto mb-6 border-4 border-primary/20">
              <AvatarImage src="" alt={profile.name} />
              <AvatarFallback className="text-2xl">
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-4xl font-bold mb-2">{profile.name}</h1>
            <p className="text-xl text-primary font-semibold mb-6">{profile.tagline}</p>
            
            {/* Contact Info */}
            <div className="flex justify-center space-x-6 mb-6">
              {profile.socialLinks.email && (
                <a href={`mailto:${profile.socialLinks.email}`} className="text-muted-foreground hover:text-primary">
                  <Mail className="h-5 w-5" />
                </a>
              )}
              {profile.socialLinks.phone && (
                <a href={`tel:${profile.socialLinks.phone}`} className="text-muted-foreground hover:text-primary">
                  <Phone className="h-5 w-5" />
                </a>
              )}
              {profile.socialLinks.linkedin && (
                <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                  <FaLinkedin className="h-5 w-5" />
                </a>
              )}
              {profile.socialLinks.github && (
                <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                  <FaGithub className="h-5 w-5" />
                </a>
              )}
              {profile.socialLinks.website && (
                <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                  <FaGlobe className="h-5 w-5" />
                </a>
              )}
            </div>
            
            <Button onClick={handleDownloadResume} className="shadow-lg">
              <Download className="h-4 w-4 mr-2" />
              Download Resume
            </Button>
          </div>
        )}

        {/* Content Container */}
        <div className={`${profile.theme === 'modern' ? 'bg-white rounded-b-2xl' : ''} p-8`}>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* About */}
              {profile.bio && (
                <section>
                  <h2 className="text-2xl font-bold mb-4 flex items-center">
                    About
                    {profile.theme === 'minimal' && <div className="w-16 h-0.5 bg-primary ml-4 mt-1"></div>}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
                </section>
              )}

              {/* Skills */}
              {profile.skills && profile.skills.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-4 flex items-center">
                    Skills
                    {profile.theme === 'minimal' && <div className="w-16 h-0.5 bg-primary ml-4 mt-1"></div>}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="bg-primary/10 text-primary hover:bg-primary/20"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </section>
              )}

              {/* Projects */}
              {profile.projects && profile.projects.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-4 flex items-center">
                    Projects
                    {profile.theme === 'minimal' && <div className="w-16 h-0.5 bg-primary ml-4 mt-1"></div>}
                  </h2>
                  <div className="space-y-6">
                    {profile.projects.map((project, index) => (
                      <div key={index} className="border-l-4 border-primary pl-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg">{project.name}</h3>
                          {project.url && (
                            <a 
                              href={project.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm mb-2">{project.description}</p>
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {project.technologies.map((tech, techIndex) => (
                              <Badge key={techIndex} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Work Experience */}
              {profile.workHistory && profile.workHistory.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-4 flex items-center">
                    Experience
                    {profile.theme === 'minimal' && <div className="w-16 h-0.5 bg-primary ml-4 mt-1"></div>}
                  </h2>
                  <div className="space-y-6">
                    {profile.workHistory.map((job, index) => (
                      <div key={index} className="border-l-4 border-accent pl-4">
                        <h3 className="font-semibold text-lg">{job.position}</h3>
                        <div className="flex items-center text-primary font-medium mb-1">
                          <Building className="h-4 w-4 mr-1" />
                          {job.company}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(job.startDate)} - {job.current ? 'Present' : formatDate(job.endDate || '')}
                        </div>
                        <p className="text-muted-foreground text-sm">{job.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Contact Information */}
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  Contact
                  {profile.theme === 'minimal' && <div className="w-16 h-0.5 bg-primary ml-4 mt-1"></div>}
                </h2>
                <div className="space-y-3">
                  {profile.socialLinks.email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-muted-foreground mr-3" />
                      <a 
                        href={`mailto:${profile.socialLinks.email}`}
                        className="text-primary hover:underline"
                      >
                        {profile.socialLinks.email}
                      </a>
                    </div>
                  )}
                  {profile.socialLinks.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-muted-foreground mr-3" />
                      <a 
                        href={`tel:${profile.socialLinks.phone}`}
                        className="text-primary hover:underline"
                      >
                        {profile.socialLinks.phone}
                      </a>
                    </div>
                  )}
                  {profile.socialLinks.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-muted-foreground mr-3" />
                      <span>{profile.socialLinks.location}</span>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-sm text-muted-foreground border-t border-border">
        <p>
          Powered by{' '}
          <a href="/" className="text-primary hover:underline">
            NameDrop.cv
          </a>
        </p>
      </div>
    </div>
  );
}
