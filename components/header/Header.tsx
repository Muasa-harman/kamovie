import React from 'react'

export default function Header() {
  return (
    <div className="bg-primary hover:bg-primary-hover text-primary-foreground text-center py-2 text-sm font-medium transition-colors duration-300">
      Welcome to Kamove | {" "} 
      <a
        href="tel:+254721456992"
        className="underline hover:text-white transition-colors"
      >
        Call
      </a>{" "}
      or{" "}
      <a
        href="https://wa.me/254721456992"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-white transition-colors"
      >
        WhatsApp
      </a>{" "}
      +254721456992 for enquiries
    </div>
  )
}


