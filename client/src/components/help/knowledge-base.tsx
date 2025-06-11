import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Search, 
  BookOpen, 
  HelpCircle, 
  MessageCircle, 
  ExternalLink,
  Video,
  FileText,
  Lightbulb,
  Users,
  Zap,
  Crown
} from "lucide-react";

interface KnowledgeBaseProps {
  onClose?: () => void;
}

const knowledgeCategories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: <Lightbulb className="h-5 w-5" />,
    articles: [
      {
        title: 'Creating Your First CV',
        content: 'Learn how to set up your professional CV profile on NameDrop.cv with step-by-step guidance.',
        tags: ['beginner', 'setup'],
        type: 'guide'
      },
      {
        title: 'Import from ResumeFormatter.io',
        content: 'Seamlessly import your existing resume from ResumeFormatter.io to get started quickly.',
        tags: ['import', 'integration'],
        type: 'tutorial'
      },
      {
        title: 'Setting Up Your Subdomain',
        content: 'Choose and configure your personalized subdomain (yourname.namedrop.cv) for professional sharing.',
        tags: ['domain', 'setup'],
        type: 'guide'
      }
    ]
  },
  {
    id: 'features',
    title: 'Features & Tools',
    icon: <Zap className="h-5 w-5" />,
    articles: [
      {
        title: 'Template Selection Guide',
        content: 'Explore our coral-themed templates and choose the perfect design for your industry.',
        tags: ['templates', 'design'],
        type: 'guide'
      },
      {
        title: 'Link-in-Bio Setup',
        content: 'Add external links, social media, and professional connections to your CV profile.',
        tags: ['links', 'social'],
        type: 'tutorial'
      },
      {
        title: 'QR Code Generation',
        content: 'Create QR codes for easy sharing of your CV at networking events and interviews.',
        tags: ['qr-code', 'sharing'],
        type: 'feature'
      },
      {
        title: 'Analytics Dashboard',
        content: 'Track views, downloads, and engagement with your professional profile.',
        tags: ['analytics', 'pro'],
        type: 'feature'
      }
    ]
  },
  {
    id: 'pro-features',
    title: 'Pro Features',
    icon: <Crown className="h-5 w-5" />,
    articles: [
      {
        title: 'Custom Domain Setup',
        content: 'Connect your own domain (e.g., yourname.com) to your NameDrop.cv profile.',
        tags: ['domain', 'pro', 'dns'],
        type: 'guide'
      },
      {
        title: 'Premium Templates',
        content: 'Access exclusive Executive, Creative, and Tech Pro templates for advanced customization.',
        tags: ['templates', 'pro', 'premium'],
        type: 'feature'
      },
      {
        title: 'PDF Export & Download',
        content: 'Generate professional PDF versions of your CV for offline sharing and applications.',
        tags: ['pdf', 'export', 'pro'],
        type: 'feature'
      }
    ]
  }
];

export function KnowledgeBase({ onClose }: KnowledgeBaseProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('getting-started');

  const filteredArticles = knowledgeCategories
    .find(cat => cat.id === selectedCategory)
    ?.articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            Knowledge Base
          </h1>
          <p className="text-muted-foreground mt-2">
            Everything you need to know about NameDrop.cv
          </p>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search articles, guides, and tutorials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {knowledgeCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-muted transition-colors ${
                      selectedCategory === category.id ? 'bg-primary/10 text-primary border-r-2 border-primary' : ''
                    }`}
                  >
                    {category.icon}
                    <span className="font-medium">{category.title}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {knowledgeCategories.find(cat => cat.id === selectedCategory)?.icon}
                {knowledgeCategories.find(cat => cat.id === selectedCategory)?.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-4">
                {filteredArticles.map((article, index) => (
                  <AccordionItem key={index} value={`article-${index}`}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center justify-between w-full mr-4">
                        <span className="font-medium">{article.title}</span>
                        <Badge variant="secondary" className="text-xs">
                          {article.type}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <p className="text-muted-foreground">{article.content}</p>
                        <div className="flex flex-wrap gap-1">
                          {article.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Powered by Wrelik Brands LLC
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold">ResumeFormatter.io</h4>
                <p className="text-sm text-muted-foreground">Professional resume formatting and templates</p>
                <Button variant="link" className="h-auto p-0 text-blue-600" asChild>
                  <a href="https://resumeformatter.io" target="_blank" rel="noopener noreferrer">
                    Visit ResumeFormatter.io →
                  </a>
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold">PrepPair.me</h4>
                <p className="text-sm text-muted-foreground">Interview preparation and practice sessions</p>
                <Button variant="link" className="h-auto p-0 text-green-600" asChild>
                  <a href="https://preppair.me" target="_blank" rel="noopener noreferrer">
                    Visit PrepPair.me →
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}