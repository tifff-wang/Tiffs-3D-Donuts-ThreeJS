import { fetchAuthSession } from 'aws-amplify/auth'

export async function isAuthenticated(): Promise<boolean> {
  try {
    const session = await fetchAuthSession()
    return session.tokens?.idToken != undefined
  } catch {
    return false
  }
}
