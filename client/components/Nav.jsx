import { useAuth0 } from '@auth0/auth0-react'
import { Link } from 'react-router-dom'
// import { Auth } from 'aws-amplify/auth'
import { signOut, getCurrentUser } from 'aws-amplify/auth'

import { useState, useEffect } from 'react'

export default function Nav() {
  const [isAuthenticated, setIsAuthenticated] = useState()

  useEffect(() => {
    checkAuthentication()
  }, [])

  async function checkAuthentication() {
    try {
      await getCurrentUser()
      setIsAuthenticated(true)
    } catch (error) {
      setIsAuthenticated(false)
    }
  }

  async function handleLogout() {
    try {
      await signOut()
      setIsAuthenticated(false)
    } catch (error) {
      console.log('error signing out: ', error)
    }
  }

  return (
    <>
      <nav className="fixed top-0 mx-auto w-full h-13 flex justify-between bg-[#FFFBF5] z-10">
        <div className="flex items-center">
          <Link to="/">
            <img
              className="w-14 m-4 animate-spin"
              src="/images/brand.png"
              alt="nav-brand-donut"
            />
          </Link>
          <Link to="/">
            <button className="ml-1 text-2xl hover:underline nav">
              Tiff&apos;s Donuts
            </button>
          </Link>
        </div>

        {!isAuthenticated ? (
          <Link to="/auth">
            <button className=" mr-8 text-[#E96B5E]  hover:underline text-xl nav">
              Login
            </button>
          </Link>
        ) : (
          <div className="flex items-center">
            <Link to="/me">
              <button className="mr-5 text-2xl hover:underline nav">
                View your donuts
              </button>
            </Link>
            <button
              className=" px-3 py-2 bg-[#b6b6b6]  hover:bg-sky-300 rounded-full text-white mr-20 text-2xl nav"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </>
  )
}
