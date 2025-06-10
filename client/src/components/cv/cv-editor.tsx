import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  X, 
  Save, 
  User, 
  Briefcase, 
  FolderOpen, 
  Link as LinkIcon,
  Calendar,
  MapPin
} from "lucide-react";
import { WorkExperience, Project, SocialLinks } from "@shared/schema";

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
    socialLinks: profile?.socialLinks || {},
  });

  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    setFormData({
      name: profile?.name || "",
      tagline: profile?.tagline || "",
      bio: profile?.bio || "",
      skills: profile?.skills || [],
      workHistory: profile?.workHistory || [],
      projects: profile?.projects || [],
      socialLinks: profile?.socialLinks || {},
    });
  }, [profile]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    onChange();
  };

  const handleSave = () => {
    onSave(formData);
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      const updatedSkills = [...formData.skills, newSkill.trim()];
      handleChange("skills", updatedSkills);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    const updatedSkills = formData.skills.filter(s => s !== skill);
    handleChange("skills", updatedSkills);
  };

  const addWorkExperience = () => {
    const newJob: WorkExperience = {
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    };
    handleChange("workHistory", [...formData.workHistory, newJob]);
  };

  const updateWorkExperience = (index: number, field: keyof WorkExperience, value: any) => {
    const updated = formData.workHistory.map((job, i) => 
      i === index ? { ...job, [field]: value } : job
    );
    handleChange("workHistory", updated);
  };

  const removeWorkExperience = (index: number) => {
    const updated = formData.workHistory.filter((_, i) => i !== index);
    handleChange("workHistory", updated);
  };

  const addProject = () => {
    const newProject: Project = {
      name: "",
      description: "",
      url: "",
      technologies: [],
      startDate: "",
      endDate: "",
    };
    handleChange("projects", [...formData.projects, newProject]);
  };

  const updateProject = (index: number, field: keyof Project, value: any) => {
    const updated = formData.projects.map((project, i) => 
      i === index ? { ...project, [field]: value } : project
    );
    handleChange("projects", updated);
  };

  const removeProject = (index: number) => {
    const updated = formData.projects.filter((_, i) => i !== index);
    handleChange("projects", updated);
  };

  const updateSocialLink = (field: keyof SocialLinks, value: string) => {
    const updated = { ...formData.socialLinks, [field]: value };
    handleChange("socialLinks", updated);
  };

  return (
    <div className="space-y-6 h-full overflow-y-auto">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <Label htmlFor="tagline">Professional Tagline</Label>
            <Input
              id="tagline"
              value={formData.tagline}
              onChange={(e) => handleChange("tagline", e.target.value)}
              placeholder="e.g., Senior Software Engineer"
            />
          </div>
          
          <div>
            <Label htmlFor="bio">Professional Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              placeholder="Write a brief professional summary..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Skills & Expertise</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill..."
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            />
            <Button onClick={addSkill} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Work Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 mr-2" />
              Work Experience
            </div>
            <Button onClick={addWorkExperience} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.workHistory.map((job, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Experience #{index + 1}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeWorkExperience(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Job Title</Label>
                  <Input
                    value={job.position}
                    onChange={(e) => updateWorkExperience(index, "position", e.target.value)}
                    placeholder="e.g., Senior Developer"
                  />
                </div>
                <div>
                  <Label>Company</Label>
                  <Input
                    value={job.company}
                    onChange={(e) => updateWorkExperience(index, "company", e.target.value)}
                    placeholder="e.g., Acme Corp"
                  />
                </div>
              </div>
              
              <div className="grid sm:grid-cols-3 gap-4">
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
                    value={job.current ? "" : job.endDate}
                    onChange={(e) => updateWorkExperience(index, "endDate", e.target.value)}
                    disabled={job.current}
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={job.current}
                      onChange={(e) => {
                        updateWorkExperience(index, "current", e.target.checked);
                        if (e.target.checked) {
                          updateWorkExperience(index, "endDate", "");
                        }
                      }}
                    />
                    <span className="text-sm">Current position</span>
                  </label>
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
            </div>
          ))}
          
          {formData.workHistory.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Briefcase className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No work experience added yet</p>
              <p className="text-sm">Click "Add Experience" to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <FolderOpen className="h-5 w-5 mr-2" />
              Projects
            </div>
            <Button onClick={addProject} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.projects.map((project, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Project #{index + 1}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProject(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Project Name</Label>
                  <Input
                    value={project.name}
                    onChange={(e) => updateProject(index, "name", e.target.value)}
                    placeholder="e.g., E-commerce Platform"
                  />
                </div>
                <div>
                  <Label>Project URL</Label>
                  <Input
                    value={project.url || ""}
                    onChange={(e) => updateProject(index, "url", e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              
              <div>
                <Label>Description</Label>
                <Textarea
                  value={project.description}
                  onChange={(e) => updateProject(index, "description", e.target.value)}
                  placeholder="Describe what you built and the impact..."
                  rows={3}
                />
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    value={project.startDate}
                    onChange={(e) => updateProject(index, "startDate", e.target.value)}
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={project.endDate || ""}
                    onChange={(e) => updateProject(index, "endDate", e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label>Technologies</Label>
                <Input
                  value={project.technologies.join(", ")}
                  onChange={(e) => updateProject(index, "technologies", e.target.value.split(",").map(t => t.trim()).filter(t => t))}
                  placeholder="React, Node.js, PostgreSQL..."
                />
              </div>
            </div>
          ))}
          
          {formData.projects.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FolderOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No projects added yet</p>
              <p className="text-sm">Click "Add Project" to showcase your work</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <LinkIcon className="h-5 w-5 mr-2" />
            Contact & Social Links
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.socialLinks.email || ""}
                onChange={(e) => updateSocialLink("email", e.target.value)}
                placeholder="your@email.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.socialLinks.phone || ""}
                onChange={(e) => updateSocialLink("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.socialLinks.location || ""}
              onChange={(e) => updateSocialLink("location", e.target.value)}
              placeholder="City, State/Country"
            />
          </div>
          
          <Separator />
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={formData.socialLinks.linkedin || ""}
                onChange={(e) => updateSocialLink("linkedin", e.target.value)}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                value={formData.socialLinks.github || ""}
                onChange={(e) => updateSocialLink("github", e.target.value)}
                placeholder="https://github.com/username"
              />
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                value={formData.socialLinks.twitter || ""}
                onChange={(e) => updateSocialLink("twitter", e.target.value)}
                placeholder="https://twitter.com/username"
              />
            </div>
            <div>
              <Label htmlFor="website">Personal Website</Label>
              <Input
                id="website"
                value={formData.socialLinks.website || ""}
                onChange={(e) => updateSocialLink("website", e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="sticky bottom-0 bg-background border-t pt-4">
        <Button onClick={handleSave} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
