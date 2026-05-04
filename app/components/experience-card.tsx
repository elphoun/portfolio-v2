'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Caveat } from 'next/font/google'

const caveat = Caveat({ subsets: ['latin'], weight: ['400', '700'] })

type ExperienceCardProps = {
  company: string
  role: string
  detail: string
  logo: string
  className: string
}

export const ExperienceCard = ({ company, role, detail, logo, className }: ExperienceCardProps) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`absolute flex items-center justify-center overflow-hidden rounded-lg bg-white/5 h-auto -translate-y-0.5 transition-all duration-300 cursor-pointer group ${className}`}
      style={{
        boxShadow: isHovered 
          ? '0 8px 32px rgba(255, 255, 255, 0.2), 0 0 20px rgba(255, 255, 255, 0.1)' 
          : '0 4px 16px rgba(255, 255, 255, 0.08), 0 0 12px rgba(255, 255, 255, 0.04)',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div className={`transition-all duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
        <Image 
          src={logo} 
          alt={`${company} logo`} 
          width={64} 
          height={64} 
          className="h-full w-full object-contain p-2" 
        />
      </div>

      {/* Hover Info */}
      <div 
        className={`absolute inset-0 flex flex-col items-center justify-center p-3 text-center transition-all duration-300 rounded-lg ${
          isHovered ? 'opacity-100' : 'opacity-0'
        } ${caveat.className}`}
        style={{
          background: isHovered 
            ? 'rgba(0, 0, 0, 0.3)'
            : 'transparent',
        }}
      >
        <h3 className="text-white/90 font-bold text-sm leading-tight drop-shadow-sm">{company}</h3>
        <p className="text-white/70 text-xs mt-1 drop-shadow-sm">{role}</p>
        <p className="text-white/60 text-xs mt-1 drop-shadow-sm">{detail}</p>
      </div>
    </div>
  )
}
