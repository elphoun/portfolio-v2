import { HomePage } from './pages/homepage'
import { ExperiencePage } from './pages/experience'

export default function Page() {
  return (
    <div className='h-full w-full select-none'>
      <HomePage />
      <ExperiencePage />
    </div>
  )
}
