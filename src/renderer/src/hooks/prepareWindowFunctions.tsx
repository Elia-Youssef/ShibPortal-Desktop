import { useEffect } from 'react'
import { useShibAuth } from '@shibaone/shib-auth-sdk'
import { useConnectModal } from '@rainbow-me/rainbowkit'


export default function usePrepareWindowFunctions() {
  const { user } = useShibAuth()
  const { openConnectModal } = useConnectModal()

  useEffect(() => {
    window.result = 'undefined'
    window.userAddress = user?.address

    if (!user && openConnectModal) 
      openConnectModal()
  }, [user])
}
