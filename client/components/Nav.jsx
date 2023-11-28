import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

export default function Nav() {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  function handleLogin() {
    loginWithRedirect({ redirectUri: `${window.location.origin}` });
  }

  function handleLogout() {
    logout({ returnTo: `${window.location.origin}` });
  }

  return (
    <>
      <nav className="fixed top-0 mx-auto w-full h-13 flex justify-between items-center bg-[#f5f5f5] z-10">
        <div className="flex items-center">
          <Link to="/">
            <img
              className="w-14 m-4 animate-spin"
              src="/images/brand.png"
              alt="nav-brand-donut"
            />
          </Link>
          <Link to="/">
            <button className="ml-1 text-2xl hover:underline nav">Home</button>
          </Link>
        </div>

        {!isAuthenticated ? (
          <button
            className="mt-3 px-3 py-2 bg-[#CC3968]  hover:bg-red-400 rounded-full text-white mr-8 text-2xl nav"
            onClick={handleLogin}
          >
            Login
          </button>
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
  );
}
