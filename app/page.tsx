import { HomePage } from './pages/homepage'
import { ExperiencePage } from './pages/experience'
// Temporarily hidden — keep the files, just don't render it.
// import { GamesPage } from './pages/games'

export default function Page() {
  return (
    <div className='h-full w-full select-none'>
      <HomePage />
      <ExperiencePage />
      {/* <GamesPage /> */}
    </div>
  )
}
