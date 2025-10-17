-- Create storage bucket for site images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-images',
  'site-images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
);

-- Create storage policies for site images
CREATE POLICY "Anyone can view site images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'site-images');

CREATE POLICY "Admins can upload site images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'site-images' AND
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update site images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'site-images' AND
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete site images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'site-images' AND
  public.has_role(auth.uid(), 'admin')
);

-- Create site_content table for editable content
CREATE TABLE public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view site content"
ON public.site_content
FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can update site content"
ON public.site_content
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert site content"
ON public.site_content
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_site_content_updated_at
BEFORE UPDATE ON public.site_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default content
INSERT INTO public.site_content (section, content) VALUES
('hero', '{
  "title": "Il Tuo Paradiso Mediterraneo",
  "subtitle": "Lusso, eleganza e tranquillità in una villa esclusiva con vista mare",
  "heroImage": "/src/assets/villa-hero.jpg"
}'::jsonb),
('features', '{
  "title": "Perché Villa Marina",
  "subtitle": "Ogni dettaglio è pensato per offrirti un''esperienza indimenticabile",
  "feature1": {
    "title": "Vista Mare Mozzafiato",
    "description": "Piscina infinity con vista panoramica sul Mar Mediterraneo, per momenti di puro relax"
  },
  "feature2": {
    "title": "Design Elegante", 
    "description": "Architettura moderna e minimalista con arredi di lusso e comfort esclusivo"
  },
  "feature3": {
    "title": "Posizione Esclusiva",
    "description": "Privacy assoluta in una location privilegiata, a pochi passi dalle spiagge più belle"
  }
}'::jsonb),
('gallery_preview', '{
  "title": "Scopri gli Spazi",
  "image1": "/src/assets/villa-pool.jpg",
  "image1Title": "Piscina Infinity",
  "image2": "/src/assets/villa-interior-1.jpg",
  "image2Title": "Suite Vista Mare"
}'::jsonb),
('cta', '{
  "title": "Pronto per la Tua Vacanza da Sogno?",
  "subtitle": "Prenota ora e vivi un''esperienza indimenticabile nella nostra villa esclusiva"
}'::jsonb),
('gallery', '{
  "title": "Galleria Fotografica",
  "subtitle": "Scopri ogni angolo della nostra villa di lusso attraverso immagini che catturano l''essenza del Mediterraneo",
  "images": [
    {"url": "/src/assets/villa-hero.jpg", "title": "Vista Panoramica", "description": "La villa con piscina infinity e vista mare mozzafiato"},
    {"url": "/src/assets/villa-pool.jpg", "title": "Piscina Infinity", "description": "Acqua cristallina che si fonde con l''orizzonte del mare"},
    {"url": "/src/assets/villa-interior-1.jpg", "title": "Suite Master", "description": "Camera da letto con vista mare e design minimalista"},
    {"url": "/src/assets/villa-terrace.jpg", "title": "Terrazza al Tramonto", "description": "Spazio outdoor perfetto per aperitivi e cene romantiche"}
  ],
  "amenities": [
    "Piscina infinity a sfioro",
    "Terrazza panoramica",
    "Wi-Fi ad alta velocità",
    "Aria condizionata",
    "Cucina completamente attrezzata",
    "Barbecue e zona pranzo esterna",
    "Parcheggio privato",
    "Sistema audio premium",
    "Biancheria e asciugamani di lusso"
  ]
}'::jsonb),
('booking', '{
  "title": "Prenota il Tuo Soggiorno",
  "subtitle": "Compila il modulo per richiedere la disponibilità. Ti risponderemo entro 24 ore."
}'::jsonb);