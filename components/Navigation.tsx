import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Sparkles, Package, Shirt, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-secondary/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group" onClick={closeMobileMenu}>
            <Sparkles className="w-6 h-6 text-white group-hover:text-accent transition-colors duration-200" />
            <span className="font-bold text-lg text-white">AI Generator</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/">
              <Button 
                variant={router.pathname === "/" ? "default" : "ghost"}
                className="flex items-center space-x-2 hover:bg-accent/10 hover:text-accent transition-all duration-200 text-white"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Image</span>
              </Button>
            </Link>
            
            <Link href="/product">
              <Button 
                variant={router.pathname === "/product" ? "default" : "ghost"}
                className="flex items-center space-x-2 hover:bg-accent/10 hover:text-accent transition-all duration-200 text-white"
              >
                <Package className="w-4 h-4" />
                <span>Generate Product Image</span>
              </Button>
            </Link>
            
            <Link href="/coba-baju">
              <Button 
                variant={router.pathname === "/coba-baju" ? "default" : "ghost"}
                className="flex items-center space-x-2 hover:bg-accent/10 hover:text-accent transition-all duration-200 text-white"
              >
                <Shirt className="w-4 h-4" />
                <span>Coba Baju</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden hover:bg-accent/10 hover:text-accent text-white"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-secondary/95 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/" onClick={closeMobileMenu}>
                <Button 
                  variant={router.pathname === "/" ? "default" : "ghost"}
                  className="w-full justify-start flex items-center space-x-2 hover:bg-accent/10 hover:text-accent transition-all duration-200 text-white"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Image</span>
                </Button>
              </Link>
              
              <Link href="/product" onClick={closeMobileMenu}>
                <Button 
                  variant={router.pathname === "/product" ? "default" : "ghost"}
                  className="w-full justify-start flex items-center space-x-2 hover:bg-accent/10 hover:text-accent transition-all duration-200 text-white"
                >
                  <Package className="w-4 h-4" />
                  <span>Generate Product Image</span>
                </Button>
              </Link>
              
              <Link href="/coba-baju" onClick={closeMobileMenu}>
                <Button 
                  variant={router.pathname === "/coba-baju" ? "default" : "ghost"}
                  className="w-full justify-start flex items-center space-x-2 hover:bg-accent/10 hover:text-accent transition-all duration-200 text-white"
                >
                  <Shirt className="w-4 h-4" />
                  <span>Coba Baju</span>
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}