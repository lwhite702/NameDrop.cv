import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Calendar,
  MapPin,
  Mail,
  Phone,
  Globe,
  Linkedin,
  Github,
  Twitter,
  ExternalLink,
  QrCode
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { WorkExperience, Project, SocialLinks } from "@shared/schema";
import { ExternalLinksEditor } from "./external-links-editor";
import { QRCodeGenerator } from "./qr-code-generator";

interface CVEditorProps {
  profile: any;
  onSave: (profileData: any) => void;
  onChange: () => void;
}

export function CVEditor({ profile, onSave, onChange }: CVEditorProps) {
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    tagline: profile?.tagline || "",
    bio: profile?.bio || "",
    skills: profile?.skills || [],
    workHistory: profile?.workHistory || [],
    projects: profile?.projects || [],
    socialLinks: profile?.socialLinks || {
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      github: "",
      twitter: ""
    }
  });

  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    onChange();
  }, [formData, onChange]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addWorkExperience = () => {
    const newJob: WorkExperience = {
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false
    };
    setFormData(prev => ({
      ...prev,
      workHistory: [...prev.workHistory, newJob]
    }));
  };

  const updateWorkExperience = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      workHistory: prev.workHistory.map((job, i) => 
        i === index ? { ...job, [field]: value } : job
      )
    }));
  };

  const removeWorkExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      workHistory: prev.workHistory.filter((_, i) => i !== index)
    }));
  };

  const addProject = () => {
    const newProject: Project = {
      name: "",
      description: "",
      url: "",
      technologies: [],
      startDate: "",
      endDate: ""
    };
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };

  const updateProject = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === index ? { ...project, [field]: value } : project
      )
    }));
  };

  const removeProject = (index: number) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Tabs defaultValue="basic" className="space-y-6">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="experience">Experience</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="links">Link-in-Bio</TabsTrigger>
        <TabsTrigger value="sharing">QR & Sharing</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-8">
        {/* Basic Information */}
        <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div>
              <Label htmlFor="tagline">Professional Tagline</Label>
              <Input
                id="tagline"
                value={formData.tagline}
                onChange={(e) => handleInputChange("tagline", e.target.value)}
                placeholder="e.g., Senior Software Engineer"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="bio">Professional Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              placeholder="Tell your professional story..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            Contact & Social Links
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.socialLinks.email}
                onChange={(e) => handleSocialLinkChange("email", e.target.value)}
                placeholder="your@email.com"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone
              </Label>
              <Input
                id="phone"
                value={formData.socialLinks.phone}
                onChange={(e) => handleSocialLinkChange("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <Input
                id="location"
                value={formData.socialLinks.location}
                onChange={(e) => handleSocialLinkChange("location", e.target.value)}
                placeholder="City, Country"
              />
            </div>
            <div>
              <Label htmlFor="website" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Website
              </Label>
              <Input
                id="website"
                value={formData.socialLinks.website}
                onChange={(e) => handleSocialLinkChange("website", e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="linkedin" className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Label>
              <Input
                id="linkedin"
                value={formData.socialLinks.linkedin}
                onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
                placeholder="linkedin.com/in/yourprofile"
              />
            </div>
            <div>
              <Label htmlFor="github" className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                GitHub
              </Label>
              <Input
                id="github"
                value={formData.socialLinks.github}
                onChange={(e) => handleSocialLinkChange("github", e.target.value)}
                placeholder="github.com/yourusername"
              />
            </div>
            <div>
              <Label htmlFor="twitter" className="flex items-center gap-2">
                <Twitter className="h-4 w-4" />
                Twitter
              </Label>
              <Input
                id="twitter"
                value={formData.socialLinks.twitter}
                onChange={(e) => handleSocialLinkChange("twitter", e.target.value)}
                placeholder="twitter.com/yourusername"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            Skills & Expertise
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill"
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            />
            <Button onClick={addSkill} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="cursor-pointer group">
                {skill}
                <button
                  onClick={() => removeSkill(index)}
                  className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Work Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            Work Experience
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.workHistory.map((job, index) => (
            <Card key={index} className="border-l-4 border-l-primary/50">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Experience #{index + 1}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeWorkExperience(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>Company</Label>
                    <Input
                      value={job.company}
                      onChange={(e) => updateWorkExperience(index, "company", e.target.value)}
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <Label>Position</Label>
                    <Input
                      value={job.position}
                      onChange={(e) => updateWorkExperience(index, "position", e.target.value)}
                      placeholder="Job title"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="month"
                      value={job.startDate}
                      onChange={(e) => updateWorkExperience(index, "startDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input
                      type="month"
                      value={job.endDate}
                      onChange={(e) => updateWorkExperience(index, "endDate", e.target.value)}
                      disabled={job.current}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      checked={job.current}
                      onCheckedChange={(checked) => updateWorkExperience(index, "current", checked)}
                    />
                    <Label>Current Position</Label>
                  </div>
                </div>
                
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={job.description}
                    onChange={(e) => updateWorkExperience(index, "description", e.target.value)}
                    placeholder="Describe your role and achievements..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Button onClick={addWorkExperience} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Work Experience
          </Button>
        </CardContent>
      </Card>

      {/* Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            Projects & Portfolio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.projects.map((project, index) => (
            <Card key={index} className="border-l-4 border-l-accent/50">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Project #{index + 1}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProject(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>Project Name</Label>
                    <Input
                      value={project.name}
                      onChange={(e) => updateProject(index, "name", e.target.value)}
                      placeholder="Project name"
                    />
                  </div>
                  <div>
                    <Label>Project URL</Label>
                    <Input
                      value={project.url}
                      onChange={(e) => updateProject(index, "url", e.target.value)}
                      placeholder="https://project-url.com"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <Label>Description</Label>
                  <Textarea
                    value={project.description}
                    onChange={(e) => updateProject(index, "description", e.target.value)}
                    placeholder="Describe the project and your role..."
                    rows={3}
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="month"
                      value={project.startDate}
                      onChange={(e) => updateProject(index, "startDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>End Date (Optional)</Label>
                    <Input
                      type="month"
                      value={project.endDate}
                      onChange={(e) => updateProject(index, "endDate", e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Technologies Used</Label>
                  <Input
                    value={project.technologies.join(", ")}
                    onChange={(e) => updateProject(index, "technologies", e.target.value.split(", ").filter(t => t.trim()))}
                    placeholder="React, Node.js, AWS, etc."
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Button onClick={addProject} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end pt-6">
        <Button onClick={handleSave} size="lg" className="px-8">
          Save Changes
        </Button>
      </div>
    </div>
  );
}