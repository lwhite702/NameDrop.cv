import { Link } from "wouter";
import { UserCircle } from "lucide-react";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
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
              <li><a href="/#examples" className="hover:text-coral transition-colors">Examples</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-coral transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-coral transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-coral transition-colors">Status</a></li>
              <li><a href="#" className="hover:text-coral transition-colors">Community</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/terms" className="hover:text-coral transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-coral transition-colors">Privacy Policy</Link></li>
              <li><Link href="/cookie-policy" className="hover:text-coral transition-colors">Cookie Policy</Link></li>
              <li><a href="#" className="hover:text-coral transition-colors">Security</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">&copy; 2024 NameDrop.cv. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-coral transition-colors">
              <FaTwitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-coral transition-colors">
              <FaLinkedin className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-coral transition-colors">
              <FaGithub className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
