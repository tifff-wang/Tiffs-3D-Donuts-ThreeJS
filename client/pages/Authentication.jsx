import { Amplify } from 'aws-amplify'

import { withAuthenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import config from '../../src/amplifyconfiguration.json'
import { useEffect } from 'react'

Amplify.configure(config)

function Auth({ user }) {
  useEffect(() => {
    if (user) {
      window.location.href = '/'
    }
  }, [user])

  return <></>
}

export default withAuthenticator(Auth)
