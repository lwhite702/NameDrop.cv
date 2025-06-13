import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Twitter, Linkedin, Link2, Facebook, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocialShareProps {
  title: string;
  excerpt: string;
  url?: string;
}

export function SocialShare({ title, excerpt, url = window.location.href }: SocialShareProps) {
  const { toast } = useToast();

  const shareToTwitter = () => {
    const text = encodeURIComponent(`${title} - ${excerpt}`);
    const shareUrl = encodeURIComponent(url);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`, '_blank');
  };

  const shareToLinkedIn = () => {
    const shareUrl = encodeURIComponent(url);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, '_blank');
  };

  const shareToFacebook = () => {
    const shareUrl = encodeURIComponent(url);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Check out: ${title}`);
    const body = encodeURIComponent(`I thought you might find this interesting:\n\n${title}\n${excerpt}\n\n${url}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "The article link has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy link. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Share This Article</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={shareToTwitter}
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <Twitter className="h-4 w-4" />
            <span className="text-xs">Twitter</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={shareToLinkedIn}
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <Linkedin className="h-4 w-4" />
            <span className="text-xs">LinkedIn</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={shareToFacebook}
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <Facebook className="h-4 w-4" />
            <span className="text-xs">Facebook</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={shareViaEmail}
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <Mail className="h-4 w-4" />
            <span className="text-xs">Email</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={copyLink}
            className="flex flex-col items-center gap-1 h-auto py-2 col-span-2"
          >
            <Link2 className="h-4 w-4" />
            <span className="text-xs">Copy Link</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}