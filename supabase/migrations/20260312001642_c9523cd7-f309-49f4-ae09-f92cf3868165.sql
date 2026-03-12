
-- Create storage bucket for waste images
INSERT INTO storage.buckets (id, name, public) VALUES ('waste-images', 'waste-images', true);

-- Allow authenticated users to upload to waste-images bucket
CREATE POLICY "Authenticated users can upload waste images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'waste-images');

-- Allow public read access to waste images
CREATE POLICY "Anyone can view waste images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'waste-images');

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete own waste images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'waste-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow admins to delete any waste images
CREATE POLICY "Admins can delete any waste images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'waste-images' AND public.has_role(auth.uid(), 'admin'));
