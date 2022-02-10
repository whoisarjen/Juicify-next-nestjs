import { getIndexedDBbyID } from "../utils/indexedDB.utils";
import { cleanCache, setSocketUpdated, synchronizationController } from "../utils/synchronization.utils";

self.onmessage = async ({ data: { socketUpdated, lastUpdated, name } }) => {
    try {
        console.log(`Worker ${name} is starting the job in ${navigator.onLine}`)
        if (navigator.onLine && socketUpdated > lastUpdated || await getIndexedDBbyID('whatToUpdate', 'product')) {
            await synchronizationController({
                isNewValueInDB: socketUpdated > lastUpdated,
                where: 'product',
                updateDailyKey: 'nutrition_diary',
                updateDailyKeyLevel2: 'product_ID',
                updateDailyKeyLevel3: '',
                whatToUpdate: 'favourite_product',
                whatToUpdateKey: '_id',
                whatToUpdateKeyLevel2: '',
            });
            await cleanCache('checked_product')
            await setSocketUpdated('product')
        }
        console.log(`Worker ${name} is done!`)
    } catch (error: any) {
        console.log(`Worker ${name} ended with error! ${error}`)
    } finally {
        close()
    }
};

export { }