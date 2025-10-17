import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSiteContent } from "@/hooks/useSiteContent";
import { z } from "zod";

const bookingSchema = z.object({
  name: z.string().min(2, "Il nome deve contenere almeno 2 caratteri").max(100),
  email: z.string().email("Email non valida").max(255),
  phone: z.string().optional(),
  guests: z.number().min(1, "Almeno 1 ospite richiesto").max(10, "Massimo 10 ospiti"),
  message: z.string().max(1000).optional(),
});

const Booking = () => {
  const navigate = useNavigate();
  const { content } = useSiteContent("booking");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: 2,
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkIn || !checkOut) {
      toast.error("Seleziona le date di check-in e check-out");
      return;
    }

    if (checkOut <= checkIn) {
      toast.error("La data di check-out deve essere successiva al check-in");
      return;
    }

    try {
      // Validate form data
      const validatedData = bookingSchema.parse(formData);
      
      setLoading(true);

      const { error } = await supabase.from("bookings").insert({
        user_name: validatedData.name,
        user_email: validatedData.email,
        user_phone: validatedData.phone || null,
        check_in: format(checkIn, "yyyy-MM-dd"),
        check_out: format(checkOut, "yyyy-MM-dd"),
        guests: validatedData.guests,
        message: validatedData.message || null,
      });

      if (error) throw error;

      toast.success("Richiesta di prenotazione inviata con successo! Ti contatteremo presto.");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        guests: 2,
        message: "",
      });
      setCheckIn(undefined);
      setCheckOut(undefined);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        console.error("Booking error:", error);
        toast.error("Errore durante l'invio della richiesta. Riprova più tardi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-center mb-6">
            {content?.title || "Prenota il Tuo Soggiorno"}
          </h1>
          <p className="text-center text-muted-foreground text-lg mb-12">
            {content?.subtitle || "Compila il modulo per richiedere la disponibilità. Ti risponderemo entro 24 ore."}
          </p>

          <Card className="shadow-luxury border-none">
            <CardHeader>
              <CardTitle className="font-serif text-3xl">Richiesta di Prenotazione</CardTitle>
              <CardDescription>
                Inserisci i tuoi dati e le date desiderate per il soggiorno
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Mario Rossi"
                      required
                      maxLength={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="mario@esempio.it"
                      required
                      maxLength={255}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+39 123 456 7890"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guests">Numero Ospiti *</Label>
                    <Input
                      id="guests"
                      type="number"
                      min="1"
                      max="10"
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Check-in *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !checkIn && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkIn ? format(checkIn, "PPP", { locale: it }) : "Seleziona data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkIn}
                          onSelect={setCheckIn}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Check-out *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !checkOut && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkOut ? format(checkOut, "PPP", { locale: it }) : "Seleziona data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkOut}
                          onSelect={setCheckOut}
                          disabled={(date) => !checkIn || date <= checkIn}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Messaggio (opzionale)</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Hai richieste particolari o domande? Scrivici qui..."
                    className="min-h-32"
                    maxLength={1000}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-ocean text-primary-foreground hover:opacity-90 transition-smooth text-lg py-6"
                  disabled={loading}
                >
                  {loading ? "Invio in corso..." : "Invia Richiesta di Prenotazione"}
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  * Campi obbligatori. Riceverai una conferma via email entro 24 ore.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <p className="font-serif text-2xl font-bold mb-4">Villa Marina</p>
          <p className="text-primary-foreground/80">
            Il tuo rifugio di lusso sul Mediterraneo
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Booking;