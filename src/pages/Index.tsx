import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Waves, Home, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useNavigate } from "react-router-dom";
import villaHero from "@/assets/villa-hero.jpg";
import villaPool from "@/assets/villa-pool.jpg";
import villaInterior from "@/assets/villa-interior-1.jpg";

const Index = () => {
  const navigate = useNavigate();

  const { content: heroContent } = useSiteContent("hero");
  const { content: featuresContent } = useSiteContent("features");
  const { content: galleryContent } = useSiteContent("gallery_preview");
  const { content: ctaContent } = useSiteContent("cta");

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${heroContent?.heroImage || villaHero})` 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/20 to-background"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-primary-foreground mb-6 animate-fade-in">
            {heroContent?.title || "Il Tuo Paradiso Mediterraneo"}
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 animate-fade-in">
            {heroContent?.subtitle || "Lusso, eleganza e tranquillità in una villa esclusiva con vista mare"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <button 
              onClick={() => navigate("/booking")}
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-gradient-ocean text-primary-foreground hover:opacity-90 transition-smooth shadow-ocean text-lg px-8"
              )}
            >
              Prenota il Tuo Soggiorno
            </button>
            <button 
              onClick={() => navigate("/gallery")}
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "bg-background/90 backdrop-blur-sm border-2 text-foreground hover:bg-background transition-smooth text-lg px-8"
              )}
            >
              Scopri la Villa
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <Waves className="text-primary-foreground" size={32} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-4">
            {featuresContent?.title || "Perché Villa Marina"}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">
            {featuresContent?.subtitle || "Ogni dettaglio è pensato per offrirti un'esperienza indimenticabile"}
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-luxury bg-card transition-smooth hover:shadow-ocean hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-ocean rounded-full flex items-center justify-center">
                  <Waves className="text-primary-foreground" size={32} />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-4">
                  {featuresContent?.feature1?.title || "Vista Mare Mozzafiato"}
                </h3>
                <p className="text-muted-foreground">
                  {featuresContent?.feature1?.description || "Piscina infinity con vista panoramica sul Mar Mediterraneo, per momenti di puro relax"}
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-luxury bg-card transition-smooth hover:shadow-ocean hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-ocean rounded-full flex items-center justify-center">
                  <Home className="text-primary-foreground" size={32} />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-4">
                  {featuresContent?.feature2?.title || "Design Elegante"}
                </h3>
                <p className="text-muted-foreground">
                  {featuresContent?.feature2?.description || "Architettura moderna e minimalista con arredi di lusso e comfort esclusivo"}
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-luxury bg-card transition-smooth hover:shadow-ocean hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-ocean rounded-full flex items-center justify-center">
                  <MapPin className="text-primary-foreground" size={32} />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-4">
                  {featuresContent?.feature3?.title || "Posizione Esclusiva"}
                </h3>
                <p className="text-muted-foreground">
                  {featuresContent?.feature3?.description || "Privacy assoluta in una location privilegiata, a pochi passi dalle spiagge più belle"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-16">
            {galleryContent?.title || "Scopri gli Spazi"}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-luxury group">
              <img 
                src={galleryContent?.image1 || villaPool}
                alt="Piscina infinity con vista mare"
                className="w-full h-full object-cover transition-smooth group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent flex items-end p-8">
                <h3 className="font-serif text-3xl font-bold text-primary-foreground">
                  {galleryContent?.image1Title || "Piscina Infinity"}
                </h3>
              </div>
            </div>

            <div className="relative h-96 rounded-2xl overflow-hidden shadow-luxury group">
              <img 
                src={galleryContent?.image2 || villaInterior}
                alt="Camera da letto con vista mare"
                className="w-full h-full object-cover transition-smooth group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent flex items-end p-8">
                <h3 className="font-serif text-3xl font-bold text-primary-foreground">
                  {galleryContent?.image2Title || "Suite Vista Mare"}
                </h3>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button 
              onClick={() => navigate("/gallery")}
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "border-2 hover:bg-accent hover:text-accent-foreground transition-smooth"
              )}
            >
              Vedi Tutte le Foto
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-luxury text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            {ctaContent?.title || "Pronto per la Tua Vacanza da Sogno?"}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            {ctaContent?.subtitle || "Prenota ora e vivi un'esperienza indimenticabile nella nostra villa esclusiva"}
          </p>
          <button 
            onClick={() => navigate("/booking")}
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-background text-primary hover:bg-background/90 transition-smooth text-lg px-8"
            )}
          >
            Verifica Disponibilità
          </button>
        </div>
      </section>

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

export default Index;