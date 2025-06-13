import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TableOfContentsItem } from "@shared/blog-schema";

interface TableOfContentsProps {
  content: string;
  className?: string;
}

export function TableOfContents({ content, className }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TableOfContentsItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Extract headings from HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    const items: TableOfContentsItem[] = [];
    
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      const text = heading.textContent || '';
      const id = `heading-${index}`;
      
      // Add ID to heading for scrolling
      heading.id = id;
      
      items.push({
        id,
        text,
        level,
      });
    });
    
    setTocItems(items);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    tocItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [tocItems]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (tocItems.length === 0) return null;

  return (
    <Card className={cn("sticky top-24", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Table of Contents</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <nav className="space-y-1">
          {tocItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToHeading(item.id)}
              className={cn(
                "block w-full text-left text-sm py-2 px-3 rounded-md transition-colors",
                "hover:bg-muted/50",
                activeId === item.id 
                  ? "bg-primary/10 text-primary font-medium border-l-2 border-primary" 
                  : "text-muted-foreground",
                item.level === 1 && "ml-0",
                item.level === 2 && "ml-3",
                item.level === 3 && "ml-6",
                item.level === 4 && "ml-9",
                item.level >= 5 && "ml-12"
              )}
            >
              {item.text}
            </button>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
}