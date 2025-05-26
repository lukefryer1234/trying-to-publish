
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="container mx-auto py-12">
      <Card className="max-w-2xl mx-auto shadow-lg rounded-lg">
        <CardHeader className="text-center">
          <Info className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold text-foreground">About SwiftCart</CardTitle>
          <CardDescription className="text-muted-foreground pt-1">
            Learn more about our company and mission.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Welcome to SwiftCart! We specialize in providing high-quality, configurable oak products for your home and garden. 
            Our mission is to offer beautiful, durable, and customizable solutions that perfectly fit your needs.
          </p>
          <p>
            From sturdy oak garages and elegant gazebos to classic porches and essential building materials like oak beams and flooring, 
            we pride ourselves on craftsmanship and customer satisfaction.
          </p>
          <p>
            Our innovative online configurator allows you to tailor each product to your exact specifications, 
            see live price updates, and visualize your creation before you buy.
          </p>
          <p>
            Thank you for choosing SwiftCart. We look forward to helping you build something amazing!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
