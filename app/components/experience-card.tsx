import Image from 'next/image'
import Link from 'next/link'
import { Caveat } from 'next/font/google'

const caveat = Caveat({ subsets: ['latin'], weight: ['400', '700'] })

type ExperienceCardProps = {
  company: string
  role: string
  detail: string
  logo: string
  href?: string
}

export const ExperienceCard = ({ company, role, detail, logo, href = '#' }: ExperienceCardProps) => {
  return (
    <Link href={href}>
      <div
        className="flex h-auto justify-center items-center gap-3 md:gap-4 overflow-hidden rounded-lg border-2 md:border-3 border-white/10 bg-white/10 px-3 md:px-4 py-2 md:py-3 text-white shadow-[0_2px_8px_rgba(255,255,255,0.08),0_0_12px_rgba(255,255,255,0.04)] backdrop-blur-sm transition-transform duration-300 hover:scale-105 hover:border-white/30 cursor-pointer min-w-fit"
      >
        <div className="flex h-14 md:h-20 w-14 md:w-20 shrink-0 items-center justify-center rounded-md">
          <Image
            src={logo}
            alt={`${company} logo`}
            width={56}
            height={56}
            className="h-full w-full object-contain"
          />
        </div>

        <div className={`min-w-0 hidden lg:flex flex-col ${caveat.className}`}>
          <h3 className="truncate text-lg md:text-xl font-bold leading-tight text-white/90">{company}</h3>
          <p className="truncate text-sm md:text-base leading-tight text-white/75">{role}</p>
          <p className="text-sm md:text-base leading-snug text-white/60">{detail}</p>
        </div>
      </div>
    </Link>
  )
}
