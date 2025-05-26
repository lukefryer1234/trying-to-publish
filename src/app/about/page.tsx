
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, MapPin, Phone, Mail } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="container mx-auto py-12">
      <Card className="max-w-2xl mx-auto shadow-lg rounded-lg">
        <CardHeader className="text-center">
          <Info className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold text-foreground">About SwiftCart</CardTitle>
          <CardDescription className="text-muted-foreground pt-1">
            Your source for premium, configurable oak products.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
          <p className="text-center">
            At SwiftCart, we are dedicated to providing high-quality, customizable oak products for your home and garden. 
            From robust garages and elegant gazebos to classic porches and essential building materials, 
            we combine traditional craftsmanship with modern convenience.
          </p>
          
          <div className="space-y-4 pt-4">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center justify-center">
                <MapPin className="h-5 w-5 mr-2 text-primary" /> Our Location
              </h3>
              <p className="text-center">
                SwiftCart Headquarters<br />
                123 Oak Lane, Timber Town<br />
                Forestshire, FS1 2TT<br />
                United Kingdom
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center justify-center">
                <Phone className="h-5 w-5 mr-2 text-primary" /> Contact Us
              </h3>
              <p className="text-center">
                <strong>Phone:</strong> +44 (0)123 456 7890<br />
                <strong>Email:</strong> <a href="mailto:info@swiftcart.example.com" className="text-primary hover:underline">info@swiftcart.example.com</a>
              </p>
            </div>
          </div>

          <p className="text-center pt-4">
            Our innovative online configurator allows you to tailor each product to your exact specifications. 
            We look forward to helping you build something amazing!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
