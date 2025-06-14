import { useState, useEffect } from "react";

interface SloganData {
  primary: string;
  alternate: string[];
}

interface NameDropSloganProps {
  variant?: "primary" | "rotating" | "random";
  className?: string;
  animationDuration?: number;
}

export function NameDropSlogan({ 
  variant = "rotating", 
  className = "",
  animationDuration = 4000 
}: NameDropSloganProps) {
  const [slogans, setSlogans] = useState<SloganData | null>(null);
  const [currentSlogan, setCurrentSlogan] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSlogans = async () => {
      try {
        const response = await fetch("/slogans/namedrop_slogans.json");
        const data: SloganData = await response.json();
        setSlogans(data);
        
        // Set initial slogan based on variant
        if (variant === "primary") {
          setCurrentSlogan(data.primary);
        } else {
          const allSlogans = [data.primary, ...data.alternate];
          setCurrentSlogan(allSlogans[Math.floor(Math.random() * allSlogans.length)]);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load slogans:", error);
        setCurrentSlogan("Drop your name. Own your narrative.");
        setIsLoading(false);
      }
    };

    loadSlogans();
  }, [variant]);

  useEffect(() => {
    if (!slogans || variant === "primary" || variant === "random") return;

    const interval = setInterval(() => {
      const allSlogans = [slogans.primary, ...slogans.alternate];
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * allSlogans.length);
      } while (allSlogans[nextIndex] === currentSlogan && allSlogans.length > 1);
      
      setCurrentSlogan(allSlogans[nextIndex]);
    }, animationDuration);

    return () => clearInterval(interval);
  }, [slogans, currentSlogan, variant, animationDuration]);

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className={`transition-opacity duration-500 ${className}`}>
      <span className="font-medium text-foreground/80">
        {currentSlogan}
      </span>
    </div>
  );
}

// Social and SEO metadata exports
export const SOCIAL_ALT = "NameDrop.cv is the simplest way to share your story, work, and credentials — all in one link.";

export const META_DESCRIPTIONS = [
  "Create your own verified personal CV page with custom links and domains.",
  "Stand out online with a modern, professional bio link — built for your career."
];

// Utility function to get a random meta description
export const getRandomMetaDescription = () => {
  return META_DESCRIPTIONS[Math.floor(Math.random() * META_DESCRIPTIONS.length)];
};

// Utility function to get all slogans for SEO content
export const getSloganText = async (): Promise<string> => {
  try {
    const response = await fetch("/slogans/namedrop_slogans.json");
    const data: SloganData = await response.json();
    return data.primary;
  } catch (error) {
    return "Drop your name. Own your narrative.";
  }
};

export default NameDropSlogan;