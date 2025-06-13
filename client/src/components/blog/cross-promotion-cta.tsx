import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, FileText, Users, Sparkles } from "lucide-react";

interface PromotionItem {
  id: string;
  title: string;
  description: string;
  cta: string;
  url: string;
  badge: string;
  icon: React.ReactNode;
  gradient: string;
}

const promotionItems: PromotionItem[] = [
  {
    id: "resumeformatter",
    title: "Professional Resume Formatting",
    description: "Transform your resume with AI-powered formatting and ATS optimization. Get noticed by employers with professionally designed templates.",
    cta: "Format Your Resume",
    url: "https://resumeformatter.io",
    badge: "Premium Service",
    icon: <FileText className="h-6 w-6" />,
    gradient: "from-blue-500 to-indigo-600"
  },
  {
    id: "preppair",
    title: "Master Your Interview Skills",
    description: "Practice with AI-powered mock interviews and get 50% off as a NameDrop.cv user. Build confidence and land your dream job.",
    cta: "Get 50% Off PrepPair",
    url: "https://preppair.me",
    badge: "50% Discount",
    icon: <Users className="h-6 w-6" />,
    gradient: "from-emerald-500 to-teal-600"
  },
  {
    id: "namedrop-pro",
    title: "Upgrade to NameDrop Pro",
    description: "Unlock custom domains, verification badges, AI CV optimization, and advanced analytics. Amplify your professional presence.",
    cta: "Upgrade to Pro",
    url: "/pricing",
    badge: "Pro Features",
    icon: <Sparkles className="h-6 w-6" />,
    gradient: "from-primary to-primary/80"
  }
];

export function CrossPromotionCTA() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promotionItems.length);
    }, 8000); // Rotate every 8 seconds

    return () => clearInterval(interval);
  }, []);

  const currentItem = promotionItems[currentIndex];

  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg bg-gradient-to-r ${currentItem.gradient} text-white`}>
            {currentItem.icon}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {currentItem.badge}
              </Badge>
            </div>
            
            <h3 className="text-lg font-semibold mb-2">
              {currentItem.title}
            </h3>
            
            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
              {currentItem.description}
            </p>
            
            <div className="flex items-center justify-between">
              <Button asChild size="sm" className={`bg-gradient-to-r ${currentItem.gradient}`}>
                <a href={currentItem.url} target={currentItem.url.startsWith('http') ? '_blank' : '_self'}>
                  {currentItem.cta}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
              
              {/* Rotation indicators */}
              <div className="flex gap-1">
                {promotionItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}