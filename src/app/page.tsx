'use client'

import { useState, useEffect } from 'react'
import Header from './(public)/landing/components/Header/Header'
import EcommercePage from './(public)/landing/components/EcommercePage/EcommercePage'
import Footer from './(public)/landing/components/Footer/Footer'
import ScrollToTopButton from './(public)/landing/components/ScrollToTopButton/ScrollToTopButton'
import CartModal from './(public)/landing/components/CartModal/CartModal'
import "flag-icons/css/flag-icons.min.css";
import WhatsAppButton from './(public)/landing/components/WhatsAppButton/WhatsAppButton'

export default function LandingPage() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen)
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <Header onCartClick={handleCartToggle} />
      <main className="container mx-auto px-4 py-8">
        <EcommercePage />
      </main>
      {/* <Footer /> */}
      <WhatsAppButton />
      <ScrollToTopButton show={showScrollTop} />
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  )
}