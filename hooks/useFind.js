import { API } from '../utils/API'
import { useState, useEffect } from "react";
import { addIndexedDB, getAllIndexedDB, getIndexedDBbyID } from '../utils/indexedDB'

const prepareItems = async (data, skipThoseIDS, where, value) => {
    return new Promise(async resolve => {
        let my = await getAllIndexedDB(where) || []
        let newData = data.concat(my)
        if (my.length > 0) {
            newData = newData.filter(item => item.name.toLowerCase().includes(value)).map((x) => {
                if (!x.user_ID) x.user_ID = '0'
                return x
            }).sort((a, b) => b.user_ID.localeCompare(a.user_ID) || a.name.length - b.name.length || a.name.localeCompare(b.name));

            if (newData.length > 10) {
                newData = newData.splice(0, 10)
            }
        }
        if (skipThoseIDS && skipThoseIDS.length > 0 && newData.length > 0) {
            for (let i = 0; i < skipThoseIDS.length; i++) {
                for (let a = 0; a < newData.length; a++) {
                    if (skipThoseIDS[i]._id == newData[a]._id) {
                        newData.splice(a, 1)
                        break;
                    }
                }
            }
        }
        resolve(newData)
    })
}

const useFind = (value, where, tab, skipThoseIDS, reload = 0) => {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchCache, setSearchCache] = useState([])
    const [searchTimer, setSearchTimer] = useState(null)

    useEffect(async () => {
        clearTimeout(searchTimer)
        if (value && value.length > 2) {
            setLoading(true)
            if (tab == 1) {
                let fav = await prepareItems(await getAllIndexedDB(`favourite_${where}`) || [], skipThoseIDS, where, value)
                setItems(fav.filter(item => item.name.toLowerCase().includes(value)).sort((a, b) => a.name.length - b.name.length).splice(0, 10))
                setLoading(false)
            } else if (tab == 2) {
                let checked = await prepareItems(await getAllIndexedDB(`checked_${where}`) || [], skipThoseIDS, where, value)
                setItems(checked.splice(0, 10))
                setLoading(false)
            } else {
                const cache = await getIndexedDBbyID(`cache_${where}`, value)
                if (cache && cache.items.length > 0) {
                    setItems(await prepareItems(cache.items || [], skipThoseIDS, where, value))
                    setLoading(false)
                } else {
                    const searchFunction = (find) => setTimeout(async () => {
                        setLoading(true);
                        const { response, isSuccess } = await API(`/find/${where}`, {
                            find: find
                        });
                        if (isSuccess) {
                            const receivedProducts = response.items.sort((a, b) => a.name.length - b.name.length)
                            setItems(await prepareItems(receivedProducts || [], skipThoseIDS, where, value))
                            await addIndexedDB(`cache_${where}`, [{ _id: find, whenAdded: new Date(), items: receivedProducts }])
                            setSearchCache([...searchCache, find])
                        }
                        setLoading(false)
                    }, 1500)
                    setSearchTimer(searchFunction(value))
                }
            }
        } else {
            setItems([])
            setLoading(false)
        }
    }, [value, where, tab, reload])

    useEffect(async () => setSearchCache((await getAllIndexedDB(`cache_${where}`)).map(item => item._id)), [])

    return { items, loading, searchCache }
}

export default useFind