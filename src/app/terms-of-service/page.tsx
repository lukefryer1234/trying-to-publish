
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto py-12">
      <Card className="max-w-2xl mx-auto shadow-lg rounded-lg">
        <CardHeader className="text-center">
          <FileText className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold text-foreground">Terms of Service</CardTitle>
          <CardDescription className="text-muted-foreground pt-1">
            Please read these terms carefully.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Welcome to Oak Structures! These terms and conditions outline the rules and regulations for the use of Oak Structures's Website.
          </p>
          <p>
            By accessing this website we assume you accept these terms and conditions. Do not continue to use Oak Structures if you do not agree to take all of the terms and conditions stated on this page.
          </p>
          <p>
            <em>(This is placeholder text. Full terms of service should be provided.)</em>
          </p>
          <h3 className="text-xl font-semibold text-foreground pt-4">License</h3>
          <p>
            Unless otherwise stated, Oak Structures and/or its licensors own the intellectual property rights for all material on Oak Structures. 
            All intellectual property rights are reserved. You may access this from Oak Structures for your own personal use subjected to restrictions set in these terms and conditions.
          </p>
          <h3 className="text-xl font-semibold text-foreground pt-4">User Comments</h3>
          <p>
            Certain parts of this website offer the opportunity for users to post and exchange opinions, information, material and data ('Comments'). 
            Oak Structures does not screen, edit, publish or review Comments prior to their appearance on the website and Comments do not reflect the views or opinions of Oak Structures, its agents or affiliates.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
