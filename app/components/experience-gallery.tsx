'use client'

import LightGallery from 'lightgallery/react/Lightgallery.es5.js'
import lgThumbnail from 'lightgallery/plugins/thumbnail/lg-thumbnail.es5.js'
import lgZoom from 'lightgallery/plugins/zoom/lg-zoom.es5.js'
import { ExperienceCard } from './experience-card'

type ExperienceItem = {
  company: string
  role: string
  logo: string
  linkedin: string
  priority?: number
}

type ExperienceGalleryProps = {
  experiences: ExperienceItem[]
}

export const ExperienceGallery = ({ experiences }: ExperienceGalleryProps) => {
  return (
    <LightGallery
      plugins={[lgThumbnail, lgZoom]}
      speed={500}
      elementClassNames="grid w-full flex-1 grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-4 lg:auto-rows-[7.5rem] lg:gap-4"
    >
      {experiences.map((item) => (
        <ExperienceCard
          key={item.company}
          {...item}
        />
      ))}
    </LightGallery>
  )
}