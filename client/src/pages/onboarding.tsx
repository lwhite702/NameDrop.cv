import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { generateSlug, isValidSlug } from "@/lib/utils";
import { 
  Upload, 
  FileText, 
  User, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle
} from "lucide-react";

interface ResumeData {
  name: string;
  email: string;
  phone: string;
  summary: string;
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description: string;
    current: boolean;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    graduationDate: string;
  }>;
  skills: string[];
}

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ResumeData | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    tagline: "",
    bio: "",
    skills: [] as string[],
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('resume', file);
      return apiRequest("POST", "/api/upload/resume", formData);
    },
    onSuccess: async (response) => {
      const data = await response.json();
      if (data.parsed) {
        setParsedData(data.parsed);
        setFormData(prev => ({
          ...prev,
          name: data.parsed.name || "",
          bio: data.parsed.summary || "",
          skills: data.parsed.skills || [],
        }));
      }
      toast({
        title: "Resume uploaded successfully",
        description: "We've parsed your resume data. Review and edit as needed.",
      });
      setStep(3);
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createProfileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      return apiRequest("POST", "/api/profiles", profileData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profiles/me"] });
      toast({
        title: "Profile created successfully!",
        description: "Your CV is ready. You can now edit and publish it.",
      });
      setLocation("/editor");
    },
    onError: (error) => {
      toast({
        title: "Failed to create profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const handleUpload = () => {
    if (resumeFile) {
      uploadMutation.mutate(resumeFile);
    }
  };

  const handleSlugChange = (value: string) => {
    const slug = generateSlug(value);
    setFormData(prev => ({ ...prev, slug }));
  };

  const handleSkillAdd = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const handleSkillRemove = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleCreateProfile = () => {
    if (!formData.name || !formData.slug) {
      toast({
        title: "Missing required fields",
        description: "Please fill in your name and choose a URL slug.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidSlug(formData.slug)) {
      toast({
        title: "Invalid URL slug",
        description: "URL slug must be 3-50 characters and contain only letters, numbers, and hyphens.",
        variant: "destructive",
      });
      return;
    }

    createProfileMutation.mutate({
      name: formData.name,
      slug: formData.slug,
      tagline: formData.tagline,
      bio: formData.bio,
      skills: formData.skills,
      workHistory: parsedData?.experience || [],
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= stepNumber 
                      ? 'bg-primary text-white' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {step > stepNumber ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      stepNumber
                    )}
                  </div>
                  {stepNumber < 4 && (
                    <div className={`w-16 h-1 ${
                      step > stepNumber ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <p className="text-sm text-muted-foreground">
                Step {step} of 4: {
                  step === 1 ? 'Choose Your Path' :
                  step === 2 ? 'Upload Resume' :
                  step === 3 ? 'Review & Edit' :
                  'Finalize Profile'
                }
              </p>
            </div>
          </div>

          {/* Step 1: Choose Path */}
          {step === 1 && (
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-center">How would you like to start?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-32 flex flex-col items-center justify-center space-y-2 hover:border-primary"
                    onClick={() => setStep(2)}
                  >
                    <Upload className="h-8 w-8 text-primary" />
                    <span className="font-medium">Upload Resume</span>
                    <span className="text-sm text-muted-foreground">Import from PDF or Word</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-32 flex flex-col items-center justify-center space-y-2 hover:border-primary"
                    onClick={() => setStep(3)}
                  >
                    <User className="h-8 w-8 text-primary" />
                    <span className="font-medium">Start from Scratch</span>
                    <span className="text-sm text-muted-foreground">Build manually</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Upload Resume */}
          {step === 2 && (
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Upload Your Resume</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <div className="space-y-4">
                    <Label htmlFor="resume-upload" className="cursor-pointer">
                      <Input
                        id="resume-upload"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button variant="outline" className="w-full">
                        Choose File
                      </Button>
                    </Label>
                    {resumeFile && (
                      <p className="text-sm text-muted-foreground">
                        Selected: {resumeFile.name}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Supports PDF and Word documents (max 5MB)
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    onClick={handleUpload} 
                    disabled={!resumeFile || uploadMutation.isPending}
                  >
                    {uploadMutation.isPending ? (
                      "Uploading..."
                    ) : (
                      <>
                        Upload & Parse
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Review & Edit */}
          {step === 3 && (
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Review & Edit Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="slug">Your CV URL *</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => handleSlugChange(e.target.value)}
                        placeholder="your-name"
                      />
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        .namedrop.cv
                      </span>
                    </div>
                    {formData.slug && !isValidSlug(formData.slug) && (
                      <p className="text-sm text-destructive mt-1">
                        Must be 3-50 characters, letters, numbers, and hyphens only
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="tagline">Professional Tagline</Label>
                    <Input
                      id="tagline"
                      value={formData.tagline}
                      onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                      placeholder="e.g., Senior Software Engineer"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bio">Bio / Summary</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Write a brief professional summary..."
                      rows={4}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(step === 3 && !parsedData ? 1 : 2)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={() => setStep(4)}>
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Finalize */}
          {step === 4 && (
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Ready to Create Your CV</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Profile Summary</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {formData.name}</p>
                    <p><strong>URL:</strong> {formData.slug}.namedrop.cv</p>
                    {formData.tagline && <p><strong>Tagline:</strong> {formData.tagline}</p>}
                    {formData.skills.length > 0 && (
                      <p><strong>Skills:</strong> {formData.skills.join(", ")}</p>
                    )}
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    You can always edit and customize your CV later in the editor.
                  </p>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(3)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    onClick={handleCreateProfile}
                    disabled={createProfileMutation.isPending}
                  >
                    {createProfileMutation.isPending ? (
                      "Creating..."
                    ) : (
                      "Create My CV"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
