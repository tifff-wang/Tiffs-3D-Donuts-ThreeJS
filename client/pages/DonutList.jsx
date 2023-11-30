import { useQuery } from '@tanstack/react-query'
import DonutCard from '../components/DonutCard'
import { fetchDonuts } from '../api/apiClient'
import { Player } from '@lottiefiles/react-lottie-player'
import Nav from '../components/Nav'
import { fetchAuthSession } from 'aws-amplify/auth'
import { useState } from 'react'

export default function DonutList() {
  const {
    data: donuts,
    isLoading,
    isError,
  } = useQuery(['donutList'], async () => {
    try {
      const session = await fetchAuthSession()
      setIsAuthenticated(true)
      const token = session.tokens.idToken.toString()
      console.log(`token:${token}`)
      return fetchDonuts({ token })
    } catch {
      setIsAuthenticated(false)
    }
  })

  const [isAuthenticated, setIsAuthenticated] = useState()

  function updateAuthentication(state) {
    setIsAuthenticated(state)
  }

  if (isError) {
    return <p>Something went wrong!</p>
  }

  if (isLoading) {
    return (
      <Player
        src="/lotti/chocolate-donuts.json"
        className="player"
        loop
        autoplay
        style={{ height: '500px', width: '500px' }}
      />
    )
  }

  return (
    <>
      <Nav
        isAuthenticated={isAuthenticated}
        updateAuthentication={updateAuthentication}
      />
      <div className="relative">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-5xl font-extrabold leading-snug mt-32 mb-5">
            Your donuts
          </h2>
          <div className="max-h-650 overflow-y-auto custom-scrollbar">
            {donuts.length === 0 ? (
              <h3 className="mb-2 text-2xl tracking-tight text-gray-900">
                Nothing here yet!
              </h3>
            ) : (
              donuts.map((donut) => (
                <DonutCard key={donut.id} donut={donut}></DonutCard>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
