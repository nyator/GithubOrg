import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useState, useEffect, useEffectEvent } from 'react'



const fetchData = async (query) => {
    if (!query) return null
    const response = await axios.get(`https://api.github.com/orgs/${query}/repos`)
    return response.data

}


const DELAY = 500

function useFetch(query) {
    const [debouncedValue, setDebouncedValue] = useState(query)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(query)
        }, DELAY)

        return () => {
            clearTimeout(handler)
        }
    }, [query])

    const { data, error, isLoading } = useQuery({
        queryKey: ['org', debouncedValue],
        queryFn: () => fetchData(debouncedValue),
        staleTime: 1.8e+6, //30mins
        gcTime: 3.6e+6, //60mins
        enabled: true,
        // enabled: !!debouncedValue,
    })

    return { data, isLoading, error }
}

export default useFetch
