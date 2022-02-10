import { setIsOnline } from '../../redux/features/online.slice'
import io from "socket.io-client";
import { useEffect, FunctionComponent } from 'react'
import { setToken } from "../../redux/features/token.slice";
import { deleteIndexedDB, getIndexedDBbyID, addIndexedDB } from '../../utils/indexedDB.utils'
import { store } from '../../redux/store'
import { getCookie, refreshToken } from '../../utils/auth.utils'
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { setSocketUpdated } from '../../utils/synchronization.utils';

const Socket: FunctionComponent<{ children: any }> = ({ children }) => {
    const dispatch = useAppDispatch()
    const token: any = useAppSelector(state => state.token.value)

    useEffect(() => {
        if (localStorage.getItem('token')) {
            dispatch(setToken(localStorage.getItem('token')))
        }
        window.addEventListener('offline', () => dispatch(setIsOnline(false)))
    }, [])

    useEffect(() => {
        if (token) {
            const socket = io(process.env.NEXT_PUBLIC_SERVER as any, { withCredentials: true })

            socket.on('compareDatabases', async (object) => {
                try {
                    localStorage.setItem('socket_ID', object.socket_ID)
                    dispatch(setIsOnline(true))

                    new Worker(new URL("../../workers/product.worker.ts", import.meta.url), {
                        name: 'Worker_product',
                        type: 'module'
                    })
                        .postMessage({
                            name: 'Worker_product',
                            socketUpdated: object.lastUpdated.product,
                        })

                    new Worker(new URL("../../workers/exercise.worker.ts", import.meta.url), {
                        name: 'Worker_exercise',
                        type: 'module'
                    })
                        .postMessage({
                            name: 'Worker_exercise',
                            socketUpdated: object.lastUpdated.exercise,
                        })

                    new Worker(new URL("../../workers/workoutPlan.worker.ts", import.meta.url), {
                        name: 'Worker_workoutPlan',
                        type: 'module'
                    })
                        .postMessage({
                            name: 'Worker_workoutPlan',
                            socketUpdated: object.lastUpdated.workout_plan,
                        })

                    new Worker(new URL("../../workers/dailyMeasurement.worker.ts", import.meta.url), {
                        name: 'Worker_dailyMeasurement',
                        type: 'module'
                    })
                        .postMessage({
                            name: 'Worker_dailyMeasurement',
                            socketUpdated: object.lastUpdated.daily_measurement,
                        })

                    if (store.getState().online.isOnline && object.lastUpdated.settings > (await getIndexedDBbyID('socketUpdated', 'settings') || { time: 0 }).time || await getIndexedDBbyID('whatToUpdate', 'settings')) {
                        const newToken = await refreshToken()
                        dispatch(setToken(newToken));
                        await setSocketUpdated('settings');
                    }

                } catch (error: any) {
                    console.log('synchronization ended with error', error)
                    dispatch(setIsOnline(false))
                }
            })

            socket.on('synchronizationMessage', async (message) => {
                if (message.socket_ID != await getCookie('socket_ID')) {
                    if (message.where == 'settings') {
                        const newToken = await refreshToken()
                        dispatch(setToken(newToken));
                        await setSocketUpdated('settings');
                    } else {
                        for (let i = 0; i < message.array.length; i++) {
                            await deleteIndexedDB(message.where, message.array[i][message.where == 'daily_measurement' ? 'whenAdded' : '_id'])
                        }
                        if (message.whatToDo == 'change') {
                            await addIndexedDB(message.where, message.array)
                        }
                    }
                    await setSocketUpdated(message.where)
                }
            })

            socket.on('disconnect', () => dispatch(setIsOnline(false))) // Closed socket => user has to be offline
        }
    }, [token])

    return children
}

export default Socket;