import { Upload, Link2, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Fast Upload",
    description: "Upload your files quickly with our optimized infrastructure. Support for images, videos, and documents."
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your files are protected with enterprise-grade security. Only you can access your uploads."
  },
  {
    icon: Link2,
    title: "Instant Sharing",
    description: "Generate shareable links instantly. Share your files with anyone, anywhere in the world."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Experience blazing fast speeds for uploads and downloads. No waiting, just results."
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Everything You Need
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to make file sharing effortless
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-card hover:shadow-xl transition-all duration-300 border border-border hover:border-primary/50"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
