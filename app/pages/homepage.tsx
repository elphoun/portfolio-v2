import { SectionContainer } from "../components/section-container"
import Image from "next/image"
import { Fredericka_the_Great } from "next/font/google"
import Link from "next/link"
import { CircleIcon } from "@/components/icons"
import { AnimatedSvg } from "../components/animated-svg"

const fredericka = Fredericka_the_Great({ subsets: ['latin'], weight: ['400'], adjustFontFallback: false })

const socials = [
    {
        name: 'LinkedIn',
        href: 'https://www.linkedin.com/in/fangjing-michael-zhang/',
        icon: '/socials/linkedin.png',
    },
    {
        name: 'GitHub',
        href: 'https://github.com/elphoun',
        icon: '/socials/github.svg',
    },
    {
        name: 'Instagram',
        href: 'https://www.instagram.com/kale.m.zh',
        icon: '/socials/instagram.svg',
    },
    {
        name: 'Spotify',
        href: 'https://open.spotify.com/user/2qhjj8wzcdif3odeyivfrre85?si=b946bc09e69d4c26',
        icon: '/socials/spotify.svg',
    },
]

export const HomePage = () => (
    <SectionContainer id="home">
        <div className="flex w-full flex-col lg:flex-row items-center justify-center gap-8 sm:gap-10 md:gap-14 lg:gap-16 xl:gap-20 px-4 md:px-0">
            <div className="flex flex-col items-center lg:items-start gap-5 md:gap-6">
                <h1 className={`${fredericka.className} text-center lg:text-left leading-none text-[clamp(2.5rem,6vw,4.5rem)]`}>
                    Michael
                    <br />
                    Zhang
                </h1>
                <div className="flex flex-row w-fit justify-center items-center gap-2 md:gap-3">
                    {socials.map((social, index) => (
                        <div key={social.href} className="flex items-center gap-2 md:gap-3">
                            <Link href={social.href} target="_blank" aria-label={social.name}>
                                <Image
                                    src={social.icon}
                                    alt={social.name}
                                    width={32}
                                    height={32}
                                    className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8"
                                />
                            </Link>
                            {index < socials.length - 1 ? <CircleIcon size={4} fill="#FAEED6" /> : null}
                        </div>
                    ))}
                </div>
            </div>
            <AnimatedSvg className="w-full max-w-[12rem] sm:max-w-[14rem] md:max-w-[16rem] lg:max-w-[18rem] xl:max-w-[20rem] 2xl:max-w-[22rem]" autoplay={false} />
        </div>
    </SectionContainer>
)
