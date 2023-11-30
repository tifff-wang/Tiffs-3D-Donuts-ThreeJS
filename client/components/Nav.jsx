import { Link } from 'react-router-dom'
// import { Auth } from 'aws-amplify/auth'
import { signOut } from 'aws-amplify/auth'

export default function Nav(props) {
  const { isAuthenticated, updateAuthentication } = props

  async function handleLogout() {
    try {
      await signOut()
      updateAuthentication(false)
    } catch (error) {
      console.log('error signing out: ', error)
    }
  }

  return (
    <>
      <nav className="fixed top-0 mx-auto w-full h-13 flex justify-between items-center bg-[#FFFBF5] z-10">
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
            <button className="mr-11 text-[#E96B5E]  hover:underline text-xl nav">
              Login
            </button>
          </Link>
        ) : (
          <div className="flex items-center">
            <Link to="/me">
              <button className="mr-11 text-[#444140]  hover:underline text-xl nav">
                View your donuts
              </button>
            </Link>
            <button
              className="mr-11 text-[#f0a122]  hover:underline text-xl nav"
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
