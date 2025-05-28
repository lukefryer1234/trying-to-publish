
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Image as ImageIcon } from "lucide-react";

export default function GalleryPage() {
  return (
    <div className="container mx-auto py-12">
      <Card className="max-w-4xl mx-auto shadow-lg rounded-lg">
        <CardHeader className="text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold text-foreground">Gallery</CardTitle>
          <CardDescription className="text-muted-foreground pt-1">
            Browse images of our completed projects and product examples.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
          <p className="text-center">
            Welcome to the SwiftCart gallery! Here you can find inspiration from a collection of our finest oak structures, 
            showcasing the quality and craftsmanship that goes into every product.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                <img 
                  src={`https://placehold.co/400x400.png?text=Project+${index + 1}`} 
                  alt={`Placeholder image for project ${index + 1}`} 
                  className="w-full h-full object-cover"
                  data-ai-hint="oak building project"
                />
              </div>
            ))}
          </div>
          <p className="text-center pt-4">
            More images coming soon! Check back regularly to see our latest work.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
