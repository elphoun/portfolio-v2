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
        'snap-start snap-always flex-shrink-0 w-full h-screen flex flex-col items-center justify-center px-[max(150px,15%)]',
        className
      )}
    >
      {children}
    </section>
  )
}
