import Image from 'next/image'
import Link from 'next/link'
import { Fredericka_the_Great, Alkatra, Oregano } from 'next/font/google'
import { SectionContainer } from '@/app/components/section-container'
import { AnimatedSvg } from '@/app/components/home-hero-draw'
import { CircleIcon } from '@/components/icons/material-symbols-circle'

const fredericka = Fredericka_the_Great({ subsets: ['latin'], weight: ['400'] })
const alkatra = Alkatra({ subsets: ['latin'], weight: ['400'] })
const oregano = Oregano({ subsets: ['latin'], weight: ['400'], style: ['italic'] })

// Fixed grid positions for blackboard (3x3 grid)
const gridPositions = [
  { top: '10%', left: '10%' },
  { top: '10%', left: '50%' },
  { top: '10%', right: '10%' },
  { top: '45%', left: '10%' },
  { top: '45%', left: '50%' },
  { top: '45%', right: '10%' },
  { top: '75%', left: '10%' },
  { top: '75%', left: '50%' },
  { top: '75%', right: '10%' },
]

const socials = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/michael-zhang-',
    icon: '/socials/linkedin.png',
  },
  {
    name: 'GitHub',
    href: 'https://github.com/michael-zhang-',
    icon: '/socials/github.svg',
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/michael-zhang-',
    icon: '/socials/instagram.svg',
  },
  {
    name: 'Discord',
    href: 'https://discord.com/users/michael-zhang-',
    icon: '/socials/discord.svg',
  },
  {
    name: 'Spotify',
    href: 'https://open.spotify.com/user/michael-zhang-',
    icon: '/socials/spotify.svg',
  },
]

const experiences = [
  {
    company: 'Faire',
    role: 'Software Engineer Intern',
    detail: 'Incoming',
    logo: '/experience/faire-logo.svg',
    className: 'w-60 -rotate-6 top-10 left-10',
  },
  {
    company: 'CXC 2026',
    role: 'Lead Director',
    detail: 'Community x Computing Conference',
    logo: '/experience/cxc-logo.svg',
    className: 'w-32 rotate-[10deg] bottom-40 left-[max(27%,20px)]',
  },
  {
    company: 'Enter the Battlefield',
    role: 'Software Engineer Intern',
    detail: 'TCG order workflow and store credit system',
    logo: '/experience/etb-logo.svg',
    className: 'w-36 rotate-20 top-20 left-[max(30%,20px)]',
  },
  {
    company: 'UW DSC',
    role: 'Software Engineer',
    detail: 'Developer Student Clubs projects',
    logo: '/experience/dsc-logo.svg',
    className: 'w-32 rotate-[-8deg] bottom-28 left-[max(4%,20px)]',
  },
  {
    company: 'Chatime',
    role: 'Tearista',
    detail: 'Customer-facing operations and support',
    logo: '/experience/chatime-logo.png',
    className: 'w-20 rotate--12 bottom-12 left-[max(20%,20px)]',
  },
]

export default function Page() {
  return (
    <div className='h-full w-full select-none'>
      <SectionContainer id="home">
        <div className="flex w-full flex-row items-center justify-center gap-8">
          <div className="space-y-8">
            <h1 className={`${fredericka.className} text-[72px] leading-none text-[#FAEED6] md:text-[96px]`}>
              Michael
              <br />
              Zhang
            </h1>
            <div className="flex flex-row w-fit justify-center items-center gap-3 text-[#1D1712]">
              {socials.map((social, index) => (
                <div key={social.href} className="flex items-center gap-3">
                  <Link href={social.href} aria-label={social.name}>
                    <Image
                      src={social.icon}
                      alt={social.name}
                      width={32}
                      height={32}
                      className="h-8 w-8"
                    />
                  </Link>
                  {index < socials.length - 1 ? <CircleIcon size={5} fill="#000000" /> : null}
                </div>
              ))}
            </div>
          </div>
          <AnimatedSvg />
        </div>
      </SectionContainer>

      <SectionContainer id="experience" className="px-4 md:px-0">
        <div className="blackboard relative flex h-auto w-full max-w-[1140px] flex-col overflow-hidden rounded-[34px] border-[10px] border-[#724B24] p-4 text-white md:h-[575px] md:rounded-[50px] md:border-[15px] md:p-5">
          {experiences.map((item) => (
            <div
              key={item.company}
              className={`absolute flex items-center justify-center overflow-hidden rounded-lg bg-white/5 h-auto -translate-y-0.5 ${item.className}`}
            >
              <Image src={item.logo} alt={`${item.company} logo`} width={64} height={64} className="h-full w-full object-contain p-2" />
            </div>
          ))}
          <AnimatedSvg
            src='/assets/machine.svg'
            className='absolute top-[max(20%,20px)] right-[max(15%,30px)] w-96 h-auto'
            style={{ transform: 'rotate(-12deg)' }}
            duration={1200}
            delayStep={20}
            autoplay={true}
          />
          <AnimatedSvg
            src='/assets/red_cogfly.svg'
            className='absolute bottom-[max(8%,20px)] right-[max(5%,30px)] -scale-x-100 w-36 h-auto'
            style={{ transform: 'rotate(-12deg)' }}
            duration={1200}
            delayStep={20}
            autoplay={true}
          />
          <AnimatedSvg
            src='/assets/purple_cogfly.svg'
            className='absolute top-[max(20%,20px)] right-[max(5%,30px)] w-32 h-auto'
            style={{ transform: 'rotate(20deg)' }}
            duration={1200}
            delayStep={20}
            autoplay={true}
          />
        </div>
      </SectionContainer>

      <SectionContainer id="projects">
        <div className="flex flex-col h-[560px] w-full items-center justify-center overflow-hidden rounded-[50px]">
          <AnimatedSvg src={"/assets/plant.svg"} className="h-full" autoplay={true} />
        </div>
      </SectionContainer>

      <SectionContainer id="other">
        <div className="my-12 grid w-full items-center gap-8 rounded-[50px] p-5 md:grid-cols-[1fr_1.2fr]">
          <AnimatedSvg src="/assets/coffee.svg" className="mx-auto w-full max-w-[360px]" autoplay={true} />
          <div className={`${oregano.className} rounded-[20px] border border-black/25 bg-black/50 p-3`}>
            <Image src="/socials/spotify.svg" alt="Spotify" width={517} height={132} className="w-full rounded-[8px]" />
          </div>
        </div>
      </SectionContainer>
    </div>
  )
}
