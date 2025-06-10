import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Download, Share2, Copy, Check } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface QRCodeGeneratorProps {
  profile: any;
}

export function QRCodeGenerator({ profile }: QRCodeGeneratorProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState(profile.qrCodeUrl || "");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateQRMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/profiles/me/qr-code");
      return response.json();
    },
    onSuccess: (data) => {
      setQrCodeUrl(data.qrCodeUrl);
      toast({
        title: "QR Code Generated",
        description: "Your profile QR code is ready to share!",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive",
      });
    },
  });

  const profileUrl = `https://${profile.slug}.namedrop.cv`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copied to Clipboard",
        description: "Profile URL has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `${profile.slug}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const shareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.name} - NameDrop.cv`,
          text: `Check out ${profile.name}'s professional profile`,
          url: profileUrl,
        });
      } catch (err) {
        // User cancelled or share failed
        copyToClipboard(profileUrl);
      }
    } else {
      copyToClipboard(profileUrl);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">QR Code & Sharing</h3>
        <p className="text-sm text-muted-foreground">
          Generate a QR code for easy sharing of your profile
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Code Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {qrCodeUrl ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <img 
                    src={qrCodeUrl} 
                    alt="Profile QR Code"
                    className="border rounded-lg shadow-sm"
                    width={200}
                    height={200}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={downloadQRCode}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button 
                    onClick={() => generateQRMutation.mutate()}
                    variant="outline"
                    size="sm"
                    disabled={generateQRMutation.isPending}
                  >
                    Regenerate
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-48 h-48 mx-auto border-2 border-dashed rounded-lg flex items-center justify-center bg-muted">
                  <QrCode className="h-12 w-12 text-muted-foreground" />
                </div>
                <Button 
                  onClick={() => generateQRMutation.mutate()}
                  disabled={generateQRMutation.isPending}
                >
                  {generateQRMutation.isPending ? "Generating..." : "Generate QR Code"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile URL Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Share Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Profile URL</label>
              <div className="flex gap-2">
                <div className="flex-1 p-2 bg-muted rounded border text-sm font-mono">
                  {profileUrl}
                </div>
                <Button
                  onClick={() => copyToClipboard(profileUrl)}
                  variant="outline"
                  size="sm"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Button 
                onClick={shareProfile}
                className="w-full"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Profile
              </Button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>💡 <strong>Pro tip:</strong> Use the QR code on business cards, presentations, or networking events</p>
              <p>🔗 Anyone can visit your profile at this URL once published</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex-col gap-2"
              onClick={() => window.open(profileUrl, '_blank')}
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                👁️
              </div>
              <span className="font-medium">Preview Profile</span>
              <span className="text-xs text-muted-foreground">See how visitors see your profile</span>
            </Button>

            <Button 
              variant="outline" 
              className="h-auto p-4 flex-col gap-2"
              onClick={shareProfile}
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                📤
              </div>
              <span className="font-medium">Share Now</span>
              <span className="text-xs text-muted-foreground">Share via apps or copy link</span>
            </Button>

            <Button 
              variant="outline" 
              className="h-auto p-4 flex-col gap-2"
              onClick={() => {
                if (qrCodeUrl) {
                  downloadQRCode();
                } else {
                  generateQRMutation.mutate();
                }
              }}
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                📱
              </div>
              <span className="font-medium">Get QR Code</span>
              <span className="text-xs text-muted-foreground">Perfect for print materials</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}