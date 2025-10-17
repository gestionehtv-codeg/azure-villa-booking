import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, Calendar as CalendarIcon, Users, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface Booking {
  id: string;
  user_name: string;
  user_email: string;
  user_phone: string | null;
  check_in: string;
  check_out: string;
  guests: number;
  message: string | null;
  status: "pending" | "confirmed" | "rejected";
  created_at: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  useEffect(() => {
    checkAuth();
    fetchBookings();
    fetchAvailability();

    // Set up real-time subscription for bookings
    const channel = supabase
      .channel('bookings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        () => {
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/villa-admin");
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .single();

    if (!roles) {
      await supabase.auth.signOut();
      navigate("/villa-admin");
      toast.error("Accesso non autorizzato");
    }

    setLoading(false);
  };

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Errore nel caricamento delle prenotazioni");
    } else {
      setBookings(data || []);
    }
  };

  const fetchAvailability = async () => {
    const { data } = await supabase
      .from("availability")
      .select("date")
      .eq("is_available", false);

    if (data) {
      setSelectedDates(data.map(item => new Date(item.date)));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/villa-admin");
    toast.success("Logout effettuato");
  };

  const updateBookingStatus = async (bookingId: string, status: "confirmed" | "rejected") => {
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", bookingId);

    if (error) {
      toast.error("Errore nell'aggiornamento");
    } else {
      toast.success(`Prenotazione ${status === "confirmed" ? "confermata" : "rifiutata"}`);
      fetchBookings();
    }
  };

  const toggleDateAvailability = async (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const isCurrentlyUnavailable = selectedDates.some(
      d => format(d, "yyyy-MM-dd") === dateStr
    );

    if (isCurrentlyUnavailable) {
      // Make available
      const { error } = await supabase
        .from("availability")
        .delete()
        .eq("date", dateStr);

      if (!error) {
        setSelectedDates(selectedDates.filter(d => format(d, "yyyy-MM-dd") !== dateStr));
        toast.success("Data resa disponibile");
      }
    } else {
      // Make unavailable
      const { error } = await supabase
        .from("availability")
        .upsert({ date: dateStr, is_available: false });

      if (!error) {
        setSelectedDates([...selectedDates, date]);
        toast.success("Data resa non disponibile");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Caricamento...</p>
      </div>
    );
  }

  const pendingBookings = bookings.filter(b => b.status === "pending");
  const confirmedBookings = bookings.filter(b => b.status === "confirmed");

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-luxury text-primary-foreground p-6">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold">Dashboard Admin</h1>
            <p className="text-primary-foreground/80">Villa Marina</p>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
          >
            <LogOut className="mr-2" size={16} />
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Richieste in Attesa</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingBookings.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prenotazioni Confermate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{confirmedBookings.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Giorni Non Disponibili</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{selectedDates.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="bookings">Prenotazioni</TabsTrigger>
            <TabsTrigger value="calendar">Calendario Disponibilità</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-4">
            {bookings.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  Nessuna prenotazione al momento
                </CardContent>
              </Card>
            ) : (
              bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{booking.user_name}</CardTitle>
                        <CardDescription>
                          {booking.user_email}
                          {booking.user_phone && ` • ${booking.user_phone}`}
                        </CardDescription>
                      </div>
                      <Badge 
                        variant={
                          booking.status === "confirmed" ? "default" :
                          booking.status === "rejected" ? "destructive" :
                          "secondary"
                        }
                      >
                        {booking.status === "confirmed" ? "Confermata" :
                         booking.status === "rejected" ? "Rifiutata" :
                         "In Attesa"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Check-in</p>
                        <p className="font-medium">{format(new Date(booking.check_in), "PPP", { locale: it })}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Check-out</p>
                        <p className="font-medium">{format(new Date(booking.check_out), "PPP", { locale: it })}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Ospiti</p>
                        <p className="font-medium">{booking.guests}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Richiesta il</p>
                        <p className="font-medium">{format(new Date(booking.created_at), "PPP", { locale: it })}</p>
                      </div>
                    </div>

                    {booking.message && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Messaggio</p>
                        <p className="text-sm bg-muted p-3 rounded-lg">{booking.message}</p>
                      </div>
                    )}

                    {booking.status === "pending" && (
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => updateBookingStatus(booking.id, "confirmed")}
                          className="bg-accent hover:bg-accent/90"
                        >
                          <CheckCircle className="mr-2" size={16} />
                          Conferma
                        </Button>
                        <Button 
                          onClick={() => updateBookingStatus(booking.id, "rejected")}
                          variant="destructive"
                        >
                          <XCircle className="mr-2" size={16} />
                          Rifiuta
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Gestione Disponibilità</CardTitle>
                <CardDescription>
                  Clicca sulle date per renderle non disponibili (evidenziate in rosso)
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Calendar
                  mode="multiple"
                  selected={selectedDates}
                  onSelect={(dates) => {
                    if (dates) {
                      const newDate = dates[dates.length - 1];
                      if (newDate) {
                        toggleDateAvailability(newDate);
                      }
                    }
                  }}
                  className="pointer-events-auto"
                  disabled={(date) => date < new Date()}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;