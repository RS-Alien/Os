import { useEffect } from 'react'
import { useOsBusdPrice } from 'hooks/useBUSDPrice'

const useGetDocumentTitlePrice = () => {
  const osPriceBusd = useOsBusdPrice()
  useEffect(() => {
    const osPriceBusdString = osPriceBusd ? osPriceBusd.toFixed(2) : ''
    document.title = `Oasis Swap - ${osPriceBusdString}`
  }, [osPriceBusd])
}
export default useGetDocumentTitlePrice
