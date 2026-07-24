import { ReactNode } from 'react'
import { cn } from '@/app/helpers'

type SectionContainerProps = {
  children: ReactNode
  className?: string
  id?: string
}

export function SectionContainer({ children, className, id }: SectionContainerProps) {
  return (
    <section
      id={id}
      className={cn(
        'snap-start snap-always flex-shrink-0 w-full h-screen flex flex-col items-center justify-center px-3 md:px-[max(30px,3%)] lg:px-[max(100px,10%)] py-3 md:py-[max(60px,3%)]',
        className
      )}
    >
      {children}
    </section>
  )
}
