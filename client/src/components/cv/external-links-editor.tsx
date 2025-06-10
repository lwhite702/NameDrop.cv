import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, ExternalLink, BarChart3, Eye, EyeOff } from "lucide-react";
import { ExternalLink as ExternalLinkType } from "@shared/schema";

interface ExternalLinksEditorProps {
  profile: any;
  onSave: (profileData: any) => void;
  onChange: () => void;
}

export function ExternalLinksEditor({ profile, onSave, onChange }: ExternalLinksEditorProps) {
  const [links, setLinks] = useState<ExternalLinkType[]>(profile.externalLinks || []);

  const addLink = () => {
    const newLink: ExternalLinkType = {
      id: Date.now().toString(),
      label: "",
      url: "",
      icon: "link",
      clickCount: 0,
      isActive: true,
    };
    const updatedLinks = [...links, newLink];
    setLinks(updatedLinks);
    saveLinks(updatedLinks);
  };

  const updateLink = (index: number, field: keyof ExternalLinkType, value: any) => {
    const updatedLinks = links.map((link, i) => 
      i === index ? { ...link, [field]: value } : link
    );
    setLinks(updatedLinks);
    saveLinks(updatedLinks);
    onChange();
  };

  const removeLink = (index: number) => {
    const updatedLinks = links.filter((_, i) => i !== index);
    setLinks(updatedLinks);
    saveLinks(updatedLinks);
  };

  const saveLinks = (updatedLinks: ExternalLinkType[]) => {
    const updatedProfile = {
      ...profile,
      externalLinks: updatedLinks,
    };
    onSave(updatedProfile);
  };

  const getIconOptions = () => [
    { value: "link", label: "🔗 Link" },
    { value: "website", label: "🌐 Website" },
    { value: "email", label: "📧 Email" },
    { value: "phone", label: "📱 Phone" },
    { value: "instagram", label: "📸 Instagram" },
    { value: "twitter", label: "🐦 Twitter" },
    { value: "linkedin", label: "💼 LinkedIn" },
    { value: "youtube", label: "📺 YouTube" },
    { value: "tiktok", label: "🎵 TikTok" },
    { value: "shop", label: "🛒 Shop" },
    { value: "music", label: "🎵 Music" },
    { value: "calendar", label: "📅 Calendar" },
    { value: "download", label: "⬇️ Download" },
    { value: "portfolio", label: "🎨 Portfolio" },
    { value: "blog", label: "📝 Blog" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Link-in-Bio Tiles</h3>
          <p className="text-sm text-muted-foreground">
            Add external links that visitors can click from your profile
          </p>
        </div>
        <Button onClick={addLink} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Link
        </Button>
      </div>

      <div className="space-y-4">
        {links.map((link, index) => (
          <Card key={link.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  Link {index + 1}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={link.isActive}
                      onCheckedChange={(checked) => updateLink(index, 'isActive', checked)}
                    />
                    <Label className="text-xs text-muted-foreground">
                      {link.isActive ? 'Visible' : 'Hidden'}
                    </Label>
                    {link.isActive ? (
                      <Eye className="h-3 w-3 text-green-600" />
                    ) : (
                      <EyeOff className="h-3 w-3 text-gray-400" />
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLink(index)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {link.clickCount > 0 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <BarChart3 className="h-3 w-3" />
                  {link.clickCount} clicks
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`label-${index}`}>Button Label</Label>
                  <Input
                    id={`label-${index}`}
                    value={link.label}
                    onChange={(e) => updateLink(index, 'label', e.target.value)}
                    placeholder="e.g., My Portfolio, Book a Call, Shop Now"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`url-${index}`}>URL</Label>
                  <Input
                    id={`url-${index}`}
                    value={link.url}
                    onChange={(e) => updateLink(index, 'url', e.target.value)}
                    placeholder="https://example.com"
                    type="url"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Icon</Label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {getIconOptions().map((icon) => (
                    <Button
                      key={icon.value}
                      variant={link.icon === icon.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateLink(index, 'icon', icon.value)}
                      className="text-xs"
                    >
                      {icon.label}
                    </Button>
                  ))}
                </div>
              </div>

              {link.url && (
                <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Preview: {link.label || 'Untitled Link'}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {links.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <ExternalLink className="h-12 w-12 text-muted-foreground mb-4" />
              <h4 className="font-semibold mb-2">No links added yet</h4>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Add external links to create a link-in-bio experience for your visitors
              </p>
              <Button onClick={addLink}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Link
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {links.length > 0 && (
        <div className="text-xs text-muted-foreground">
          💡 Tip: Use compelling call-to-action labels like "Book a Call", "View Portfolio", or "Download Resume" to increase clicks
        </div>
      )}
    </div>
  );
}