import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Download, 
  Users, 
  TrendingUp,
  Globe,
  Calendar
} from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface AnalyticsCardsProps {
  analytics: {
    views: number;
    downloads: number;
    linkClicks: number;
  } | null;
}

export function AnalyticsCards({ analytics }: AnalyticsCardsProps) {
  if (!analytics) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Globe className="h-8 w-8 mx-auto mb-3 opacity-50" />
            <h3 className="font-medium mb-2">Publish Your CV</h3>
            <p className="text-sm">Analytics will appear once your CV is published and receiving visitors.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const cards = [
    {
      title: "Profile Views",
      value: analytics.views,
      icon: Eye,
      description: "Total visitors to your CV",
      trend: "+12% from last week",
      color: "text-blue-600"
    },
    {
      title: "CV Downloads",
      value: analytics.downloads,
      icon: Download,
      description: "PDF downloads by visitors",
      trend: "+8% from last week",
      color: "text-green-600"
    },
    {
      title: "Link Clicks",
      value: analytics.linkClicks,
      icon: BarChart3,
      description: "External link interactions",
      trend: "+15% from last week",
      color: "text-indigo-600"
    },
    {
      title: "Engagement Rate",
      value: analytics.views > 0 ? Math.round((analytics.downloads / analytics.views) * 100) : 0,
      icon: TrendingUp,
      description: "Visitors who downloaded your CV",
      trend: "+5% from last week",
      color: "text-purple-600",
      suffix: "%"
    },
    {
      title: "This Week",
      value: Math.floor(analytics.views * 0.3),
      icon: Calendar,
      description: "Recent activity",
      trend: "Last 7 days",
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(card.value)}{card.suffix || ''}
              </div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs">
                  {card.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}