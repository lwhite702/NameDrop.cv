import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Linkedin, Github, ExternalLink, Eye } from "lucide-react";

export function CVPreview() {
  return (
    <div className="bg-white dark:bg-gray-900 w-full relative overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8 border-b">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            AS
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Alex Smith</h1>
            <p className="text-xl text-primary font-semibold mb-3">Senior Software Engineer & Tech Lead</p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
              Passionate full-stack developer with 8+ years of experience building scalable web applications, 
              leading engineering teams, and driving digital transformation initiatives.
            </p>
          </div>
        </div>
        
        {/* Contact Info */}
        <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-primary/20">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Mail className="h-4 w-4 text-primary" />
            <span className="text-sm">alex.smith@email.com</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Phone className="h-4 w-4 text-primary" />
            <span className="text-sm">+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm">San Francisco, CA</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Linkedin className="h-4 w-4 text-primary" />
            <span className="text-sm">linkedin.com/in/alexsmith</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Github className="h-4 w-4 text-primary" />
            <span className="text-sm">github.com/alexsmith</span>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8 relative">
        {/* Skills Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <div className="w-1 h-6 bg-primary rounded-full mr-3"></div>
            Technical Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200">JavaScript</Badge>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200">React</Badge>
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 hover:bg-purple-200">TypeScript</Badge>
            <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 hover:bg-orange-200">Node.js</Badge>
            <Badge className="bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200 hover:bg-pink-200">PostgreSQL</Badge>
            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 hover:bg-yellow-200">AWS</Badge>
            <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 hover:bg-indigo-200">Docker</Badge>
            <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-red-200">Redis</Badge>
          </div>
        </div>

        {/* Experience Section - Partial */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <div className="w-1 h-6 bg-primary rounded-full mr-3"></div>
            Professional Experience
          </h2>
          <div className="space-y-6">
            <Card className="p-6 border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Senior Software Engineer</h3>
                <span className="text-primary font-semibold">2021 - Present</span>
              </div>
              <p className="text-lg text-primary font-medium mb-3">TechCorp Inc. • San Francisco, CA</p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Led development of microservices architecture serving 1M+ users with 99.9% uptime</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Mentored team of 5 junior developers and established code review best practices</span>
                </li>
              </ul>
            </Card>

            {/* Second job card with partial opacity to show fade effect */}
            <Card className="p-6 border-l-4 border-l-gray-300 shadow-sm hover:shadow-md transition-shadow opacity-70">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Software Engineer</h3>
                <span className="text-gray-500 font-semibold">2019 - 2021</span>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 font-medium mb-3">StartupXYZ • Remote</p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Built responsive web applications using React, Express, and MongoDB</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      {/* Fade Overlay and CTA */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-gray-900 dark:via-gray-900/95 h-32 flex items-end justify-center pb-6">
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/95 hover:to-primary/85 shadow-lg backdrop-blur-sm"
          asChild
        >
          <a href="/preview/alexsmith" target="_blank" rel="noopener noreferrer">
            <Eye className="mr-2 h-4 w-4" />
            View Full Demo Profile
          </a>
        </Button>
      </div>
    </div>
  );
}