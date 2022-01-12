import { useCookies } from "react-cookie"
import { API } from '../utils/API'

const useCoach = () => {
    const [, setCookie] = useCookies()

    const createDiet = async (object: any) => {
        const { response, isSuccess } = await API('/coach/create', {
            array: [object]
        })
        if (isSuccess) {
            setCookie('refresh_token', response.data.refresh_token)
            setCookie('token', response.data.token)
        }
    }

    const analyzeDiet = async (object: any) => {
        const { response, isSuccess } = await API('/coach/analyze', {
            array: [object]
        })
        if (isSuccess) {
            setCookie('refresh_token', response.data.refresh_token)
            setCookie('token', response.data.token)
        }
    }

    return [createDiet, analyzeDiet]
}


export default useCoach;