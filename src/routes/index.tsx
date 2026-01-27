import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="text-center">
      Welcome to Abdelrahman GraphQL
      <Link to='/login' className='color-black-400 block'>
        Login
      </Link>
    </div>
  )
}
