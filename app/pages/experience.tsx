import { SectionContainer } from '../components/section-container'
import { AnimatedSvg } from '../components/home-hero-draw'
import { ExperienceCard } from '../components/experience-card'
import { Fredericka_the_Great } from "next/font/google"

const fredericka = Fredericka_the_Great({ subsets: ['latin'], weight: ['400'] })

const experiences = [
    {
        company: 'Faire',
        role: 'Software Engineer Intern',
        detail: 'Incoming',
        logo: '/experience/faire-logo.svg',
        className: 'w-48 -rotate-6 top-40 left-14',
    },
    {
        company: 'Enter the Battlefield',
        role: 'Software Engineer Intern',
        detail: 'TCG order workflow and store credit system',
        logo: '/experience/etb-logo.svg',
        className: 'w-36 rotate-20 top-40 left-[max(30%,20px)]',
    },
    {
        company: 'CXC 2026',
        role: 'Lead Director',
        detail: 'Community x Computing Conference',
        logo: '/experience/cxc-logo.svg',
        className: 'w-32 rotate-[10deg] bottom-20 left-[max(33%,20px)]',
    },
    {
        company: 'UW DSC',
        role: 'Software Engineer',
        detail: 'Developer Student Clubs projects',
        logo: '/experience/dsc-logo.svg',
        className: 'w-32 rotate-[-8deg] bottom-10 left-[max(4%,20px)]',
    },
    {
        company: 'Chatime',
        role: 'Tearista',
        detail: 'Customer-facing operations and support',
        logo: '/experience/chatime-logo.png',
        className: 'w-28 rotate--12 bottom-12 left-[max(20%,20px)]',
    },
]

export const ExperiencePage = () => (
    <SectionContainer id="experience">
        <div className="blackboard relative flex w-full flex-col overflow-hidden rounded-[34px] border-[10px] border-[#724B24] p-4 text-white md:rounded-[50px] md:border-[15px] h-full md:p-5">
            <h1 className={`${fredericka.className} left-5 top-5 absolute text-8xl leading-none text-[#FAEED6]`}>
                Experience
            </h1>
            {experiences.map((item) => (
                <ExperienceCard key={item.company} {...item} />
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
)
