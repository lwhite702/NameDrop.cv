import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getInitials, formatDate } from "@/lib/utils";
import { 
  Download, 
  ExternalLink, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Building,
  Globe
} from "lucide-react";
import { FaLinkedin, FaGithub, FaTwitter, FaGlobe } from "react-icons/fa";

interface CVPreviewProps {
  profile: any;
}

export function CVPreview({ profile }: CVPreviewProps) {
  if (!profile) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">No profile data to preview</p>
      </div>
    );
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin':
        return <FaLinkedin className="h-4 w-4" />;
      case 'github':
        return <FaGithub className="h-4 w-4" />;
      case 'twitter':
        return <FaTwitter className="h-4 w-4" />;
      case 'website':
        return <FaGlobe className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const themeClasses = {
    classic: "bg-white",
    modern: "",
    minimal: "bg-white"
  };

  return (
    <div className={`h-full overflow-y-auto ${themeClasses[profile.theme as keyof typeof themeClasses] || themeClasses.classic}`}>
      {profile.theme === 'modern' ? (
        // Modern Theme with Gradient Header
        <div className="coral-gradient p-6 text-white">
          <div className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white/30">
              <AvatarImage src="" alt={profile.name} />
              <AvatarFallback className="text-lg bg-white/20 text-white">
                {getInitials(profile.name || "?")}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold mb-1">{profile.name || "Your Name"}</h1>
            <p className="text-lg mb-4 opacity-90">{profile.tagline || "Your Professional Title"}</p>
            
            {/* Contact Icons */}
            <div className="flex justify-center space-x-4 mb-4">
              {profile.socialLinks?.email && (
                <Mail className="h-4 w-4 opacity-80" />
              )}
              {profile.socialLinks?.phone && (
                <Phone className="h-4 w-4 opacity-80" />
              )}
              {profile.socialLinks?.linkedin && (
                <FaLinkedin className="h-4 w-4 opacity-80" />
              )}
              {profile.socialLinks?.github && (
                <FaGithub className="h-4 w-4 opacity-80" />
              )}
              {profile.socialLinks?.website && (
                <FaGlobe className="h-4 w-4 opacity-80" />
              )}
            </div>
            
            <Button variant="secondary" size="sm" className="bg-white text-primary hover:bg-gray-100">
              <Download className="h-3 w-3 mr-1" />
              Resume
            </Button>
          </div>
        </div>
      ) : (
        // Classic and Minimal Theme Header
        <div className="text-center p-6 border-b">
          <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary/20">
            <AvatarImage src="" alt={profile.name} />
            <AvatarFallback className="text-lg">
              {getInitials(profile.name || "?")}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold mb-1">{profile.name || "Your Name"}</h1>
          <p className="text-lg text-primary font-semibold mb-4">{profile.tagline || "Your Professional Title"}</p>
          
          {/* Contact Icons */}
          <div className="flex justify-center space-x-4 mb-4">
            {profile.socialLinks?.email && (
              <Mail className="h-4 w-4 text-muted-foreground" />
            )}
            {profile.socialLinks?.phone && (
              <Phone className="h-4 w-4 text-muted-foreground" />
            )}
            {profile.socialLinks?.linkedin && (
              <FaLinkedin className="h-4 w-4 text-muted-foreground" />
            )}
            {profile.socialLinks?.github && (
              <FaGithub className="h-4 w-4 text-muted-foreground" />
            )}
            {profile.socialLinks?.website && (
              <FaGlobe className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          
          <Button size="sm">
            <Download className="h-3 w-3 mr-1" />
            Resume
          </Button>
        </div>
      )}

      {/* Content Container */}
      <div className={`${profile.theme === 'modern' ? 'bg-white' : ''} p-6`}>
        <div className="grid gap-6">
          {/* About Section */}
          {profile.bio && (
            <section>
              <h2 className="text-lg font-bold mb-3 flex items-center">
                About
                {profile.theme === 'minimal' && <div className="w-12 h-0.5 bg-primary ml-3 mt-0.5"></div>}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{profile.bio}</p>
            </section>
          )}

          {/* Skills Section */}
          {profile.skills && profile.skills.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-3 flex items-center">
                Skills
                {profile.theme === 'minimal' && <div className="w-12 h-0.5 bg-primary ml-3 mt-0.5"></div>}
              </h2>
              <div className="flex flex-wrap gap-1">
                {profile.skills.map((skill: string, index: number) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-xs bg-primary/10 text-primary"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* Work Experience */}
          {profile.workHistory && profile.workHistory.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-3 flex items-center">
                Experience
                {profile.theme === 'minimal' && <div className="w-12 h-0.5 bg-primary ml-3 mt-0.5"></div>}
              </h2>
              <div className="space-y-4">
                {profile.workHistory.map((job: any, index: number) => (
                  <div key={index} className="border-l-4 border-primary pl-3">
                    <h3 className="font-semibold text-sm">{job.position || "Position"}</h3>
                    <div className="flex items-center text-primary font-medium text-xs mb-1">
                      <Building className="h-3 w-3 mr-1" />
                      {job.company || "Company"}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground mb-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      {job.startDate ? formatDate(job.startDate) : "Start"} - {job.current ? 'Present' : (job.endDate ? formatDate(job.endDate) : "End")}
                    </div>
                    {job.description && (
                      <p className="text-muted-foreground text-xs">{job.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {profile.projects && profile.projects.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-3 flex items-center">
                Projects
                {profile.theme === 'minimal' && <div className="w-12 h-0.5 bg-primary ml-3 mt-0.5"></div>}
              </h2>
              <div className="space-y-4">
                {profile.projects.map((project: any, index: number) => (
                  <div key={index} className="border-l-4 border-accent pl-3">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-sm">{project.name || "Project Name"}</h3>
                      {project.url && (
                        <ExternalLink className="h-3 w-3 text-primary" />
                      )}
                    </div>
                    {project.description && (
                      <p className="text-muted-foreground text-xs mb-1">{project.description}</p>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech: string, techIndex: number) => (
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

          {/* Contact Information */}
          <section>
            <h2 className="text-lg font-bold mb-3 flex items-center">
              Contact
              {profile.theme === 'minimal' && <div className="w-12 h-0.5 bg-primary ml-3 mt-0.5"></div>}
            </h2>
            <div className="space-y-2">
              {profile.socialLinks?.email && (
                <div className="flex items-center text-xs">
                  <Mail className="h-3 w-3 text-muted-foreground mr-2" />
                  <span className="text-primary">{profile.socialLinks.email}</span>
                </div>
              )}
              {profile.socialLinks?.phone && (
                <div className="flex items-center text-xs">
                  <Phone className="h-3 w-3 text-muted-foreground mr-2" />
                  <span className="text-primary">{profile.socialLinks.phone}</span>
                </div>
              )}
              {profile.socialLinks?.location && (
                <div className="flex items-center text-xs">
                  <MapPin className="h-3 w-3 text-muted-foreground mr-2" />
                  <span>{profile.socialLinks.location}</span>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-xs text-muted-foreground border-t">
        <p>Powered by NameDrop.cv</p>
      </div>
    </div>
  );
}
