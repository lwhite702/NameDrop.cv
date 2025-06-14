import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { NameDropSlogan } from "@/components/branding/NameDropSlogan";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SOCIAL_ALT, META_DESCRIPTIONS, generatePageMetadata } from "@/lib/metadata";

export default function SloganDemo() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              NameDrop Slogan Component Demo
            </h1>
            <p className="text-xl text-muted-foreground">
              Dynamic brand messaging with rotating slogans and metadata exports
            </p>
          </div>

          {/* Rotating Slogan Examples */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Primary Slogan
                  <Badge variant="secondary">Static</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-primary/5 p-6 rounded-lg text-center">
                  <NameDropSlogan 
                    variant="primary" 
                    className="text-2xl font-bold text-primary"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Displays the primary brand slogan consistently
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Rotating Slogans
                  <Badge variant="default">Dynamic</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-primary/5 p-6 rounded-lg text-center">
                  <NameDropSlogan 
                    variant="rotating" 
                    className="text-2xl font-bold text-primary"
                    animationDuration={2500}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Rotates through all available slogans every 2.5 seconds
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Different Styling Examples */}
          <div className="space-y-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>Styling Variations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-primary/10 to-purple-100 dark:to-purple-900/20 p-6 rounded-lg text-center">
                  <NameDropSlogan 
                    variant="rotating" 
                    className="text-3xl font-extrabold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
                    animationDuration={3000}
                  />
                  <p className="text-sm text-muted-foreground mt-2">Gradient styling with 3s rotation</p>
                </div>

                <div className="bg-muted p-6 rounded-lg text-center border-l-4 border-primary">
                  <NameDropSlogan 
                    variant="rotating" 
                    className="text-xl font-medium text-foreground"
                    animationDuration={4000}
                  />
                  <p className="text-sm text-muted-foreground mt-2">Subtle styling with 4s rotation</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Metadata Information */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Social & SEO Metadata</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Social Alt Text:</h4>
                    <p className="text-sm bg-muted p-3 rounded font-mono">{SOCIAL_ALT}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Available Meta Descriptions:</h4>
                    <div className="space-y-2">
                      {META_DESCRIPTIONS.map((desc, index) => (
                        <p key={index} className="text-sm bg-muted p-3 rounded font-mono">
                          {desc}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Implementation Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Component Features:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Three variants: primary, rotating, random</li>
                      <li>Configurable animation duration</li>
                      <li>Fallback slogan for error states</li>
                      <li>Loading state with skeleton animation</li>
                      <li>Fully typed with TypeScript</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">API Integration:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Real-time data from /api/slogans endpoint</li>
                      <li>JSON file backup at /public/slogans/namedrop_slogans.json</li>
                      <li>Centralized metadata constants in /lib/metadata.ts</li>
                      <li>SEO utility functions for page generation</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Usage Examples:</h4>
                    <div className="bg-muted p-3 rounded font-mono text-xs space-y-2">
                      <div>{'<NameDropSlogan variant="primary" />'}</div>
                      <div>{'<NameDropSlogan variant="rotating" animationDuration={3500} />'}</div>
                      <div>{'<NameDropSlogan variant="random" className="text-2xl font-bold" />'}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}