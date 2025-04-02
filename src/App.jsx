import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Farmers from './Pages/Farmers'
import Product from './Pages/Pruducts'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/product' element={<Product />} />
          <Route path='/farmers' element={<Farmers />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App