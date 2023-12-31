import { saveDonut } from '../api/apiClient'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { fetchAuthSession } from 'aws-amplify/auth'

export default function SaveButton(props) {
  const [isSuccessVisible, setIsSuccessVisible] = useState(false)

  const queryClient = useQueryClient()
  const saveDonutMutation = useMutation(saveDonut, {
    onSuccess: async () => {
      queryClient.invalidateQueries(['donutList'])
    },
  })

  async function handleSave() {
    const session = await fetchAuthSession()

    const donut = {
      glaze: props.selectedGlaze.id,
      base: props.selectedBase.id,
      gold: props.withGold,
      token: session.tokens.idToken.toString(),
    }
    saveDonutMutation.mutate(donut)
    setIsSuccessVisible(true)
    setTimeout(() => {
      setIsSuccessVisible(false)
    }, 2000)
  }

  if (saveDonutMutation.isError) {
    return (
      <div className="mt-3">
        Whoops! Your donut can&apos;t be saved, try refreshing the page!
      </div>
    )
  }

  if (saveDonutMutation.isLoading) {
    return (
      <button className="mt-3 ml-3 p-3 text-xl bg-[#eeebe1] rounded-full">
        Saving...
      </button>
    )
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
  )
}
