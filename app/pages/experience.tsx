import { SectionContainer } from '../components/section-container'
import { AnimatedSvg } from '../components/home-hero-draw'
import { ExperienceCard } from '../components/experience-card'
import { Fredericka_the_Great } from "next/font/google"

const fredericka = Fredericka_the_Great({ subsets: ['latin'], weight: ['400'] })

const experiences = [
    {
        company: 'Chatime',
        role: 'Tearista',
        detail: '🧋 drinks !',
        logo: '/experience/chatime-logo.png',
    },
    {
        company: 'UW DSC',
        role: 'Software Engineer',
        detail: '♟️https://viennalytics.vercel.app/ and Event Coordinator',
        logo: '/experience/dsc-logo.svg',
    },
    {
        company: 'CXC 2026',
        role: 'Advisor and Previous Director',
        detail: `🖤 Directed and currently advising CXC, Waterloo's largest AI Hackathon`,
        logo: '/experience/cxc-logo.svg',
    },
    {
        company: 'Hack the 6ix 2026',
        role: 'Operations Executive',
        detail: `🌿 Organizing !`,
        logo: '/experience/ht6.jpg',
    },
    {
        company: 'Enter the Battlefield',
        role: 'Software Engineer Intern',
        detail: '🎮 TCG Order Picking and Store Credit System',
        logo: '/experience/etb-logo.svg',
    },
    {
        company: 'Faire',
        role: 'Software Engineer Intern',
        detail: '🍃 incoming s26',
        logo: '/experience/faire-logo.svg',
    },
]

export const ExperiencePage = () => (
    <SectionContainer id="experience">
        <div className="blackboard relative flex w-full flex-col lg:flex-row overflow-hidden rounded-2xl md:rounded-[34px] lg:rounded-[50px] border-4 md:border-[10px] lg:border-[15px] border-[#724B24] gap-4 md:gap-6 lg:gap-8 p-3 md:p-4 lg:p-5 text-white h-full">
            <div className="flex flex-col w-full gap-3 md:gap-4">
                <h1 className={`${fredericka.className} text-4xl md:text-6xl lg:text-8xl leading-none text-[#FAEED6]`}>
                    Experience
                </h1>
                <div className="flex flex-wrap-reverse items-center justify-center gap-2 md:gap-3 lg:gap-4 w-full flex-1">
                    {experiences.map((item) => (
                        <ExperienceCard key={item.company} {...item} />
                    ))}
                </div>
            </div>
            <div className='w-full lg:w-2/3 h-full relative'>
                <AnimatedSvg
                    src='/assets/machine.svg'
                    className='absolute bottom-[min(20%,150px)] right-[min(20%,100px)] w-72 lg:w-96 h-auto'
                    style={{ transform: 'rotate(-12deg)' }}
                    duration={1200}
                    delayStep={0}
                    autoplay={true}
                    delayOnDesktopOnly={true}
                />
                <AnimatedSvg
                    src='/assets/red_cogfly.svg'
                    className='absolute bottom-[min(5%,10px)] right-[min(5%,10px)] -scale-x-100 w-28 lg:w-36 h-auto'
                    style={{ transform: 'rotate(-12deg)' }}
                    duration={1200}
                    delayStep={0}
                    autoplay={true}
                    delayOnDesktopOnly={true}
                />
                <AnimatedSvg
                    src='/assets/purple_cogfly.svg'
                    className='absolute top-[max(10%,10px)] right-[min(5%,2px)] w-24 lg:w-32 h-auto'
                    style={{ transform: 'rotate(20deg)' }}
                    duration={1200}
                    delayStep={0}
                    autoplay={true}
                    delayOnDesktopOnly={true}
                />
            </div>
        </div>
    </SectionContainer>
)
