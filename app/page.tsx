import { HomePage } from './pages/homepage'
import { ExperiencePage } from './pages/experience'
import { ProjectsPage } from './pages/projects'
import { OtherPage } from './pages/other'

export default function Page() {
  return (
    <div className='h-full w-full select-none'>
      <HomePage />
      <ExperiencePage />
      <ProjectsPage />
      <OtherPage />
    </div>
  )
}
