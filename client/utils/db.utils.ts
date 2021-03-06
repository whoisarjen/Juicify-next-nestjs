import { getIndexedDBbyID, addIndexedDB, deleteIndexedDB, putInformationAboutNeededUpdate } from "./indexedDB.utils"
import { store } from '../redux/store'
import axios from "axios"
import { setIsOnline } from "../redux/features/online.slice"
import { prepareToSend } from "./dailyMeasurement.utils"
import { refreshKey } from "../redux/features/key.slice"
import { handleUpdateDailyKey, handleUpdateKey } from "./synchronization.utils"

export const insertThoseIDStoDBController = async (where: string, array: Array<any>) => {
    if (await isid(array[0].id)) {
        await overwriteThoseIDSinDB(where, array)
    } else {
        await insertThoseIDStoDB(where, array)
    }
}

export const insertThoseIDStoDB = async (where: string, sentArray: Array<any>, updateDailyKey?: string, updateDailyKeyLevel2?: string, updateDailyKeyLevel3?: string, whatToUpdate?: string, whatToUpdateKey?: string, whatToUpdateKeyLevel2?: string) => {
    let array = JSON.parse(JSON.stringify(sentArray))
    const arrayIDSbeforeInsert = []
    try {

        if (!getOnline() && !await isWorker()) throw 'User is offline. Skip to catch method';

        for (let i = 0; i < array.length; i++) {
            if (array[i].id) {
                await deleteIndexedDB(where, array[i][where == 'daily_measurement' ? 'whenAdded' : 'id'])
                arrayIDSbeforeInsert.push(array[i].id)
                delete array[i].id
            }
            if (where == 'daily_measurement') {
                array[i].whenAdded = new Date(array[i].whenAdded).toISOString()
                array[i] = await prepareToSend(array[i], true)
            }
        }

        const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER}/insert/${where}`, { array }, { withCredentials: true });

        array = JSON.parse(JSON.stringify(res.data));

        if (where == 'daily_measurement') {
            for (let i = 0; i < array.length; i++) {
                if (await getIndexedDBbyID(where, array[i].whenAdded)) await deleteIndexedDB(where, array[i].whenAdded) // Server can return existing date
            }
        }

        await handleUpdateDailyKey({ updateDailyKey, updateDailyKeyLevel2, updateDailyKeyLevel3, arrayIDSbeforeInsert, array })
        await handleUpdateKey({ whatToUpdate, whatToUpdateKey, whatToUpdateKeyLevel2, arrayIDSbeforeInsert, array })

    } catch (error: any) {

        console.log(error)
        for (let i = 0; i < array.length; i++) {
            array[i].id = arrayIDSbeforeInsert[i] || ("XD" + new Date().getTime() + i)
            array[i].whenAdded = new Date(array[i].whenAdded).toISOString()
        }
        if (!await isWorker()) {
            store.dispatch(setIsOnline(false))
            await putInformationAboutNeededUpdate(where);
        }

    } finally {

        await addIndexedDB(where, array)
        if (!await isWorker()) store.dispatch(refreshKey(where)) // Worker is doing it by self, when ends all operaction, so we avoid multi relogs
        return array

    }
}

export const overwriteThoseIDSinDB = async (where: string, sentArray: Array<any>) => {
    let array = JSON.parse(JSON.stringify(sentArray))
    try {

        if (!getOnline() && !await isWorker()) throw 'User is offline. Skip to catch method';

        if (where == 'daily_measurement') {
            for (let i = 0; i < array.length; i++) {
                array[i] = await prepareToSend(array[i], true)
            }
        }

        const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER}/update/${where}`, { array }, { withCredentials: true });

        array = JSON.parse(JSON.stringify(res.data));

    } catch (error: any) {

        console.log(error)
        if (!await isWorker()) {
            store.dispatch(setIsOnline(false))
            await putInformationAboutNeededUpdate(where);
            array.map((x: any) => {
                x.changed = true
                return x
            })
        }

    } finally {
        for (let i = 0; i < array.length; i++) {
            await deleteIndexedDB(where, array[i][where == 'daily_measurement' ? 'whenAdded' : 'id']) // Can't be connected above
        }
        await addIndexedDB(where, array)
        if (!await isWorker()) store.dispatch(refreshKey(where)) // Worker is doing it by self, when all operactions are done, so we avoid multi reloads
        return array;

    }
}

export const deleteThoseIDSfromDB = async (where: string, array: Array<any>) => {
    try {

        if (!getOnline() && !await isWorker()) throw 'User is offline. Skip to catch method';

        for (let i = 0; i < array.length; i++) {
            array[i].deleted = true;
            if (!await isid(array[i].id)) {
                await deleteIndexedDB(where, array[i].id)
                array.splice(i, 1)
            } else if (where == 'daily_measurement') {
                array[i] = await prepareToSend(array[i], true)
            }
        }

        if (!array.length) return true;

        await axios.post(`${process.env.NEXT_PUBLIC_SERVER}/delete/${where}`, { array }, { withCredentials: true });

        for (let i = 0; i < array.length; i++) {
            await deleteIndexedDB(where, array[i].id)
        }

    } catch (error: any) {

        console.log(error)
        await addIndexedDB(where, array)
        if (!await isWorker()) {
            store.dispatch(setIsOnline(false))
            await putInformationAboutNeededUpdate(where);
        }

    } finally {

        if (!await isWorker()) store.dispatch(refreshKey(where)) // Worker is doing it by self, when ends all operaction, so we avoid multi relogs
        return array;

    }
}

export const isid = async (id: string) => (id).substring(0, 2) != "XD" ? true : false;

export const isWorker = async () => {
    try {
        if (window) {
            return false;
        }
    } catch {
        return true;
    }
}

export const getOnline = () => store.getState().online.isOnline