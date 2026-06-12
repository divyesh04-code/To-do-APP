import './style/App.css'
import NavBar from './components/NavBar'
import { Route, Routes } from 'react-router-dom'
import AddTask from './components/AddTask'
import List from './components/List'
import UpdateTask from './components/UpdateTask'

function App() {

  return (
    <>
    <NavBar />
    <Routes>
      <Route path='/' element={<List />} />
      <Route path='/add' element={<AddTask />} />
      <Route path='/update/:id' element={<UpdateTask />} />
    </Routes>
    </>
  )
}

export default App
