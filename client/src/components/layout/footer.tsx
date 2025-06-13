import { Link } from "wouter";
import { UserCircle, FileText, Users } from "lucide-react";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 coral-gradient rounded-lg flex items-center justify-center">
                <UserCircle className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">NameDrop.cv</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Create stunning professional CV websites with custom subdomains. Your career story, beautifully presented.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="/#features" className="hover:text-coral transition-colors">Features</a></li>
              <li><a href="/#templates" className="hover:text-coral transition-colors">Templates</a></li>
              <li><Link href="/pricing" className="hover:text-coral transition-colors">Pricing</Link></li>
              <li><Link href="/blog" className="hover:text-coral transition-colors">Career Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="/help" className="hover:text-coral transition-colors">Help Center</a></li>
              <li><a href="mailto:support@namedrop.cv" className="hover:text-coral transition-colors">Contact Support</a></li>
              <li><a href="https://status.namedrop.cv" target="_blank" rel="noopener noreferrer" className="hover:text-coral transition-colors">System Status</a></li>
              <li><a href="https://community.namedrop.cv" target="_blank" rel="noopener noreferrer" className="hover:text-coral transition-colors">Community</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/terms" className="hover:text-coral transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-coral transition-colors">Privacy Policy</Link></li>
              <li><Link href="/cookie-policy" className="hover:text-coral transition-colors">Cookie Policy</Link></li>
              <li><a href="/security" className="hover:text-coral transition-colors">Security</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Partner Products</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://resumeformatter.io" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                  <FileText className="h-4 w-4" />
                  ResumeFormatter.io
                </a>
                <p className="text-xs text-gray-500 mt-1">Professional resume templates</p>
              </li>
              <li>
                <a href="https://preppair.me" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors">
                  <Users className="h-4 w-4" />
                  PrepPair.me
                </a>
                <p className="text-xs text-gray-500 mt-1">Interview preparation platform</p>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-400">&copy; 2024 Wrelik Brands LLC. All rights reserved.</p>
              <p className="text-sm text-gray-500">NameDrop.cv is a trademark of Wrelik Brands LLC</p>
            </div>
            <div className="flex space-x-6">
              <a href="https://twitter.com/wrelikbrands" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-coral transition-colors">
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/company/wrelik-brands" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-coral transition-colors">
                <FaLinkedin className="h-5 w-5" />
              </a>
              <a href="https://github.com/wrelik-brands" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-coral transition-colors">
                <FaGithub className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Proudly powering professional careers with innovative CV solutions.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
