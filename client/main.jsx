import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/input.css'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import Donut from './pages/Donut.jsx'
import DonutList from './pages/DonutList.jsx'
import Authentication from './pages/Authentication.jsx'

export const routes = createRoutesFromElements(
  <Route path={'/'} element={<App />}>
    <Route index element={<Donut />} />
    <Route path={'/auth'} element={<Authentication />} />
    <Route path={'/me'} element={<DonutList />} />
  </Route>
)

const router = createBrowserRouter(routes)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
