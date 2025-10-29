import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FileCard } from "./FileCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { toast } from "sonner";

interface FileData {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  created_at: string;
}

export const FileGallery = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const loadFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error: any) {
      console.error('Error loading files:', error);
      toast.error("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('files-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'files' },
        () => {
          loadFiles();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDelete = async (id: string, url: string) => {
    try {
      // Extract file path from URL
      const urlParts = url.split('/');
      const filePath = urlParts.slice(urlParts.indexOf('uploads') + 1).join('/');

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('uploads')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      toast.success("File deleted successfully");
      loadFiles();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error("Failed to delete file");
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = 
      filterType === "all" ||
      (filterType === "image" && file.type.startsWith('image/')) ||
      (filterType === "video" && file.type.startsWith('video/')) ||
      (filterType === "document" && !file.type.startsWith('image/') && !file.type.startsWith('video/'));
    
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading files...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Files</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
            <SelectItem value="document">Documents</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredFiles.length === 0 ? (
        <div className="text-center py-12 px-4">
          <p className="text-muted-foreground">
            {files.length === 0 
              ? "No files uploaded yet. Start by uploading your first file!" 
              : "No files match your search criteria."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFiles.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onDelete={() => handleDelete(file.id, file.url)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
