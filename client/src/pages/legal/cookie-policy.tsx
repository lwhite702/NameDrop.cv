import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <Card>
            <CardContent className="p-8 prose prose-gray dark:prose-invert max-w-none">
              <h2>1. What Are Cookies</h2>
              <p>
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.
              </p>

              <h2>2. How We Use Cookies</h2>
              <p>
                NameDrop.cv uses cookies to enhance your experience on our website, understand how you use our Service, and improve our offerings.
              </p>

              <h2>3. Types of Cookies We Use</h2>

              <h3>Essential Cookies</h3>
              <p>
                These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.
              </p>
              <ul>
                <li><strong>Authentication cookies:</strong> Remember your login status</li>
                <li><strong>Security cookies:</strong> Protect against security threats</li>
                <li><strong>Session cookies:</strong> Maintain your session state</li>
              </ul>

              <h3>Functional Cookies</h3>
              <p>
                These cookies enhance the functionality of our website by storing your preferences and settings.
              </p>
              <ul>
                <li><strong>Theme preferences:</strong> Remember your dark/light mode choice</li>
                <li><strong>Language settings:</strong> Store your language preferences</li>
                <li><strong>Dashboard settings:</strong> Remember your dashboard layout preferences</li>
              </ul>

              <h3>Analytics Cookies</h3>
              <p>
                These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
              </p>
              <ul>
                <li><strong>Usage analytics:</strong> Track page views and user interactions</li>
                <li><strong>Performance monitoring:</strong> Monitor website performance</li>
                <li><strong>Error tracking:</strong> Identify and fix technical issues</li>
              </ul>

              <h3>Marketing Cookies</h3>
              <p>
                These cookies are used to deliver relevant advertisements and track the effectiveness of our marketing campaigns.
              </p>
              <ul>
                <li><strong>Advertising cookies:</strong> Deliver targeted advertisements</li>
                <li><strong>Social media cookies:</strong> Enable social media sharing</li>
                <li><strong>Conversion tracking:</strong> Measure marketing campaign effectiveness</li>
              </ul>

              <h2>4. Third-Party Cookies</h2>
              <p>
                We may use third-party services that set their own cookies. These include:
              </p>

              <h3>Replit Authentication</h3>
              <p>
                When you log in through Replit, Replit may set cookies to manage your authentication session.
              </p>

              <h3>Stripe Payments</h3>
              <p>
                When processing payments, Stripe may set cookies for fraud prevention and payment processing.
              </p>

              <h3>Analytics Services</h3>
              <p>
                We may use analytics services that set cookies to help us understand website usage patterns.
              </p>

              <h2>5. Managing Cookies</h2>

              <h3>Browser Settings</h3>
              <p>
                You can control and manage cookies through your browser settings. Most browsers allow you to:
              </p>
              <ul>
                <li>View what cookies are stored on your device</li>
                <li>Delete cookies</li>
                <li>Block cookies from specific websites</li>
                <li>Block all cookies</li>
                <li>Delete all cookies when you close your browser</li>
              </ul>

              <h3>Browser-Specific Instructions</h3>
              <p>For detailed instructions on managing cookies, please refer to your browser's help documentation:</p>
              <ul>
                <li><strong>Chrome:</strong> Settings &gt; Privacy and security &gt; Cookies and other site data</li>
                <li><strong>Firefox:</strong> Settings &gt; Privacy &amp; Security &gt; Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences &gt; Privacy &gt; Manage Website Data</li>
                <li><strong>Edge:</strong> Settings &gt; Cookies and site permissions &gt; Cookies and site data</li>
              </ul>

              <h3>Impact of Disabling Cookies</h3>
              <p>
                Please note that if you disable cookies, some features of our website may not function properly:
              </p>
              <ul>
                <li>You may need to log in repeatedly</li>
                <li>Your preferences may not be saved</li>
                <li>Some interactive features may not work</li>
                <li>We may not be able to provide personalized experiences</li>
              </ul>

              <h2>6. Cookie Consent</h2>
              <p>
                When you first visit our website, we will ask for your consent to use non-essential cookies. You can withdraw your consent at any time by adjusting your browser settings or contacting us.
              </p>

              <h2>7. Mobile Devices</h2>
              <p>
                On mobile devices, similar technologies to cookies may be used, including:
              </p>
              <ul>
                <li>Local storage</li>
                <li>Session storage</li>
                <li>Application data caches</li>
              </ul>

              <h2>8. Updates to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any significant changes by posting the updated policy on our website.
              </p>

              <h2>9. Your Rights</h2>
              <p>
                Depending on your location, you may have certain rights regarding cookies and similar technologies:
              </p>
              <ul>
                <li>Right to be informed about cookies</li>
                <li>Right to consent to or refuse cookies</li>
                <li>Right to withdraw consent</li>
                <li>Right to access information about cookies</li>
              </ul>

              <h2>10. Contact Us</h2>
              <p>
                If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
              </p>
              <ul>
                <li>Email: privacy@namedrop.cv</li>
                <li>Subject: Cookie Policy Inquiry</li>
              </ul>

              <h2>11. More Information</h2>
              <p>
                For more information about cookies and how they work, you can visit:
              </p>
              <ul>
                <li><a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer">All About Cookies</a></li>
                <li><a href="https://cookiepedia.co.uk" target="_blank" rel="noopener noreferrer">Cookiepedia</a></li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
