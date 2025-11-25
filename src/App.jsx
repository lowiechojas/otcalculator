import { useState } from 'react'
import './index.css'
import RealTimeApp from './components/RealTimeApp'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <RealTimeApp />
    </>
  )
}

export default App
