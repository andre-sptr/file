import { Button } from "@/components/ui/button";
import { Cloud, Upload } from "lucide-react";
import heroImage from "@/assets/hero-cloud.jpg";

interface HeroProps {
  onUploadClick: () => void;
}

export const Hero = ({ onUploadClick }: HeroProps) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-background to-muted/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(37,99,235,0.1),transparent)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Cloud className="w-4 h-4" />
              Secure Cloud Storage
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Upload, Share, and Store
              <span className="block text-primary mt-2">Your Files with Ease</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-xl">
              A modern and secure file hosting platform. Upload images, videos, and documents. 
              Share instantly with public links.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="text-lg px-8 shadow-lg hover:shadow-xl transition-all"
                onClick={onUploadClick}
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
              </Button>
            </div>
            
            <div className="flex items-center gap-8 pt-8">
              <div>
                <div className="text-3xl font-bold text-primary">15MB</div>
                <div className="text-sm text-muted-foreground">Max File Size</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">Unlimited</div>
                <div className="text-sm text-muted-foreground">Storage Space</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">Secure</div>
                <div className="text-sm text-muted-foreground">& Private</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
            <img 
              src={heroImage} 
              alt="Cloud storage illustration" 
              className="relative w-full rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
