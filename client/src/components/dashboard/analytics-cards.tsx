import { Card, CardContent } from "@/components/ui/card";
import { 
  Eye, 
  Download, 
  TrendingUp, 
  Users,
  Calendar,
  Globe
} from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface AnalyticsCardsProps {
  analytics: {
    views: number;
    downloads: number;
  } | null;
}

export function AnalyticsCards({ analytics }: AnalyticsCardsProps) {
  if (!analytics) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-20 mb-2"></div>
                <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                <div className="h-3 bg-muted rounded w-24"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Profile Views",
      value: analytics.views,
      icon: Eye,
      change: "+12%",
      changeType: "positive" as const,
      description: "Total profile visits",
    },
    {
      title: "Resume Downloads",
      value: analytics.downloads,
      icon: Download,
      change: "+8%",
      changeType: "positive" as const,
      description: "Resume file downloads",
    },
    {
      title: "Avg. View Time",
      value: "2m 34s",
      icon: Calendar,
      change: "+5%",
      changeType: "positive" as const,
      description: "Average time on profile",
    },
    {
      title: "Profile Reach",
      value: Math.round(analytics.views * 0.85),
      icon: Globe,
      change: "+15%",
      changeType: "positive" as const,
      description: "Unique visitors",
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-muted-foreground">
                {card.title}
              </h4>
              <card.icon className="h-4 w-4 text-primary" />
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {typeof card.value === 'number' ? formatNumber(card.value) : card.value}
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-medium ${
                  card.changeType === 'positive' 
                    ? 'text-green-600' 
                    : card.changeType === 'negative' 
                    ? 'text-red-600' 
                    : 'text-muted-foreground'
                }`}>
                  {card.change}
                </span>
                <span className="text-xs text-muted-foreground">
                  vs last month
                </span>
              </div>
              
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
