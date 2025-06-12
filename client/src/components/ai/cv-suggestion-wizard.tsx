import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Icons } from "@/components/ui/icons";
import { apiRequest } from "@/lib/queryClient";
import { Wand2, Sparkles, CheckCircle, AlertCircle, Lightbulb, Target, Users, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface CVSuggestion {
  section: string;
  originalContent: string;
  improvedContent: string;
  suggestions: string[];
  reasoning: string;
  impact: "high" | "medium" | "low";
  keywords: string[];
}

interface CVSuggestionResponse {
  suggestions: CVSuggestion[];
  overallScore: number;
  improvementAreas: string[];
  strengthAreas: string[];
}

const sectionTypes = [
  { value: "summary", label: "Professional Summary", icon: Target },
  { value: "experience", label: "Work Experience", icon: Users },
  { value: "skills", label: "Skills & Expertise", icon: Award },
  { value: "projects", label: "Projects", icon: Lightbulb },
  { value: "education", label: "Education", icon: CheckCircle },
];

export function CVSuggestionWizard() {
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [targetRole, setTargetRole] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");
  const [suggestions, setSuggestions] = useState<CVSuggestionResponse | null>(null);

  const generateSuggestions = useMutation({
    mutationFn: async (data: {
      section: string;
      content: string;
      targetRole: string;
      industry: string;
    }) => {
      return await apiRequest("/api/ai/cv-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      setSuggestions(data);
    },
  });

  const handleGenerateSuggestions = () => {
    if (!selectedSection || !content.trim()) return;
    
    generateSuggestions.mutate({
      section: selectedSection,
      content: content.trim(),
      targetRole: targetRole.trim(),
      industry: industry.trim(),
    });
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getSectionIcon = (sectionValue: string) => {
    const section = sectionTypes.find(s => s.value === sectionValue);
    return section?.icon || Target;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Wand2 className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">AI CV Suggestion Wizard</h2>
          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white">
            <Sparkles className="h-3 w-3 mr-1" />
            Pro Feature
          </Badge>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get intelligent suggestions to improve your CV sections with AI-powered optimization tailored to your target role and industry.
        </p>
      </div>

      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            CV Section Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="section">CV Section to Analyze</Label>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a CV section" />
                </SelectTrigger>
                <SelectContent>
                  {sectionTypes.map((section) => {
                    const IconComponent = section.icon;
                    return (
                      <SelectItem key={section.value} value={section.value}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          {section.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetRole">Target Role (Optional)</Label>
              <input
                id="targetRole"
                type="text"
                placeholder="e.g., Senior Software Engineer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry (Optional)</Label>
            <input
              id="industry"
              type="text"
              placeholder="e.g., Technology, Healthcare, Finance"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Current Content</Label>
            <Textarea
              id="content"
              placeholder="Paste your current CV section content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground">
              {content.length}/2000 characters
            </p>
          </div>

          <Button
            onClick={handleGenerateSuggestions}
            disabled={!selectedSection || !content.trim() || generateSuggestions.isPending}
            className="w-full"
            size="lg"
          >
            {generateSuggestions.isPending ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate AI Suggestions
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {suggestions && (
        <div className="space-y-6">
          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Overall Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {suggestions.overallScore}/100
                  </div>
                  <p className="text-sm text-muted-foreground">Content Score</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-green-600">Strengths</h4>
                  <ul className="space-y-1 text-sm">
                    {suggestions.strengthAreas.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-orange-600">Improvement Areas</h4>
                  <ul className="space-y-1 text-sm">
                    {suggestions.improvementAreas.map((area, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertCircle className="h-3 w-3 text-orange-600 mt-0.5 flex-shrink-0" />
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Suggestions */}
          <div className="space-y-4">
            {suggestions.suggestions.map((suggestion, index) => {
              const SectionIcon = getSectionIcon(suggestion.section);
              return (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <SectionIcon className="h-5 w-5" />
                        {sectionTypes.find(s => s.value === suggestion.section)?.label || suggestion.section}
                      </CardTitle>
                      <Badge className={cn("text-xs", getImpactColor(suggestion.impact))}>
                        {suggestion.impact.toUpperCase()} IMPACT
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2 text-gray-600">Original Content</h4>
                        <div className="bg-muted/50 p-3 rounded-md text-sm">
                          {suggestion.originalContent}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-primary">Improved Content</h4>
                        <div className="bg-primary/5 border border-primary/20 p-3 rounded-md text-sm">
                          {suggestion.improvedContent}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">AI Reasoning</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {suggestion.reasoning}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Specific Suggestions</h4>
                      <ul className="space-y-1">
                        {suggestion.suggestions.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start gap-2 text-sm">
                            <Lightbulb className="h-3 w-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {suggestion.keywords.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Recommended Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                          {suggestion.keywords.map((keyword, keywordIndex) => (
                            <Badge key={keywordIndex} variant="secondary" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm">
                        Apply Suggestion
                      </Button>
                      <Button variant="ghost" size="sm">
                        Copy Text
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {generateSuggestions.isError && (
        <Card className="border-destructive">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-destructive mb-2">
              <AlertCircle className="h-5 w-5" />
              <h4 className="font-semibold">Analysis Failed</h4>
            </div>
            <p className="text-sm">
              Unable to generate suggestions. Please check your content and try again.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}