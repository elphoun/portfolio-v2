import Image from 'next/image'
import { SectionContainer } from '../components/section-container'
import { AnimatedSvg } from '../components/home-hero-draw'
import { Fredericka_the_Great } from 'next/font/google'

const fredericka = Fredericka_the_Great({ subsets: ['latin'], weight: ['400'], adjustFontFallback: false })

const projectsData = {
  title: 'PROJECTS',
  viewLinkLabel: 'view',
  items: [
    {
      name: 'VGCimulator',
      desc: 'VGCimulator is a turn-by-turn VGC analysis tool, designed to easily turn your theoretical teams into practical ones!',
      tech: [
        'React',
        'TypeScript',
        'Azure',
        'TanStack Query',
        'GraphQL',
        'Zustand',
        'TailwindCSS',
      ],
      link: 'https://github.com/elphoun/Pokedex-Calculator',
      image: '/projects/vgcimulator.svg',
    },
    {
      name: 'Viennalytics',
      desc: 'Viennalytics is a stylized chess report and opening explorer!',
      tech: [
        'React',
        'TypeScript',
        'React Router',
        'Tailwind CSS',
        'Vercel Blob Storage',
        'TailwindCSS',
      ],
      link: 'https://github.com/elphoun/viennalytics',
      image: '/projects/viennalytics.svg',
    },
    {
      name: 'Duoslango',
      desc: 'Duoslango is an educational and entertaining web app designed to teach modern internet slang and memes.',
      tech: [
        'React',
        'JavaScript',
        'Python',
        'React Router',
        'Flask',
        'TailwindCSS',
      ],
      link: 'https://github.com/claireleu/Duoslango',
      image: '/projects/duoslango.svg',
    },
  ],
}

export const OtherPage = () => (
  <SectionContainer id="other">
    <div className="w-full h-full flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12 items-stretch">
      {/* Left Column - Coffee SVG */}
      <div className="w-full lg:w-1/3 flex flex-col items-center justify-around">
        <h1 className={`${fredericka.className} text-7xl text-center leading-none text-[#FAEED6]`}>
          PROJECTS
        </h1>
        <AnimatedSvg
          src="/assets/coffee.svg"
          className="w-full max-w-xs md:max-w-sm lg:max-w-full h-auto"
          autoplay={false}
          delayOnDesktopOnly={true}
        />
      </div>

      {/* Right Column - Projects with Background */}
      <div className="w-full lg:w-2/3 relative rounded-3xl overflow-hidden">
        <AnimatedSvg
          src="/assets/projectbackground.svg"
          className="absolute w-full -z-10 h-auto"
          autoplay={false}
          delayOnDesktopOnly={true}
        />
        {/* Content Overlay - Scrollable */}
        <div className="backdrop-blur-sm relative z-10 h-full overflow-y-auto scrollbar-thin p-6 md:p-8 lg:p-10 flex flex-col gap-6">
          {/* Projects List */}
          <div className="flex flex-col gap-6 md:gap-8">
            {projectsData.items.map((project) => (
              <div
                key={project.name}
                className="flex flex-col w-full h-full gap-4 relative border-b border-white/20 pb-6 last:border-b-0"
              >
                {/* Banner - Project Image */}
                {project.image && (
                  <div className="relative w-full h-32">
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      priority={false}
                    />
                  </div>
                )}

                {/* Title + Link on same row */}
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <h3 className="text-xl md:text-2xl font-semibold text-white/90">
                    {project.name}
                  </h3>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm md:text-base text-white/70 hover:text-white/90 transition-colors shrink-0 whitespace-nowrap"
                  >
                    {projectsData.viewLinkLabel} →
                  </a>
                </div>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tool) => (
                    <span
                      key={tool}
                      className="px-3 py-1 text-xs md:text-sm bg-white/10 border border-white/20 rounded-full text-white/80 hover:bg-white/15 transition-colors"
                    >
                      {tool}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-sm md:text-base text-white/70 leading-relaxed">
                  {project.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </SectionContainer>
)
