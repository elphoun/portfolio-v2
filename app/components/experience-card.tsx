import Image from 'next/image'
import { Caveat } from 'next/font/google'

const caveat = Caveat({ subsets: ['latin'], weight: ['400', '700'] })

type ExperienceCardProps = {
  company: string
  role: string
  logo: string
  linkedin: string
  priority?: number
}

export const ExperienceCard = ({ company, role, logo, linkedin, priority = 0 }: ExperienceCardProps) => {
  const isLargeTile = priority >= 3
  const isWideTile = priority >= 2

  return (
    <a
      href={linkedin}
      target="_blank"
      rel="noreferrer noopener"
      onClickCapture={(event) => event.stopPropagation()}
      className={`group relative flex h-full min-h-32 items-center justify-center overflow-hidden rounded-lg border-2 md:border-3 border-white/10 bg-white/10 px-3 py-3 text-white shadow-[0_2px_8px_rgba(255,255,255,0.08),0_0_12px_rgba(255,255,255,0.04)] backdrop-blur-sm transition-transform duration-300 hover:scale-[1.03] hover:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAEED6]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1008] ${isWideTile ? 'md:col-span-2' : ''} ${isLargeTile ? 'md:row-span-2' : ''}`}
    >
      <div className={`flex shrink-0 items-center justify-center rounded-md transition-transform duration-300 group-hover:scale-95 ${isLargeTile ? 'h-16 w-16 md:h-28 md:w-28' : 'h-14 w-14 md:h-20 md:w-20'}`}>
        <Image
          src={logo}
          alt={`${company} logo`}
          width={56}
          height={56}
          className="h-full w-full object-contain"
        />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/45 to-transparent p-3 opacity-0 translate-y-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0">
        <div className={`flex min-w-0 flex-col ${caveat.className}`}>
          <h3 className="truncate text-base md:text-lg font-bold leading-tight text-white/95">{company}</h3>
          <p className="truncate text-sm md:text-base leading-tight text-white/80">{role}</p>
        </div>
      </div>
    </a>
  )
}
