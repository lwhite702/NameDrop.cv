import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface ThemeSelectorProps {
  profile: any;
  onSave: (profileData: any) => void;
  onChange: () => void;
}

const themes = [
  {
    id: 'classic',
    name: 'Classic Coral',
    description: 'Clean and professional with coral accents',
    preview: (
      <div className="p-4 border border-border rounded-lg bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="bg-white p-3 rounded shadow-sm">
          <div className="w-8 h-8 bg-primary/20 rounded-full mb-2"></div>
          <div className="h-3 bg-primary/60 rounded mb-1 w-24"></div>
          <div className="h-2 bg-muted rounded w-16"></div>
        </div>
      </div>
    )
  },
  {
    id: 'modern',
    name: 'Modern Gradient',
    description: 'Contemporary design with bold coral gradients',
    preview: (
      <div className="p-4 border border-border rounded-lg bg-gradient-to-br from-primary via-accent to-primary/80">
        <div className="bg-white/90 p-3 rounded shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-primary/30 rounded"></div>
            <div className="h-3 bg-primary/70 rounded w-20"></div>
          </div>
          <div className="h-2 bg-muted rounded w-14"></div>
        </div>
      </div>
    )
  },
  {
    id: 'minimal',
    name: 'Minimal Coral',
    description: 'Ultra-clean layout with subtle coral highlights',
    preview: (
      <div className="p-4 border border-border rounded-lg bg-white border-l-4 border-l-primary">
        <div className="space-y-2">
          <div className="h-3 bg-gray-900 rounded w-20"></div>
          <div className="h-2 bg-primary rounded w-16"></div>
          <div className="space-y-1">
            <div className="h-1 bg-muted rounded w-full"></div>
            <div className="h-1 bg-muted rounded w-3/4"></div>
            <div className="h-1 bg-primary/50 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }
];

export function ThemeSelector({ profile, onSave, onChange }: ThemeSelectorProps) {
  const currentTheme = profile?.theme || 'classic';

  const handleThemeSelect = (themeId: string) => {
    const updatedProfile = {
      ...profile,
      theme: themeId
    };
    onSave(updatedProfile);
    onChange();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Choose Your Theme</h2>
        <p className="text-muted-foreground">
          Select a professional template that matches your style and industry.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {themes.map((theme) => (
          <Card 
            key={theme.id} 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              currentTheme === theme.id 
                ? 'ring-2 ring-primary shadow-lg' 
                : 'hover:shadow-md'
            }`}
            onClick={() => handleThemeSelect(theme.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{theme.name}</CardTitle>
                {currentTheme === theme.id && (
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{theme.description}</p>
            </CardHeader>
            
            <CardContent className="pt-0">
              {theme.preview}
              
              <div className="mt-4">
                <Button 
                  variant={currentTheme === theme.id ? "default" : "outline"}
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleThemeSelect(theme.id);
                  }}
                >
                  {currentTheme === theme.id ? 'Selected' : 'Select Theme'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Theme Features */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">All Themes Include:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Mobile-responsive design</li>
                <li>• Professional typography</li>
                <li>• Optimized for readability</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Customization:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Color scheme variations</li>
                <li>• Section ordering</li>
                <li>• Content visibility controls</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Export Options:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• PDF generation</li>
                <li>• Share via link</li>
                <li>• Print-friendly layout</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}