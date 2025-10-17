import { useState } from "react";
import { Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = (path: string) => {
    window.location.href = path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <button 
            onClick={() => navigate("/")}
            className="font-serif text-2xl font-bold text-gradient-ocean cursor-pointer"
          >
            Villa Marina
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => navigate("/")}
              className="text-foreground hover:text-accent transition-smooth"
            >
              Home
            </button>
            <button 
              onClick={() => navigate("/gallery")}
              className="text-foreground hover:text-accent transition-smooth"
            >
              Galleria
            </button>
            <button 
              onClick={() => navigate("/booking")}
              className="text-foreground hover:text-accent transition-smooth"
            >
              Prenota
            </button>
            <button 
              onClick={() => navigate("/booking")}
              className={cn(
                buttonVariants(),
                "bg-gradient-ocean text-primary-foreground hover:opacity-90 transition-smooth shadow-ocean"
              )}
            >
              Prenota Ora
            </button>
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
            <button 
              onClick={() => {
                setIsOpen(false);
                navigate("/");
              }}
              className="block w-full text-left py-2 text-foreground hover:text-accent transition-smooth"
            >
              Home
            </button>
            <button 
              onClick={() => {
                setIsOpen(false);
                navigate("/gallery");
              }}
              className="block w-full text-left py-2 text-foreground hover:text-accent transition-smooth"
            >
              Galleria
            </button>
            <button 
              onClick={() => {
                setIsOpen(false);
                navigate("/booking");
              }}
              className="block w-full text-left py-2 text-foreground hover:text-accent transition-smooth"
            >
              Prenota
            </button>
            <button 
              onClick={() => {
                setIsOpen(false);
                navigate("/booking");
              }}
              className={cn(
                buttonVariants(),
                "w-full bg-gradient-ocean text-primary-foreground"
              )}
            >
              Prenota Ora
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;