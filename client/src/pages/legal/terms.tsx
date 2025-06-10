import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <Card>
            <CardContent className="p-8 prose prose-gray dark:prose-invert max-w-none">
              <h2>1. Agreement to Terms</h2>
              <p>
                By accessing and using NameDrop.cv ("Service"), you accept and agree to be bound by the terms and provision of this agreement.
              </p>

              <h2>2. Description of Service</h2>
              <p>
                NameDrop.cv is a professional CV creation platform that allows users to create, customize, and publish their professional profiles online with custom subdomains.
              </p>

              <h2>3. User Accounts</h2>
              <p>
                To access certain features of the Service, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>

              <h2>4. User Content</h2>
              <p>
                You retain ownership of any content you submit, post, or display on or through the Service ("User Content"). By providing User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, copy, reproduce, process, adapt, modify, publish, transmit, display, and distribute such content.
              </p>

              <h2>5. Prohibited Uses</h2>
              <p>You may not use our Service:</p>
              <ul>
                <li>For any unlawful purpose or to solicit others to unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
              </ul>

              <h2>6. Subscription and Billing</h2>
              <p>
                Some features of the Service require payment. You will be billed in advance on a recurring basis for Pro subscriptions. You may cancel your subscription at any time through your account settings.
              </p>

              <h2>7. Intellectual Property Rights</h2>
              <p>
                The Service and its original content, features, and functionality are and will remain the exclusive property of NameDrop.cv and its licensors. The Service is protected by copyright, trademark, and other laws.
              </p>

              <h2>8. Privacy Policy</h2>
              <p>
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
              </p>

              <h2>9. Termination</h2>
              <p>
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
              </p>

              <h2>10. Disclaimer</h2>
              <p>
                The information on this Service is provided on an "as is" basis. To the fullest extent permitted by law, we exclude all representations, warranties, and conditions relating to our Service and the use of this Service.
              </p>

              <h2>11. Limitation of Liability</h2>
              <p>
                In no event shall NameDrop.cv, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
              </p>

              <h2>12. Governing Law</h2>
              <p>
                These Terms shall be interpreted and governed by the laws of the United States, without regard to its conflict of law provisions.
              </p>

              <h2>13. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
              </p>

              <h2>14. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at legal@namedrop.cv.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
