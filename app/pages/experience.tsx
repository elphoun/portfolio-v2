import { SectionContainer } from '../components/section-container'
import { AnimatedSvg } from '../components/home-hero-draw'
import { ExperienceGallery } from '../components/experience-gallery'
import { Fredericka_the_Great } from "next/font/google"

const fredericka = Fredericka_the_Great({ subsets: ['latin'], weight: ['400'], adjustFontFallback: false })

const experiences = [
    {
        company: 'Faire',
        role: 'SWE Intern',
        logo: '/experience/faire-logo.svg',
        linkedin: 'https://ca.linkedin.com/company/fairewholesale',
        priority: 3,
    },
    {
        company: 'Chatime',
        role: 'Tearista',
        logo: '/experience/chatime-logo.png',
        linkedin: 'https://www.linkedin.com/company/chatime/',
        priority: 1,
    },
    {
        company: 'UW DSC',
        role: 'SWE',
        logo: '/experience/dsc-logo.svg',
        linkedin: 'https://www.linkedin.com/company/waterloo-data-science-club/',
        priority: 1,
    },
    {
        company: 'CXC 2026',
        role: 'Director',
        logo: '/experience/cxc-logo.svg',
        linkedin: 'https://www.linkedin.com/company/cxc-global',
        priority: 2,
    },
    {
        company: 'Hack the 6ix 2026',
        role: 'Operations',
        logo: '/experience/ht6.jpg',
        linkedin: 'https://ca.linkedin.com/company/hackthe6ixofficial',
        priority: 2,
    },
    {
        company: 'Enter the Battlefield',
        role: 'SWE Intern',
        logo: '/experience/etb-logo.svg',
        linkedin: 'https://www.linkedin.com/search/results/all/?keywords=Enter%20the%20Battlefield',
        priority: 2,
    },
]

export const ExperiencePage = () => (
    <SectionContainer id="experience">
        <div className="blackboard relative flex w-full flex-col lg:flex-row overflow-hidden rounded-2xl md:rounded-[34px] lg:rounded-[50px] border-4 md:border-[10px] lg:border-[15px] border-[#724B24] gap-4 md:gap-8 lg:gap-12 p-4 md:p-5 lg:p-6 text-white h-full">
            <div className="flex flex-col w-full gap-5 md:gap-8">
                <h1 className={`${fredericka.className} text-4xl md:text-6xl lg:text-8xl leading-none text-[#FAEED6]`}>
                    Experience
                </h1>
                <ExperienceGallery experiences={experiences} />
            </div>
            <div className='w-full lg:w-2/3 h-full relative'>
                <AnimatedSvg
                    src='/assets/machine.svg'
                    className='absolute bottom-[min(20%,150px)] right-[min(20%,100px)] w-68 lg:w-92 h-auto'
                    style={{ transform: 'rotate(-12deg)' }}
                    duration={1200}
                    delayStep={0}
                    autoplay={false}
                    delayOnDesktopOnly={true}
                />
                <AnimatedSvg
                    src='/assets/red_cogfly.svg'
                    className='absolute bottom-[min(5%,10px)] right-[min(5%,10px)] -scale-x-100 w-28 lg:w-36 h-auto'
                    style={{ transform: 'rotate(-12deg)' }}
                    duration={1200}
                    delayStep={0}
                    autoplay={false}
                    delayOnDesktopOnly={true}
                />
                <AnimatedSvg
                    src='/assets/purple_cogfly.svg'
                    className='absolute top-[max(10%,10px)] right-[min(5%,2px)] w-24 lg:w-32 h-auto'
                    style={{ transform: 'rotate(20deg)' }}
                    duration={1200}
                    delayStep={0}
                    autoplay={false}
                    delayOnDesktopOnly={true}
                />
            </div>
        </div>
    </SectionContainer>
)
