
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-12">
      <Card className="max-w-2xl mx-auto shadow-lg rounded-lg">
        <CardHeader className="text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold text-foreground">Privacy Policy</CardTitle>
          <CardDescription className="text-muted-foreground pt-1">
            Our commitment to your privacy.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            This is the Privacy Policy page for Oak Structures. We are committed to protecting your personal information and your right to privacy. 
            If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.
          </p>
          <p>
            When you visit our website and use our services, you trust us with your personal information. We take your privacy very seriously. 
            In this privacy notice, we describe our privacy policy. We seek to explain to you in the clearest way possible what information we collect, 
            how we use it and what rights you have in relation to it.
          </p>
          <p>
            <em>(This is placeholder text. A full privacy policy should be provided.)</em>
          </p>
          <h3 className="text-xl font-semibold text-foreground pt-4">Information We Collect</h3>
          <p>
            We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and services, 
            when you participate in activities on the Website or otherwise when you contact us.
          </p>
          <h3 className="text-xl font-semibold text-foreground pt-4">How We Use Your Information</h3>
          <p>
            We use personal information collected via our Website for a variety of business purposes described below. 
            We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, 
            with your consent, and/or for compliance with our legal obligations.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
