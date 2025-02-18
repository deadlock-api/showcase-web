import { Button } from "@/components/ui/button";
import { Link } from "@remix-run/react";
import { useState } from "react";

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
          <div className="hidden lg:flex items-center gap-4">
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
            <Link to="/networth-winrate-stats">
              <Button variant="ghost">Networth Winrate Stats</Button>
            </Link>
            <Link to="/chat-with-db">
              <Button variant="ghost">Chat with Database</Button>
            </Link>
          </div>
          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="p-2"
              type="button"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Menu</title>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>
      </div>
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
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
            <Link to="/networth-winrate-stats">
              <Button variant="ghost" className="w-full text-left">
                Networth Winrate Stats
              </Button>
            </Link>
            <Link to="/chat-with-db">
              <Button variant="ghost" className="w-full text-left">
                Chat with Database
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
