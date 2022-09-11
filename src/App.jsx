import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

import MonacoEditor from './components/MonacoEditor'
import SimpleWebIDE from './components/MonacoEditor/SimpleWebIDE'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
     {/* <MonacoEditor height={900} value={'<h1>Hello, Monaco Editor</h1>'} /> */}
     <SimpleWebIDE/>
    </div>
  )
}

export default App
