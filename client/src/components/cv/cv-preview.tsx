import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Linkedin, 
  Github, 
  Twitter,
  ExternalLink,
  Calendar,
  Building,
  Download,
  BarChart3
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { ExternalLink as ExternalLinkType } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface CVPreviewProps {
  profile: any;
}

export function CVPreview({ profile }: CVPreviewProps) {
  const handleLinkClick = async (link: ExternalLinkType) => {
    if (profile.id) {
      try {
        await apiRequest("POST", `/api/click/${profile.id}/${link.id}`, {
          url: link.url
        });
      } catch (error) {
        console.error("Failed to track link click:", error);
      }
    }
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadResume = async () => {
    if (profile.id) {
      try {
        await apiRequest("POST", `/api/profiles/${profile.id}/download`);
      } catch (error) {
        console.error("Failed to track download:", error);
      }
    }
  };

  const getIconForLink = (iconType: string) => {
    const iconMap: { [key: string]: string } = {
      link: "🔗",
      website: "🌐",
      email: "📧",
      phone: "📱",
      instagram: "📸",
      twitter: "🐦",
      linkedin: "💼",
      youtube: "📺",
      tiktok: "🎵",
      shop: "🛒",
      music: "🎵",
      calendar: "📅",
      download: "⬇️",
      portfolio: "🎨",
      blog: "📝",
    };
    return iconMap[iconType] || "🔗";
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-96 text-muted-foreground">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4"></div>
          <p>Start editing to see your CV preview</p>
        </div>
      </div>
    );
  }

  const socialLinks = profile.socialLinks || {};
  
  return (
    <div className="max-w-4xl mx-auto">
      <Card className={`overflow-hidden shadow-lg ${getThemeClass(profile.theme)}`}>
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-primary to-accent text-white p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Image Placeholder */}
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-white">
                {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
              </span>
            </div>
            
            {/* Basic Info */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {profile.name || 'Your Name'}
              </h1>
              <p className="text-xl text-white/90 mb-4">
                {profile.tagline || 'Your Professional Tagline'}
              </p>
              
              {/* Contact Info */}
              <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
                {socialLinks.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span>{socialLinks.email}</span>
                  </div>
                )}
                {socialLinks.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>{socialLinks.phone}</span>
                  </div>
                )}
                {socialLinks.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{socialLinks.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-8 space-y-8">
          {/* Bio Section */}
          {profile.bio && (
            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">About</h2>
              <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
            </section>
          )}

          {/* Skills Section */}
          {profile.skills && profile.skills.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">Skills & Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* Work Experience Section */}
          {profile.workHistory && profile.workHistory.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 text-primary">Work Experience</h2>
              <div className="space-y-6">
                {profile.workHistory.map((job: any, index: number) => (
                  <Card key={index} className="border-l-4 border-l-primary/50">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                        <div>
                          <h3 className="text-xl font-semibold">{job.position || 'Position'}</h3>
                          <div className="flex items-center gap-2 text-primary font-medium">
                            <Building className="h-4 w-4" />
                            {job.company || 'Company'}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm mt-2 md:mt-0">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {job.startDate ? formatDate(job.startDate) : 'Start Date'} - {' '}
                            {job.current ? 'Present' : (job.endDate ? formatDate(job.endDate) : 'End Date')}
                          </span>
                        </div>
                      </div>
                      {job.description && (
                        <p className="text-muted-foreground leading-relaxed">{job.description}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Projects Section */}
          {profile.projects && profile.projects.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 text-primary">Projects & Portfolio</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {profile.projects.map((project: any, index: number) => (
                  <Card key={index} className="border-l-4 border-l-accent/50">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold">{project.name || 'Project Name'}</h3>
                        {project.url && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={project.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                      
                      {project.description && (
                        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                          {project.description}
                        </p>
                      )}
                      
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {project.technologies.map((tech: string, techIndex: number) => (
                              <Badge key={techIndex} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {(project.startDate || project.endDate) && (
                        <div className="flex items-center gap-2 text-muted-foreground text-xs">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {project.startDate ? formatDate(project.startDate) : 'Start'} - {' '}
                            {project.endDate ? formatDate(project.endDate) : 'Ongoing'}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* External Links Section (Link-in-Bio) */}
          {profile.externalLinks && profile.externalLinks.filter((link: ExternalLinkType) => link.isActive && link.label && link.url).length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">Quick Links</h2>
              <div className="space-y-3">
                {profile.externalLinks
                  .filter((link: ExternalLinkType) => link.isActive && link.label && link.url)
                  .map((link: ExternalLinkType) => (
                    <Button
                      key={link.id}
                      onClick={() => handleLinkClick(link)}
                      className="w-full h-auto p-4 justify-start"
                      variant="outline"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <span className="text-lg">{getIconForLink(link.icon || 'link')}</span>
                        <div className="flex-1 text-left">
                          <div className="font-medium">{link.label}</div>
                          <div className="text-sm text-muted-foreground truncate">
                            {link.url.replace(/^https?:\/\//, '')}
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </Button>
                  ))}
              </div>
            </section>
          )}

          {/* Resume Download */}
          {profile.resumeUrl && (
            <section>
              <Button 
                onClick={handleDownloadResume}
                className="w-full"
                size="lg"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Resume
              </Button>
            </section>
          )}

          {/* Social Links Section */}
          {hasValidSocialLinks(socialLinks) && (
            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">Connect</h2>
              <div className="flex flex-wrap gap-4">
                {socialLinks.website && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={socialLinks.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-2" />
                      Website
                    </a>
                  </Button>
                )}
                {socialLinks.linkedin && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`https://${socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                )}
                {socialLinks.github && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`https://${socialLinks.github}`} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                )}
                {socialLinks.twitter && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`https://${socialLinks.twitter}`} target="_blank" rel="noopener noreferrer">
                      <Twitter className="h-4 w-4 mr-2" />
                      Twitter
                    </a>
                  </Button>
                )}
                {socialLinks.email && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`mailto:${socialLinks.email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </a>
                  </Button>
                )}
                {socialLinks.phone && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`tel:${socialLinks.phone}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </a>
                  </Button>
                )}
              </div>
            </section>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function getThemeClass(theme: string) {
  switch (theme) {
    case 'modern':
      return 'theme-modern';
    case 'minimal':
      return 'theme-minimal';
    case 'classic':
    default:
      return 'theme-classic';
  }
}

function hasValidSocialLinks(socialLinks: any) {
  return socialLinks.website || socialLinks.linkedin || socialLinks.github || socialLinks.twitter;
}