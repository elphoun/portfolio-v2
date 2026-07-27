import { HomePage } from './pages/homepage'
import { ExperiencePage } from './pages/experience'
import { GamesPage } from './pages/games'

export default function Page() {
  return (
    <div className='h-full w-full select-none'>
      <HomePage />
      <ExperiencePage />
      <GamesPage />
    </div>
  )
}
