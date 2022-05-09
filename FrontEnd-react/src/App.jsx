import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/private/Home'
import Transactions from './pages/private/Transactions'
import Savings from './pages/private/Savings'
import Profile from './pages/private/Profile'
import Create from './pages/private/Create'

import PrivateRoute from './components/PrivateRoute'

import Login from './pages/public/Login'
import Register from './pages/public/Register'

import Dashboard from './pages/private/Dashboard'
import Edit from './pages/private/Edit'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
      
        <Route path="/" element={<PrivateRoute> <Dashboard /> </PrivateRoute>}  >
          <Route index element={<Home />} />
          <Route path='transactions' element={<Transactions />} />
          <Route path='savings' element={<Savings />} />
          <Route path='profile' element={<Profile />} />
          <Route path='create/:type' element={<Create />} />
          <Route path='edit/:type/:id' element={<Edit />} />
        </Route>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
