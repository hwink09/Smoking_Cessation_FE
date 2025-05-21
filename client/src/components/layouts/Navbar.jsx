"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Link } from "react-router-dom"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
              EXHELA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
          <Link href="#services" className="text-white/80 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="#services" className="text-white/80 hover:text-white transition-colors">
              Services
            </Link>
            <Link href="#process" className="text-white/80 hover:text-white transition-colors">
              Process
            </Link>
            <Link href="#pricing" className="text-white/80 hover:text-white transition-colors">
              Premium
            </Link>
            <Link href="#testimonials" className="text-white/80 hover:text-white transition-colors">
              Testimonials
            </Link>
            <Link
              href="#contact"
              className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 transition-all"
            >
              Contact Us
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 flex flex-col space-y-4">
            <Link
              href="#services"
              className="text-white/80 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="#process"
              className="text-white/80 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Process
            </Link>
            <Link
              href="#pricing"
              className="text-white/80 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="#testimonials"
              className="text-white/80 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonials
            </Link>
            <Link
              href="#contact"
              className="px-4 py-2 w-fit rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
