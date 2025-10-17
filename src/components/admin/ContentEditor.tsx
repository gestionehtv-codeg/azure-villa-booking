import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Save } from "lucide-react";

interface ContentEditorProps {
  section: string;
  title: string;
  description?: string;
}

export const ContentEditor = ({ section, title, description }: ContentEditorProps) => {
  const [content, setContent] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, [section]);

  const fetchContent = async () => {
    const { data, error } = await supabase
      .from("site_content")
      .select("content")
      .eq("section", section)
      .single();

    if (!error && data) {
      setContent(data.content);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();

    const { error } = await supabase
      .from("site_content")
      .update({
        content,
        updated_by: session?.user.id
      })
      .eq("section", section);

    if (error) {
      toast.error("Errore durante il salvataggio");
      console.error(error);
    } else {
      toast.success("Contenuto aggiornato con successo!");
    }
    setSaving(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(key);

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('site-images')
      .upload(filePath, file);

    if (uploadError) {
      toast.error("Errore durante il caricamento dell'immagine");
      console.error(uploadError);
      setUploadingImage(null);
      return;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('site-images')
      .getPublicUrl(filePath);

    // Update content with new image URL
    setContent((prev: any) => ({
      ...prev,
      [key]: publicUrl
    }));

    setUploadingImage(null);
    toast.success("Immagine caricata con successo!");
  };

  const updateNestedField = (path: string, value: any) => {
    const keys = path.split('.');
    const newContent = { ...content };
    let current: any = newContent;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    setContent(newContent);
  };

  const getNestedValue = (path: string) => {
    const keys = path.split('.');
    let current = content;
    for (const key of keys) {
      if (current === undefined || current === null) return '';
      current = current[key];
    }
    return current || '';
  };

  if (loading) {
    return <div className="p-8 text-center">Caricamento...</div>;
  }

  const renderField = (key: string, value: any, path: string = key) => {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return (
        <div key={path} className="space-y-4 border-l-2 border-border pl-4 ml-2">
          <h4 className="font-medium text-sm text-muted-foreground capitalize">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </h4>
          {Object.entries(value).map(([nestedKey, nestedValue]) =>
            renderField(nestedKey, nestedValue, `${path}.${nestedKey}`)
          )}
        </div>
      );
    }

    const isImageField = key.toLowerCase().includes('image') || 
                        key.toLowerCase().includes('url') ||
                        path.toLowerCase().includes('image');

    return (
      <div key={path} className="space-y-2">
        <Label htmlFor={path} className="capitalize">
          {key.replace(/([A-Z])/g, ' $1').trim()}
        </Label>
        {isImageField ? (
          <div className="space-y-2">
            {getNestedValue(path) && (
              <img 
                src={getNestedValue(path)} 
                alt={key}
                className="w-full max-w-md h-48 object-cover rounded-lg"
              />
            )}
            <div className="flex gap-2">
              <Input
                id={path}
                value={getNestedValue(path)}
                onChange={(e) => updateNestedField(path, e.target.value)}
                placeholder="URL immagine"
              />
              <label htmlFor={`${path}-upload`}>
                <Button 
                  type="button" 
                  variant="outline"
                  disabled={uploadingImage === path}
                  onClick={() => document.getElementById(`${path}-upload`)?.click()}
                >
                  <Upload className="mr-2" size={16} />
                  {uploadingImage === path ? "Caricamento..." : "Carica"}
                </Button>
                <input
                  id={`${path}-upload`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, path)}
                />
              </label>
            </div>
          </div>
        ) : typeof value === 'string' && value.length > 100 ? (
          <Textarea
            id={path}
            value={getNestedValue(path)}
            onChange={(e) => updateNestedField(path, e.target.value)}
            rows={4}
          />
        ) : (
          <Input
            id={path}
            value={getNestedValue(path)}
            onChange={(e) => updateNestedField(path, e.target.value)}
          />
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(content).map(([key, value]) => renderField(key, value))}
        
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="w-full bg-gradient-ocean text-primary-foreground"
        >
          <Save className="mr-2" size={16} />
          {saving ? "Salvataggio..." : "Salva Modifiche"}
        </Button>
      </CardContent>
    </Card>
  );
};