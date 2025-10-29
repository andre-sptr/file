import { Download, Trash2, Share2, File, Image, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface FileCardProps {
  file: {
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
    created_at: string;
  };
  onDelete: () => void;
}

export const FileCard = ({ file, onDelete }: FileCardProps) => {
  const getFileIcon = () => {
    if (file.type.startsWith('image/')) return Image;
    if (file.type.startsWith('video/')) return Video;
    return File;
  };

  const IconComponent = getFileIcon();

  const copyShareLink = () => {
    navigator.clipboard.writeText(file.url);
    toast.success("Share link copied to clipboard!");
  };

  const downloadFile = () => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleDeleteConfirm = () => {
    const isConfirmed = window.confirm(`Apakah Anda yakin ingin menghapus file "${file.name}"?`);

    if (isConfirmed) {
      onDelete();
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-video bg-muted flex items-center justify-center overflow-hidden">
        {file.type.startsWith('image/') ? (
          <img 
            src={file.url} 
            alt={file.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
            <IconComponent className="w-10 h-10 text-primary" />
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        <div>
          <h3 className="font-semibold truncate mb-1">{file.name}</h3>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{formatSize(file.size)}</span>
            <span>{formatDistanceToNow(new Date(file.created_at), { addSuffix: true })}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={downloadFile}
          >
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={copyShareLink}
          >
            <Share2 className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteConfirm}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
