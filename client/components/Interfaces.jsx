import DonutForm from './DonutForm'
import DonutDetails from './DonutDetails'
import { Link } from 'react-router-dom'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { useLoader } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
import Footer from './Footer'
import { fetchBase, fetchGlaze } from '../api/apiClient.ts'
import { useSearchParams } from 'react-router-dom'
import SaveButton from './SaveButton'
import Nav from './Nav'
import { fetchAuthSession } from 'aws-amplify/auth'

const defaultBase = {
  id: 1,
  name: 'Original',
  color: '#e5e0cb',
}

const defaultGlaze = {
  id: 2,
  name: 'Strawberry',
  color: '#f57f8e',
  price: 9,
}

function Interfaces(props) {
  const heroRef = useRef(null)
  const detailRef = useRef(null)
  const { updateGlaze, updateBase, updateTexture } = props
  const [searchParams] = useSearchParams()
  const [selectedBase, setSelectedBase] = useState(defaultBase)
  const [selectedGlaze, setSelectedGlaze] = useState(defaultGlaze)
  const [withGold, setWithGold] = useState(false)
  const [coatMessage, setCoatMessage] = useState(false)
  const newTexture = useLoader(TextureLoader, 'gold.jpg')

  const [isAuthenticated, setIsAuthenticated] = useState()

  useEffect(() => {
    checkAuthentication()
  }, [])

  async function checkAuthentication() {
    try {
      await fetchAuthSession()
      setIsAuthenticated(true)
    } catch (error) {
      setIsAuthenticated(false)
    }
  }

  function updateAuthentication(state) {
    setIsAuthenticated(state)
  }

  function changeBase(choosenBase) {
    if (withGold) {
      return setCoatMessage(true)
    }
    setSelectedBase(choosenBase)
    updateBase(choosenBase.color)
  }

  function changeGlaze(choosenGlaze) {
    if (withGold) {
      return setCoatMessage(true)
    }
    setSelectedGlaze(choosenGlaze)
    updateGlaze(choosenGlaze.color)
  }

  function addGold() {
    updateGlaze('#FFFFFF')
    updateBase('#FFFFFF')
    updateTexture(newTexture)
    setWithGold(true)
  }

  function cancelGold() {
    updateBase(selectedBase.color)
    updateGlaze(selectedGlaze.color)
    updateTexture('')
    setWithGold(false)
    setCoatMessage(false)
  }

  useEffect(() => {
    // This can be set to use the provided hook by RR if we implement it
    const setDefaults = async () => {
      const searchGlaze = searchParams.get('glaze')
      const searchBase = searchParams.get('base')
      if (searchGlaze) {
        const glaze = await fetchGlaze(Number(searchGlaze))
        if (glaze) {
          changeGlaze(glaze)
        }
      }
      if (searchBase) {
        const base = await fetchBase(Number(searchBase))
        if (base) {
          changeBase(base)
        }
      }
    }

    try {
      void setDefaults()
    } catch (e) {
      alert('Could not set donut values')
    }
  }, [])

  function handleScroll(e, ref) {
    e.preventDefault()
    ref.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  function handleLogin() {}

  return (
    <>
      <div ref={heroRef}>
        <Nav
          isAuthenticated={isAuthenticated}
          updateAuthentication={updateAuthentication}
        />
      </div>
      <div className="flex flex-col items-end w-screen ">
        <section
          id="hero"
          className="h-screen w-screen mr-10 p-8 max-w-screen-2xl mx-auto flex flex-col justify-center items-end"
        >
          <DonutForm
            selectedBase={selectedBase}
            selectedGlaze={selectedGlaze}
            changeBase={changeBase}
            changeGlaze={changeGlaze}
          />

          <div className="block mt-4 ">
            {coatMessage ? (
              <p>Please remove gold coat first to change glaze and base</p>
            ) : null}
          </div>

          <div id="buttons" className="flex flex-col items-end mr-9">
            <div>
              {withGold ? (
                <button
                  className="text-md underline text-[#f0a122b6] hover:bg-[#f3f0503b] px-3 rounded-md"
                  onClick={cancelGold}
                >
                  Remove gold
                </button>
              ) : (
                <button
                  className="text-md underline text-[#F0A022] hover:bg-[#f3f0503b] px-3 rounded-md"
                  onClick={addGold}
                >
                  Coat with gold!
                </button>
              )}
            </div>
            <div>
              <button
                className="mt-8 text-xl p-3 -mr-3 text-white bg-[#E96B5E] hover:bg-[#e1796d] rounded-full "
                onClick={(e) => handleScroll(e, detailRef)}
              >
                See Donut Details
              </button>
            </div>
          </div>
        </section>

        <section
          id="detail"
          className="h-screen w-screen pl-20 max-w-screen-2xl mx-auto flex flex-col justify-center"
          ref={detailRef}
        >
          <DonutDetails
            selectedBase={selectedBase}
            selectedGlaze={selectedGlaze}
            withGold={withGold}
          />
          <div className="mt-3">
            <button
              className="mt-3 mr-3 p-3 text-xl  text-white bg-[#E96B5E] hover:bg-[#e1796d] rounded-full"
              onClick={(e) => handleScroll(e, heroRef)}
            >
              Make another one
            </button>
            {isAuthenticated ? (
              <SaveButton
                selectedBase={selectedBase}
                selectedGlaze={selectedGlaze}
                withGold={withGold}
              />
            ) : (
              <div className="mt-20">
                Love your donut?{' '}
                <Link to="/auth">
                  <button
                    onClick={handleLogin}
                    className="text-red-500 hover:text-red-400"
                  >
                    login
                  </button>{' '}
                </Link>
                and save it for later!
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </>
  )
}

export default Interfaces
