import { useQuery } from '@tanstack/react-query'
import { fetchGlazes, fetchBases } from '../api/apiClient'
import { useSearchParams } from 'react-router-dom'

function DonutForm(props) {
  const { selectedGlaze, selectedBase, changeBase, changeGlaze } = props
  const [searchParams, setSearchParams] = useSearchParams()

  const {
    data: glazes,
    isLoading: isLoadingGlazes,
    isError: isErrorGlazes,
  } = useQuery(['glazes'], fetchGlazes)

  const {
    data: bases,
    isLoading: isLoadingBases,
    isError: isErrorBases,
  } = useQuery(['bases'], fetchBases)

  if (isErrorGlazes) {
    return <p>Something went wrong</p>
  }

  if (isErrorBases) {
    return <p>Something went wrong</p>
  }

  if (!glazes || isLoadingGlazes) {
    return <>loading...</>
  }

  if (!bases || isLoadingBases) {
    return <>loading...</>
  }

  const handleGlazeChange = (evt) => {
    const choosenGlaze = glazes.filter(
      (glaze) => glaze.id == evt.target.value
    )[0]
    console.log(choosenGlaze)

    // This can be set to use the provided hook by RR if we implement it
    searchParams.set('glaze', String(choosenGlaze.id))
    setSearchParams(searchParams)
    changeGlaze(choosenGlaze)
  }

  const handleBaseChange = (evt) => {
    const choosenBase = bases.filter((base) => base.id == evt.target.value)[0]

    // This can be set to use the provided hook by RR if we implement it
    searchParams.set('base', String(choosenBase.id))
    setSearchParams(searchParams)
    changeBase(choosenBase)
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-5xl text-[#E26A5E] font-extrabold leading-snug">
          Create your own <br />
          yummy donuts!
        </h1>
        <img src="/images/donut2.png" alt="sloth-donut" />
      </div>
      <form className="mt-10 w-96">
        <div className="grid grid-cols-1 gap-3 mt-11 place-items-center">
          <div id="glaze-select" className="flex items-center">
            <label className="mr-2 text-xl" htmlFor="glaze">
              Glaze
            </label>
            <select
              id="glaze"
              className="w-64 h-12 p-2 text-md text-gray-500 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none appearance-none"
              onChange={handleGlazeChange}
              value={selectedGlaze.id}
              name="glaze"
            >
              {glazes.map((glaze, index) => {
                return (
                  <option key={index} value={glaze.id}>
                    {glaze.name}
                  </option>
                )
              })}
            </select>
          </div>

          <div id="base-select" className="flex items-center">
            <label htmlFor="base" className="mr-2 text-xl">
              Base
            </label>
            <select
              id="base"
              className="w-64 h-12 p-2 ml-1 text-md text-gray-500 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none appearance-none"
              onChange={handleBaseChange}
              value={selectedBase.id}
              name="base"
            >
              {bases.map((base, index) => {
                return (
                  <option key={index} value={base.id}>
                    {base.name}
                  </option>
                )
              })}
            </select>
          </div>
        </div>
      </form>
    </>
  )
}

export default DonutForm
