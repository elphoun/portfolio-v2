'use client'

import Image from 'next/image'
import { Kranky } from 'next/font/google'

const kranky = Kranky({ subsets: ['latin'], weight: ['400'] })

type ExperienceItem = {
  company: string
  roles: string[]
  logo: string
  linkedin: string
  priority?: number
}

type ExperienceGalleryProps = {
  experiences: ExperienceItem[]
}

export const ExperienceGallery = ({ experiences }: ExperienceGalleryProps) => {
  return (
    <ul className={`flex flex-1 min-h-0 flex-col ${kranky.className}`}>
      {experiences.map((item) => (
        <li key={item.company} className="flex flex-1 min-h-0 items-center">
          <div className="flex w-full items-center gap-3 border-b border-white/15 px-1 py-2 text-white last:border-b-0">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center md:h-9 md:w-9 lg:h-10 lg:w-10">
              <Image
                src={item.logo}
                alt={`${item.company} logo`}
                width={56}
                height={56}
                className="h-full w-full object-contain"
              />
            </span>

            <span className="min-w-0 shrink truncate text-base font-bold leading-none md:text-2xl lg:text-3xl">
              {item.company}
            </span>

            <span
              aria-hidden="true"
              className="mx-1 min-w-6 flex-1 self-center border-b-2 border-white/30"
            />

            <span className="flex shrink-0 flex-col items-end gap-1 text-right leading-none text-white">
              {item.roles.map((role) => (
                <span key={role} className="whitespace-nowrap text-xs md:text-sm lg:text-base">
                  {role}
                </span>
              ))}
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}
