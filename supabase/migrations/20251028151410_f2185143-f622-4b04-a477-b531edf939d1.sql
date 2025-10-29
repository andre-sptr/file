-- Create files table with user relationship
CREATE TABLE public.files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  size BIGINT NOT NULL,
  url TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see their own files in authenticated views
CREATE POLICY "Users can view own files"
  ON public.files
  FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own files"
  ON public.files
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete own files"
  ON public.files
  FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Public files can be viewed by anyone (for shared links)
CREATE POLICY "Public files viewable by all"
  ON public.files
  FOR SELECT
  TO anon
  USING (true);

-- Create storage bucket for files
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true);

-- Storage policies
CREATE POLICY "Users can upload own files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own files"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Public access to all files in uploads bucket (for sharing)
CREATE POLICY "Public access to uploads"
  ON storage.objects
  FOR SELECT
  TO anon
  USING (bucket_id = 'uploads');

-- Create index for faster queries
CREATE INDEX idx_files_owner_id ON public.files(owner_id);
CREATE INDEX idx_files_created_at ON public.files(created_at DESC);