import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="font-serif text-2xl font-bold text-gradient-ocean">
            Villa Marina
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-foreground hover:text-accent transition-smooth">
              Home
            </Link>
            <Link to="/gallery" className="text-foreground hover:text-accent transition-smooth">
              Galleria
            </Link>
            <Link to="/booking" className="text-foreground hover:text-accent transition-smooth">
              Prenota
            </Link>
            <Button 
              asChild
              className="bg-gradient-ocean text-primary-foreground hover:opacity-90 transition-smooth shadow-ocean"
            >
              <Link to="/booking">Prenota Ora</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link 
              to="/" 
              className="block py-2 text-foreground hover:text-accent transition-smooth"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/gallery" 
              className="block py-2 text-foreground hover:text-accent transition-smooth"
              onClick={() => setIsOpen(false)}
            >
              Galleria
            </Link>
            <Link 
              to="/booking" 
              className="block py-2 text-foreground hover:text-accent transition-smooth"
              onClick={() => setIsOpen(false)}
            >
              Prenota
            </Link>
            <Button 
              asChild
              className="w-full bg-gradient-ocean text-primary-foreground"
            >
              <Link to="/booking" onClick={() => setIsOpen(false)}>
                Prenota Ora
              </Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;