import { Canvas } from "@react-three/fiber";
import SavedDonuts from "../components/SavedDonuts";
import { OrbitControls } from "@react-three/drei";
import { delDonut } from "../api/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";

function DonutCard({ donut }) {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  const delMutation = useMutation({
    mutationFn: async ({ id, token }) => delDonut(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries(["donutList"]);
    },
  });

  // delete
  async function handleDelete(event, id) {
    const token = await getAccessTokenSilently();
    event.preventDefault();
    console.log(donut.id);
    console.log(token);
    delMutation.mutate({ id, token });
  }

  return (
    <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 mb-8">
      <div
        key={donut.id}
        className="object-cover w-full h-96 md:h-48 md:w-40 md:rounded-none md:rounded-l-lg"
      >
        <Canvas
          shadows
          camera={{
            fov: 3.2,
            near: 0.1,
            far: 1000,
            position: [3, 3, 5],
          }}
          style={{
            background: "rgb(249, 249, 249)",
            borderRadius: "0px 80px 80px 0px",
          }}
        >
          <OrbitControls enableZoom={false} />
          <SavedDonuts
            glazeColorCode={donut.glazeColor}
            baseColorCode={donut.baseColor}
            gold={donut.gold}
          />
        </Canvas>
      </div>

      <div className="flex flex-col justify-between p-4 leading-normal">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
          {donut.baseName} base with {donut.glazeName} topping
        </h5>
        {donut.gold == 1 ? (
          <h4 className="mb-2 text-2xl font-bold tracking-tight text-[#a8a83f]">
            coated with gold
          </h4>
        ) : null}
        <p className="mb-3 font-normal text-gray-700">Price: ${donut.price}</p>

        <button
          onClick={(event) => handleDelete(event, donut.id)}
          className="mt-3 p-3 bg-[#eeebe1] hover:bg-[#e5e0cb] rounded-full"
        >
          Eat this Donut
        </button>
      </div>
    </div>
  );
}

export default DonutCard;
