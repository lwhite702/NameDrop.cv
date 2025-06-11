import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";
import { useAuth } from "@/hooks/useAuth";
import { UserCircle, Moon, Sun, Menu, X } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";

export function Header() {
  const [location] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Features", href: "#features" },
    { name: "Templates", href: "#templates" },
    { name: "Blog", href: "/blog" },
    { name: "Pricing", href: "/pricing" },
  ];

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 coral-gradient rounded-lg flex items-center justify-center">
                <UserCircle className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-primary">NameDrop.cv</span>
            </Link>
            
            {!isAuthenticated && (
              <nav className="hidden md:flex space-x-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-primary"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profileImageUrl} />
                      <AvatarFallback>
                        {getInitials(`${user?.firstName || ''} ${user?.lastName || ''}`)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/editor">CV Editor</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  {user?.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <a href="/api/logout" className="w-full">Log out</a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild className="hidden sm:inline-flex">
                  <a href="/api/login">Log In</a>
                </Button>
                <Button asChild>
                  <a href="/api/login">Get Started</a>
                </Button>
              </>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && !isAuthenticated && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <a
                href="/api/login"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Log In
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
