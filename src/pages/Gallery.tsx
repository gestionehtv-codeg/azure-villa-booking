import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import villaHero from "@/assets/villa-hero.jpg";
import villaPool from "@/assets/villa-pool.jpg";
import villaInterior from "@/assets/villa-interior-1.jpg";
import villaTerrace from "@/assets/villa-terrace.jpg";

const Gallery = () => {
  const images = [
    { src: villaHero, title: "Vista Panoramica", description: "La villa con piscina infinity e vista mare mozzafiato" },
    { src: villaPool, title: "Piscina Infinity", description: "Acqua cristallina che si fonde con l'orizzonte del mare" },
    { src: villaInterior, title: "Suite Master", description: "Camera da letto con vista mare e design minimalista" },
    { src: villaTerrace, title: "Terrazza al Tramonto", description: "Spazio outdoor perfetto per aperitivi e cene romantiche" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-center mb-6">
            Galleria Fotografica
          </h1>
          <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">
            Scopri ogni angolo della nostra villa di lusso attraverso immagini che catturano l'essenza del Mediterraneo
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {images.map((image, index) => (
              <Card 
                key={index}
                className="overflow-hidden border-none shadow-luxury hover:shadow-ocean transition-smooth group"
              >
                <div className="relative h-96 overflow-hidden">
                  <img 
                    src={image.src} 
                    alt={image.title}
                    className="w-full h-full object-cover transition-smooth group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-smooth flex flex-col justify-end p-8">
                    <h3 className="font-serif text-3xl font-bold text-primary-foreground mb-2">
                      {image.title}
                    </h3>
                    <p className="text-primary-foreground/90">
                      {image.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Features Grid */}
          <div className="mt-20 grid md:grid-cols-3 gap-6">
            <div className="text-center p-8 bg-muted rounded-2xl">
              <p className="font-serif text-4xl font-bold text-accent mb-2">4</p>
              <p className="text-muted-foreground">Camere da Letto</p>
            </div>
            <div className="text-center p-8 bg-muted rounded-2xl">
              <p className="font-serif text-4xl font-bold text-accent mb-2">5</p>
              <p className="text-muted-foreground">Bagni di Lusso</p>
            </div>
            <div className="text-center p-8 bg-muted rounded-2xl">
              <p className="font-serif text-4xl font-bold text-accent mb-2">350m²</p>
              <p className="text-muted-foreground">Superficie Totale</p>
            </div>
          </div>

          {/* Amenities */}
          <div className="mt-16">
            <h2 className="font-serif text-3xl font-bold text-center mb-12">Servizi Inclusi</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "Piscina infinity a sfioro",
                "Terrazza panoramica",
                "Wi-Fi ad alta velocità",
                "Aria condizionata",
                "Cucina completamente attrezzata",
                "Barbecue e zona pranzo esterna",
                "Parcheggio privato",
                "Sistema audio premium",
                "Biancheria e asciugamani di lusso",
              ].map((amenity, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-4 bg-card rounded-lg shadow-soft"
                >
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <p className="text-foreground">{amenity}</p>
                </div>
              ))}
            </div>
          </div>
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

export default Gallery;