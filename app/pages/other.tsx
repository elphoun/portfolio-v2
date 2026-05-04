import Image from 'next/image'
import { SectionContainer } from '../components/section-container'
import { AnimatedSvg } from '../components/home-hero-draw'
import { Oregano } from 'next/font/google'

const oregano = Oregano({ subsets: ['latin'], weight: ['400'], style: ['italic'] })

export const OtherPage = () => (
  <SectionContainer id="other">
    <div className="my-12 grid w-full items-center gap-8 rounded-[50px] p-5 md:grid-cols-[1fr_1.2fr]">
      <AnimatedSvg src="/assets/coffee.svg" className="mx-auto w-full max-w-[360px]" autoplay={true} />
      <div className={`${oregano.className} rounded-[20px] border border-black/25 bg-black/50 p-3`}>
        <Image src="/socials/spotify.svg" alt="Spotify" width={517} height={132} className="w-full rounded-[8px]" />
      </div>
    </div>
  </SectionContainer>
)
