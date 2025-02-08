import { useState } from "react";
import { Link } from "@remix-run/react";
import { Button } from "@/components/ui/button";

export function NavHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          {/* Branding */}
          <Link to="/" className="text-xl font-semibold">
            Deadlock API - Showcase
          </Link>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/item-analysis">
              <Button variant="ghost">Item Analysis</Button>
            </Link>
            <Link to="/build-analysis">
              <Button variant="ghost">Build Analysis</Button>
            </Link>
            <Link to="/hero-stats">
              <Button variant="ghost">Hero Stats</Button>
            </Link>
            <Link to="/hero-comb-stats">
              <Button variant="ghost">Hero Comb Stats</Button>
            </Link>
          </div>
          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="p-2"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </nav>
      </div>
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-2">
            <Link to="/item-analysis">
              <Button variant="ghost" className="w-full text-left">
                Item Analysis
              </Button>
            </Link>
            <Link to="/build-analysis">
              <Button variant="ghost" className="w-full text-left">
                Build Analysis
              </Button>
            </Link>
            <Link to="/hero-stats">
              <Button variant="ghost" className="w-full text-left">
                Hero Stats
              </Button>
            </Link>
            <Link to="/hero-comb-stats">
              <Button variant="ghost" className="w-full text-left">
                Hero Comb Stats
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
