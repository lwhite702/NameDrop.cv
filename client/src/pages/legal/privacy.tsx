import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <Card>
            <CardContent className="p-8 prose prose-gray dark:prose-invert max-w-none">
              <h2>1. Information We Collect</h2>
              
              <h3>Personal Information</h3>
              <p>
                When you create an account, we collect personal information such as your name, email address, and profile picture from your Replit account.
              </p>

              <h3>Profile Content</h3>
              <p>
                We collect the information you provide when creating your CV, including your professional experience, skills, bio, and any other content you choose to include.
              </p>

              <h3>Usage Data</h3>
              <p>
                We automatically collect certain information when you use our Service, including your IP address, browser type, operating system, referring URLs, and pages visited.
              </p>

              <h3>Analytics Data</h3>
              <p>
                For published profiles, we collect analytics data such as page views, visitor demographics, and engagement metrics to provide insights to our users.
              </p>

              <h2>2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide, maintain, and improve our Service</li>
                <li>Create and manage your CV profile</li>
                <li>Process payments and manage subscriptions</li>
                <li>Provide customer support</li>
                <li>Send important notifications about your account</li>
                <li>Analyze usage patterns to improve our Service</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2>3. Information Sharing and Disclosure</h2>
              
              <h3>Public Profiles</h3>
              <p>
                When you publish your CV, the information included in your profile becomes publicly accessible through your custom subdomain. You control what information to include in your public profile.
              </p>

              <h3>Service Providers</h3>
              <p>
                We may share your information with third-party service providers who perform services on our behalf, such as payment processing, email delivery, and analytics.
              </p>

              <h3>Legal Requirements</h3>
              <p>
                We may disclose your information if required by law or in response to valid requests by public authorities.
              </p>

              <h3>Business Transfers</h3>
              <p>
                In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
              </p>

              <h2>4. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>

              <h2>5. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to provide our Service and fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.
              </p>

              <h2>6. Your Rights and Choices</h2>
              
              <h3>Account Information</h3>
              <p>
                You can update your account information at any time through your account settings.
              </p>

              <h3>Profile Visibility</h3>
              <p>
                You can control whether your CV is published publicly or kept private through your dashboard.
              </p>

              <h3>Account Deletion</h3>
              <p>
                You may request deletion of your account by contacting our support team. Upon deletion, your public profile will be removed, but some information may be retained for legal or security purposes.
              </p>

              <h3>Marketing Communications</h3>
              <p>
                You can opt out of marketing communications by following the unsubscribe instructions in our emails or updating your preferences in your account settings.
              </p>

              <h2>7. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to collect usage information and improve your experience. You can control cookies through your browser settings.
              </p>

              <h2>8. Third-Party Services</h2>
              
              <h3>Replit Authentication</h3>
              <p>
                We use Replit's authentication service to manage user accounts. Please review Replit's privacy policy for information about their data practices.
              </p>

              <h3>Stripe Payments</h3>
              <p>
                Payment processing is handled by Stripe. We do not store credit card information on our servers. Please review Stripe's privacy policy for information about their data practices.
              </p>

              <h2>9. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers.
              </p>

              <h2>10. Children's Privacy</h2>
              <p>
                Our Service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13.
              </p>

              <h2>11. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>

              <h2>12. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <ul>
                <li>Email: privacy@namedrop.cv</li>
                <li>Address: NameDrop.cv Privacy Team</li>
              </ul>

              <h2>13. California Privacy Rights</h2>
              <p>
                If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information we collect, the right to delete personal information, and the right to opt-out of the sale of personal information.
              </p>

              <h2>14. European Privacy Rights</h2>
              <p>
                If you are located in the European Economic Area (EEA), you have additional rights under the General Data Protection Regulation (GDPR), including the right to access, rectify, erase, restrict processing, and data portability.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
