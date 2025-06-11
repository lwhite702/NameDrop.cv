import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HelpTooltip } from "@/components/tooltip/help-tooltip";
import { 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Upload,
  Link as LinkIcon,
  Palette,
  Globe,
  Crown,
  FileText,
  Users
} from "lucide-react";

interface OnboardingWizardProps {
  onComplete: (data: any) => void;
  onSkip: () => void;
}

const steps = [
  {
    id: 'welcome',
    title: 'Welcome to NameDrop.cv',
    description: 'Let\'s set up your professional CV website'
  },
  {
    id: 'profile-basics',
    title: 'Basic Information',
    description: 'Tell us about yourself'
  },
  {
    id: 'import-options',
    title: 'Import Your Resume',
    description: 'Get started quickly with existing content'
  },
  {
    id: 'customization',
    title: 'Choose Your Style',
    description: 'Select a template that represents you'
  },
  {
    id: 'domain-setup',
    title: 'Your Professional URL',
    description: 'Set up your subdomain'
  },
  {
    id: 'integrations',
    title: 'Connect Your Accounts',
    description: 'Link your professional profiles'
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'Your CV website is ready to go live'
  }
];

export function OnboardingWizard({ onComplete, onSkip }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    bio: '',
    slug: '',
    theme: 'classic',
    importSource: '',
    socialLinks: {
      linkedin: '',
      github: '',
      website: ''
    }
  });

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    switch (step.id) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 coral-gradient rounded-full mx-auto flex items-center justify-center">
              <FileText className="h-10 w-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome to NameDrop.cv!</h2>
              <p className="text-muted-foreground mb-6">
                Create a stunning, professional CV website in just a few minutes. 
                We'll guide you through each step to get you online quickly.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Import Resume</h3>
                <p className="text-muted-foreground">From ResumeFormatter.io or upload your own</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <Palette className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Choose Template</h3>
                <p className="text-muted-foreground">Professional coral-themed designs</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Go Live</h3>
                <p className="text-muted-foreground">Get your yourname.namedrop.cv URL</p>
              </div>
            </div>
          </div>
        );

      case 'profile-basics':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Tell us about yourself</h2>
              <p className="text-muted-foreground">This information will be displayed on your CV website.</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="flex items-center gap-2">
                  Full Name
                  <HelpTooltip content="Your full professional name as you want it displayed" />
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="tagline" className="flex items-center gap-2">
                  Professional Tagline
                  <HelpTooltip content="A brief description of your role or expertise (e.g., 'Senior Software Engineer')" />
                </Label>
                <Input
                  id="tagline"
                  value={formData.tagline}
                  onChange={(e) => updateFormData('tagline', e.target.value)}
                  placeholder="Senior Software Engineer & Tech Lead"
                />
              </div>
              <div>
                <Label htmlFor="bio" className="flex items-center gap-2">
                  Professional Bio
                  <HelpTooltip content="A short paragraph about your experience and expertise" />
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => updateFormData('bio', e.target.value)}
                  placeholder="Passionate software engineer with 8+ years of experience building scalable web applications..."
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      case 'import-options':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Import your existing resume</h2>
              <p className="text-muted-foreground">Get started quickly by importing from our partner platforms.</p>
            </div>
            <div className="grid gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Import from ResumeFormatter.io</h3>
                      <p className="text-sm text-muted-foreground">Connect your account to sync resume data</p>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Sync with PrepPair.me</h3>
                      <p className="text-sm text-muted-foreground">Show your interview preparation progress</p>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
                      <Upload className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Upload PDF/Word Document</h3>
                      <p className="text-sm text-muted-foreground">We'll extract the information automatically</p>
                    </div>
                    <Button variant="outline">Upload</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="text-center">
              <Button variant="link">Skip for now - I'll add content manually</Button>
            </div>
          </div>
        );

      case 'customization':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Choose your template</h2>
              <p className="text-muted-foreground">Select a design that matches your professional style.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { id: 'classic', name: 'Classic Coral', description: 'Clean and professional', free: true },
                { id: 'modern', name: 'Modern Gradient', description: 'Contemporary design', free: true },
                { id: 'minimal', name: 'Minimal Coral', description: 'Ultra-clean layout', free: true },
                { id: 'executive', name: 'Executive Pro', description: 'Premium executive layout', free: false },
                { id: 'creative', name: 'Creative Pro', description: 'Bold artistic design', free: false },
                { id: 'tech', name: 'Tech Pro', description: 'Modern tech-focused', free: false }
              ].map((template) => (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-all ${
                    formData.theme === template.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
                  }`}
                  onClick={() => updateFormData('theme', template.id)}
                >
                  <CardContent className="p-4">
                    <div className="relative">
                      {!template.free && (
                        <Badge className="absolute top-0 right-0 bg-amber-500">
                          <Crown className="h-3 w-3 mr-1" />
                          Pro
                        </Badge>
                      )}
                      <div className="w-full h-20 bg-gradient-to-r from-primary/20 to-accent/20 rounded mb-3"></div>
                      <h3 className="font-semibold text-sm">{template.name}</h3>
                      <p className="text-xs text-muted-foreground">{template.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'domain-setup':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Choose your professional URL</h2>
              <p className="text-muted-foreground">This will be your personalized CV website address.</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="slug" className="flex items-center gap-2">
                  Your Subdomain
                  <HelpTooltip content="Choose a memorable username for your CV URL" />
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => updateFormData('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="yourname"
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground">.namedrop.cv</span>
                </div>
                {formData.slug && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Your CV will be available at: <strong>{formData.slug}.namedrop.cv</strong>
                  </p>
                )}
              </div>
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Crown className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">Upgrade to Pro for Custom Domains</h4>
                      <p className="text-xs text-muted-foreground">
                        Connect your own domain (e.g., yourname.com) with Pro features
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'integrations':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Connect your professional accounts</h2>
              <p className="text-muted-foreground">Add links to your social and professional profiles.</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="linkedin">LinkedIn Profile</Label>
                <Input
                  id="linkedin"
                  value={formData.socialLinks.linkedin}
                  onChange={(e) => updateFormData('socialLinks', { ...formData.socialLinks, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              <div>
                <Label htmlFor="github">GitHub Profile</Label>
                <Input
                  id="github"
                  value={formData.socialLinks.github}
                  onChange={(e) => updateFormData('socialLinks', { ...formData.socialLinks, github: e.target.value })}
                  placeholder="https://github.com/yourusername"
                />
              </div>
              <div>
                <Label htmlFor="website">Personal Website</Label>
                <Input
                  id="website"
                  value={formData.socialLinks.website}
                  onChange={(e) => updateFormData('socialLinks', { ...formData.socialLinks, website: e.target.value })}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
              <p className="text-muted-foreground mb-6">
                Your professional CV website is ready. You can now share your profile and start making an impression.
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-left">
              <h3 className="font-semibold mb-2">What's next?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Complete your CV with work experience and projects</li>
                <li>• Customize your template and branding</li>
                <li>• Share your profile with potential employers</li>
                <li>• Track analytics to see who's viewing your CV</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Setup Wizard</h1>
            <p className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
          <Button variant="ghost" onClick={onSkip}>
            Skip Setup
          </Button>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <p className="text-muted-foreground">{steps[currentStep].description}</p>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          onClick={handleNext}
          className="flex items-center gap-2"
        >
          {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}