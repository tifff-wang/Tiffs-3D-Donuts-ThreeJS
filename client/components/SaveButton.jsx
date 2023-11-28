import { useAuth0 } from "@auth0/auth0-react";
import { saveDonut } from "../api/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function SaveButton(props) {
  const { getAccessTokenSilently } = useAuth0();
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);

  const queryClient = useQueryClient();
  const saveDonutMutation = useMutation(saveDonut, {
    onSuccess: async () => {
      queryClient.invalidateQueries(["donutList"]);
    },
  });

  async function handleSave() {
    const donut = {
      glaze: props.selectedGlaze.id,
      base: props.selectedBase.id,
      gold: props.withGold,
      token: await getAccessTokenSilently(),
    };
    saveDonutMutation.mutate(donut);
    setIsSuccessVisible(true);
    setTimeout(() => {
      setIsSuccessVisible(false);
    }, 2000);
  }

  if (saveDonutMutation.isError) {
    return (
      <div className="mt-3">
        Whoops! Your donut can&apos;t be saved, try refreshing the page!
      </div>
    );
  }

  if (saveDonutMutation.isLoading) {
    return (
      <button className="mt-3 ml-3 p-3 text-xl bg-[#eeebe1] rounded-full">
        Saving...
      </button>
    );
  }

  return (
    <>
      {isSuccessVisible ? (
        <button className="mt-8 ml-3 p-3 text-xl bg-[#e5e0cb] hover:bg-[#eeebe1] rounded-full">
          Success!
        </button>
      ) : (
        <button
          className="mt-8 ml-3 p-3 text-xl px-7 bg-[#e5e0cb] hover:bg-[#eeebe1] rounded-full"
          onClick={handleSave}
        >
          Save donut
        </button>
      )}
    </>
  );
}
