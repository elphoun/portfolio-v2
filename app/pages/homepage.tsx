import { SectionContainer } from "../components/section-container"
import Image from "next/image"
import { Fredericka_the_Great } from "next/font/google"
import Link from "next/link"
import { CircleIcon } from "@/components/icons"
import { AnimatedSvg } from "../components/home-hero-draw"

const fredericka = Fredericka_the_Great({ subsets: ['latin'], weight: ['400'], adjustFontFallback: false })

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

export const HomePage = () => (
    <SectionContainer id="home">
        <div className="flex w-full flex-col lg:flex-row items-center justify-center gap-10 md:gap-18 px-4 md:px-0">
            <div className="flex flex-col gap-6">
                <h1 className={`${fredericka.className} text-7xl leading-none text-[#FAEED6]`}>
                    Michael
                    <br />
                    Zhang
                </h1>
                <div className="flex flex-row w-fit justify-center items-center gap-2 md:gap-3 text-[#1D1712]">
                    {socials.map((social, index) => (
                        <div key={social.href} className="flex items-center gap-2 md:gap-3">
                            <Link href={social.href} aria-label={social.name}>
                                <Image
                                    src={social.icon}
                                    alt={social.name}
                                    width={32}
                                    height={32}
                                    className="h-5 w-5 md:h-6 md:w-6 lg:h-8 lg:w-8"
                                />
                            </Link>
                            {index < socials.length - 1 ? <CircleIcon size={4} fill="#000000" /> : null}
                        </div>
                    ))}
                </div>
            </div>
            <AnimatedSvg className="w-full max-w-xs md:max-w-sm lg:max-w-60 xl:max-w-[450px]" autoplay={false} />
        </div>
    </SectionContainer>
)
