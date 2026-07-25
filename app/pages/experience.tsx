import { SectionContainer } from '../components/section-container'
import { AnimatedSvg } from '../components/home-hero-draw'
import { ExperienceGallery } from '../components/experience-gallery'
import { Fredericka_the_Great } from "next/font/google"

const fredericka = Fredericka_the_Great({ subsets: ['latin'], weight: ['400'], adjustFontFallback: false })

const experiences = [
    {
        company: 'faire',
        roles: ['SWE Intern'],
        logo: '/experience/faire-logo.svg',
        linkedin: 'https://ca.linkedin.com/company/fairewholesale',
        priority: 3,
    },
    {
        company: 'chatime',
        roles: ['Tearista'],
        logo: '/experience/chatime-logo.png',
        linkedin: 'https://www.linkedin.com/company/chatime/',
        priority: 1,
    },
    {
        company: 'UW DSC',
        roles: ['President', "Advisor", "SWE"],
        logo: '/experience/dsc-logo.svg',
        linkedin: 'https://www.linkedin.com/company/waterloo-data-science-club/',
        priority: 1,
    },
    {
        company: 'cxc hackathon',
        roles: ['Director'],
        logo: '/experience/cxc-logo.svg',
        linkedin: 'https://www.linkedin.com/company/cxc-global',
        priority: 2,
    },
    {
        company: 'Hack the 6ix',
        roles: ['Ops Director', 'Ops Exec'],
        logo: '/experience/ht6.jpg',
        linkedin: 'https://ca.linkedin.com/company/hackthe6ixofficial',
        priority: 2,
    },
    {
        company: 'ETB',
        roles: ['SWE Intern'],
        logo: '/experience/etb-logo.svg',
        linkedin: 'https://www.linkedin.com/search/results/all/?keywords=Enter%20the%20Battlefield',
        priority: 2,
    },
]

export const ExperiencePage = () => (
    <SectionContainer id="experience">
        <div className="blackboard relative flex w-full max-w-6xl h-full max-h-[80vh] lg:max-h-[70vh] flex-col lg:flex-row overflow-hidden border-8 md:border-[16px] lg:border-[22px] border-[#724B24] gap-4 md:gap-8 lg:gap-12 p-4 md:p-5 lg:p-6 text-white lowercase">
            <div className="flex flex-col w-full lg:h-full min-h-0 gap-4 md:gap-6 lg:gap-8">
                <h1 className={`${fredericka.className} leading-none text-[#FAEED6] text-[clamp(2.25rem,6vw,6rem)]`}>
                    Experience
                </h1>
                <ExperienceGallery experiences={experiences} />
            </div>
            <div className='relative w-full flex-1 min-h-[35vh] lg:flex-initial lg:min-h-0 lg:w-2/3 lg:h-full'>
                <AnimatedSvg
                    src='/assets/machine.svg'
                    className='absolute left-1/2 top-1/2 w-[80%] max-w-[34rem] h-auto'
                    style={{ transform: 'translate(-50%, -50%) rotate(-12deg)' }}
                    duration={1200}
                    delayStep={0}
                    autoplay={false}
                    delayOnDesktopOnly={true}
                />
                <AnimatedSvg
                    src='/assets/purple_cogfly.svg'
                    className='absolute top-[4%] right-[4%] w-[34%] max-w-[12rem] h-auto'
                    style={{ transform: 'rotate(20deg)' }}
                    duration={1200}
                    delayStep={0}
                    autoplay={false}
                    delayOnDesktopOnly={true}
                />
                <AnimatedSvg
                    src='/assets/red_cogfly.svg'
                    className='absolute bottom-[4%] left-[4%] w-[38%] max-w-[14rem] h-auto'
                    style={{ transform: 'scaleX(-1) rotate(-12deg)' }}
                    duration={1200}
                    delayStep={0}
                    autoplay={false}
                    delayOnDesktopOnly={true}
                />
            </div>
        </div>
    </SectionContainer>
)
