import { useQuery } from "@tanstack/react-query";
import { fetchGlazes, fetchBases } from "../api/apiClient";
import { useSearchParams } from "react-router-dom";

function DonutForm(props) {
  const { selectedGlaze, selectedBase, changeBase, changeGlaze } = props;
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    data: glazes,
    isLoading: isLoadingGlazes,
    isError: isErrorGlazes,
  } = useQuery(["glazes"], fetchGlazes);

  const {
    data: bases,
    isLoading: isLoadingBases,
    isError: isErrorBases,
  } = useQuery(["bases"], fetchBases);

  if (isErrorGlazes) {
    return <p>Something went wrong</p>;
  }

  if (isErrorBases) {
    return <p>Something went wrong</p>;
  }

  if (!glazes || isLoadingGlazes) {
    return <>loading...</>;
  }

  if (!bases || isLoadingBases) {
    return <>loading...</>;
  }

  const handleGlazeChange = (evt) => {
    const choosenGlaze = glazes.filter(
      (glaze) => glaze.id == evt.target.value,
    )[0];
    console.log(choosenGlaze);

    // This can be set to use the provided hook by RR if we implement it
    searchParams.set("glaze", String(choosenGlaze.id));
    setSearchParams(searchParams);
    changeGlaze(choosenGlaze);
  };

  const handleBaseChange = (evt) => {
    const choosenBase = bases.filter((base) => base.id == evt.target.value)[0];

    // This can be set to use the provided hook by RR if we implement it
    searchParams.set("base", String(choosenBase.id));
    setSearchParams(searchParams);
    changeBase(choosenBase);
  };

  return (
    <>
      <form>
        <div className="grid grid-cols-2 gap-3 mt-5 place-items-center">
          <div className="col-start-1 col-end-7">
            <div className="flex items-center">
              <h2 className="text-5xl font-extrabold leading-snug">
                Choose a flavor
              </h2>
              <img src="/images/donut2.png" alt="sloth-donut" />
            </div>
          </div>
          <div id="glaze-select" className="col-start-1 col-end-3">
            <label className="mt-3 mr-2 text-3xl" htmlFor="glaze">
              Glaze
            </label>
            <select
              id="glaze"
              className="w-64 h-12 p-2 text-lg text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none appearance-none"
              onChange={handleGlazeChange}
              value={selectedGlaze.id}
              name="glaze"
            >
              {glazes.map((glaze, index) => {
                return (
                  <option key={index} value={glaze.id}>
                    {glaze.name}
                  </option>
                );
              })}
            </select>
          </div>

          <div id="base-select" className="col-end-7 col-span-2">
            <label htmlFor="base" className="text-3xl mr-2">
              Base
            </label>
            <select
              id="base"
              className="w-64 h-12 p-2 text-lg text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none appearance-none"
              onChange={handleBaseChange}
              value={selectedBase.id}
              name="base"
            >
              {bases.map((base, index) => {
                return (
                  <option key={index} value={base.id}>
                    {base.name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </form>
    </>
  );
}

export default DonutForm;
