import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, File, Image, Video, Cloud } from "lucide-react";
import { toast } from "sonner";

const SharedFile = () => {
  const { id } = useParams();
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFile = async () => {
      try {
        const { data, error } = await supabase
          .from('files')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setFile(data);
      } catch (error) {
        console.error('Error loading file:', error);
        toast.error("File not found");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadFile();
    }
  }, [id]);

  const downloadFile = () => {
    if (file) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(file.url);
    toast.success("Link copied to clipboard!");
  };

  const getFileIcon = () => {
    if (!file) return File;
    if (file.type.startsWith('image/')) return Image;
    if (file.type.startsWith('video/')) return Video;
    return File;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading file...</p>
        </div>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold mb-2">File Not Found</h1>
          <p className="text-muted-foreground">The file you're looking for doesn't exist or has been deleted.</p>
        </Card>
      </div>
    );
  }

  const IconComponent = getFileIcon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <nav className="border-b bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 h-16">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Cloud className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">CloudShare</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto overflow-hidden">
          <div className="relative aspect-video bg-muted flex items-center justify-center">
            {file.type.startsWith('image/') ? (
              <img 
                src={file.url} 
                alt={file.name}
                className="w-full h-full object-contain"
              />
            ) : file.type.startsWith('video/') ? (
              <video 
                src={file.url} 
                controls
                className="w-full h-full"
              />
            ) : (
              <div className="w-32 h-32 rounded-2xl bg-primary/10 flex items-center justify-center">
                <IconComponent className="w-16 h-16 text-primary" />
              </div>
            )}
          </div>

          <div className="p-8 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{file.name}</h1>
              <p className="text-muted-foreground">
                {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={downloadFile} size="lg" className="flex-1">
                <Download className="w-5 h-5 mr-2" />
                Download File
              </Button>
              <Button onClick={copyLink} variant="outline" size="lg">
                Copy Link
              </Button>
            </div>

            <div className="pt-6 border-t">
              <p className="text-sm text-muted-foreground text-center">
                Shared via CloudShare • Secure file hosting
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SharedFile;
