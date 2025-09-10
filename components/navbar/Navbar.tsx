import React from 'react'
import { Button } from '../ui/button'

const Navbar = () => {
  return (
    <nav className="bg-white text-white-foreground shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold text-primary hover:text-primary-hover transition-colors duration-300 cursor-pointer">
          Kamovie
        </div>

        {/* Right Side */}
        <div>
          <Button className="px-4 py-2 bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg transition-colors duration-300">
            Sign In
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
