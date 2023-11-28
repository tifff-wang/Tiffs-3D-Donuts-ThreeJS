import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import DonutCard from "../components/DonutCard";
import { fetchDonuts } from "../api/apiClient";
import { Navigate } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import Nav from "../components/Nav";
export default function DonutList() {
  const {
    getAccessTokenSilently,
    isAuthenticated,
    isLoading: isLoadingAuth,
  } = useAuth0();
  const {
    data: donuts,
    isLoading,
    isError,
  } = useQuery(["donutList"], async () => {
    const token = await getAccessTokenSilently();
    return fetchDonuts({ token });
  });

  if (!isAuthenticated && !isLoadingAuth) return <Navigate to={"/"} />;

  if (isError) {
    return <p>Something went wrong!</p>;
  }

  if (isLoading) {
    return (
      <Player
        src="/lotti/chocolate-donuts.json"
        className="player"
        loop
        autoplay
        style={{ height: "500px", width: "500px" }}
      />
    );
  }

  return (
    <>
      <Nav />
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
  );
}
