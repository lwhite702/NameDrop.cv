import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Palette } from "lucide-react";

interface ThemeSelectorProps {
  profile: any;
  onSave: (profileData: any) => void;
  onChange: () => void;
}

export function ThemeSelector({ profile, onSave, onChange }: ThemeSelectorProps) {
  const [selectedTheme, setSelectedTheme] = useState(profile?.theme || "classic");

  const themes = [
    {
      id: "classic",
      name: "Classic Coral",
      description: "Clean and professional with coral accents. Perfect for any industry.",
      preview: (
        <div className="border rounded-lg p-4 bg-white">
          <div className="coral-gradient text-white p-3 rounded-t-lg -m-4 mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-full mx-auto mb-2"></div>
            <h4 className="font-semibold text-sm text-center">Sarah Johnson</h4>
            <p className="text-xs text-center opacity-80">Product Designer</p>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-muted rounded w-full"></div>
            <div className="h-2 bg-muted rounded w-3/4"></div>
            <div className="flex gap-1 mt-2">
              <div className="h-4 bg-primary/20 rounded px-2 text-xs">React</div>
              <div className="h-4 bg-primary/20 rounded px-2 text-xs">Design</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "modern",
      name: "Modern Gradient",
      description: "Contemporary design with bold coral gradients for creative professionals.",
      preview: (
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary via-accent to-primary text-white p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg"></div>
              <div>
                <h4 className="font-semibold text-sm">Mike Chen</h4>
                <p className="text-xs opacity-80">Software Engineer</p>
              </div>
            </div>
          </div>
          <div className="p-3 bg-white space-y-2">
            <div className="h-2 bg-muted rounded w-full"></div>
            <div className="h-2 bg-muted rounded w-2/3"></div>
            <div className="flex gap-1 mt-2">
              <div className="h-4 bg-gray-100 rounded px-2 text-xs">JavaScript</div>
              <div className="h-4 bg-gray-100 rounded px-2 text-xs">Node.js</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "minimal",
      name: "Minimal Coral",
      description: "Ultra-clean layout with subtle coral highlights for executive profiles.",
      preview: (
        <div className="border rounded-lg p-4 bg-white">
          <div className="border-l-4 border-primary pl-3">
            <h4 className="font-semibold text-sm mb-1">Emma Davis</h4>
            <p className="text-xs text-primary font-medium">Marketing Director</p>
            <div className="mt-2 space-y-1">
              <div className="w-full h-1 bg-muted rounded"></div>
              <div className="w-3/4 h-1 bg-muted rounded"></div>
              <div className="w-1/2 h-1 bg-primary rounded"></div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
    onChange();
  };

  const handleSave = () => {
    onSave({ ...profile, theme: selectedTheme });
  };

  return (
    <div className="space-y-6 h-full overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Choose Your Theme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Select a theme that best represents your professional style. You can change this anytime.
          </p>
          
          <div className="grid gap-6">
            {themes.map((theme) => (
              <div key={theme.id} className="space-y-4">
                <div
                  className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all hover:border-primary/50 ${
                    selectedTheme === theme.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border'
                  }`}
                  onClick={() => handleThemeSelect(theme.id)}
                >
                  {selectedTheme === theme.id && (
                    <div className="absolute top-3 right-3">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <h3 className="font-semibold">{theme.name}</h3>
                        {selectedTheme === theme.id && (
                          <Badge className="ml-2" variant="default">
                            Selected
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {theme.description}
                      </p>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Features:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {theme.id === 'classic' && (
                            <>
                              <li>• Traditional layout</li>
                              <li>• Professional appearance</li>
                              <li>• Coral accent colors</li>
                              <li>• Great for all industries</li>
                            </>
                          )}
                          {theme.id === 'modern' && (
                            <>
                              <li>• Gradient header design</li>
                              <li>• Bold visual impact</li>
                              <li>• Perfect for creatives</li>
                              <li>• Eye-catching layout</li>
                            </>
                          )}
                          {theme.id === 'minimal' && (
                            <>
                              <li>• Clean, minimal design</li>
                              <li>• Subtle coral accents</li>
                              <li>• Executive-friendly</li>
                              <li>• Focus on content</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <div className="w-48">
                        {theme.preview}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t">
            <Button onClick={handleSave} className="w-full">
              Apply Theme
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
