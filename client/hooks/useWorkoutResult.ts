import { is_id } from '../utils/API'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { getCookie, readToken } from "../utils/checkAuth"
import { getIndexedDBbyID } from '../utils/indexedDB'
import { useDailyMeasurement } from './useDailyMeasurement'
import { reverseDateDotes } from '../utils/manageDate'

const useWorkoutResult = (): [any, () => void] => {
    const router: any = useRouter()
    const [reload, setReload] = useState(0)
    const [data, setData] = useState(false)
    const [{ data: daily, user }] = useDailyMeasurement(router.query.date, router.query.login)

    useEffect(() => {
        (async () => {
            if (daily) {
                const token = readToken(await getCookie('token'))
                if (token.login == router.query.login) {
                    let res: any = {}
                    let cache = await getIndexedDBbyID('workout_result', router.query.id)
                    if (cache) {
                        res = cache
                        res.whenAdded = reverseDateDotes(daily.whenAdded)
                    } else {
                        res = daily.workout_result.filter((workout: any) => workout._id == router.query.id)
                        if (res && res.length > 0) {
                            res = res[0]
                            res.whenAdded = reverseDateDotes(daily.whenAdded)
                        } else {
                            router.push(`/${router.query.login}/workout-results`)
                        }
                    }
                    setData(res)
                } else {
                    if (await is_id(router.query.id)) {
                        let res: any = {}
                        res = daily.workout_result.filter((workout: any) => workout._id == router.query.id)
                        if (res && res.length > 0) {
                            res = res[0]
                            res.whenAdded = reverseDateDotes(daily.whenAdded)
                        } else {
                            router.push(`/${router.query.login}/workout-results`)
                        }
                        setData(res)
                    } else {
                        router.push(`/${router.query.login}/workout-results`)
                    }
                }
            }
        })()
    }, [daily, reload, router.query])

    return [{ data, user, daily }, () => setReload(reload + 1)]
}

export default useWorkoutResult;