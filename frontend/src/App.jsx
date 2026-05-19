import { router } from './app.routes.jsx'
import { AuthProvider } from './features/auth/auth.context.jsx'
import { InterviewProvider } from './features/interview/interview.context.jsx'
import './style.scss'
import { RouterProvider } from 'react-router'


function App() {

  return (
    <>
    <AuthProvider>
      <InterviewProvider>
        <RouterProvider router={router}/>
      </InterviewProvider>
    </AuthProvider>
    </>
  )
}

export default App
