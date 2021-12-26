import Link from "next/link"
import { useRouter } from "next/router"
import { useAppSelector } from '../../../hooks/useRedux'
import { useState, useEffect, FunctionComponent } from 'react'
import { addDaysToDate } from '../../../utils/manageDate'
import { overwriteThoseIDSinDB } from "../../../utils/API"
import { useDailyMeasurement } from '../../../hooks/useDailyMeasurement'
import MealBox from "../../../components/nutrition-diary/MealBox"
import AddProducts from '../../../components/nutrition-diary/AddProducts'
import DialogEditProduct from '../../../components/nutrition-diary/DialogEditProduct'

const NutritionDiary: FunctionComponent = () => {
    const router: any = useRouter()
    const [index, setIndex] = useState(0)
    const [product, setProduct] = useState({})
    const token: any = useAppSelector(state => state.token.value)
    const [isAddDialog, setIsAddDialog] = useState(false)
    const [isEditDialog, setIsEditDialog] = useState(false)
    const [nutrition_diary, setNutrition_diary] = useState([])
    const [{ data, user }, reloadDailyMeasurement] = useDailyMeasurement(router.query.date)

    const deleteProduct = async (_id: string) => {
        let copyDailyMeasurement = JSON.parse(JSON.stringify(data))
        copyDailyMeasurement.nutrition_diary = copyDailyMeasurement.nutrition_diary.map((obj: any) =>
            obj._id == _id ? { ...obj, deleted: true } : obj
        );
        await overwriteThoseIDSinDB('daily_measurement', [copyDailyMeasurement])
        reloadDailyMeasurement()
    }

    const changeProduct = async (newProduct: any) => {
        let copyDailyMeasurement = JSON.parse(JSON.stringify(data))
        copyDailyMeasurement.nutrition_diary = copyDailyMeasurement.nutrition_diary.map((obj: any) =>
            obj._id == newProduct._id ? { ...obj, ...{ changed: true }, ...newProduct } : obj
        );
        await overwriteThoseIDSinDB('daily_measurement', [copyDailyMeasurement])
        reloadDailyMeasurement()
    }

    useEffect(() => {
        if (data && data.nutrition_diary) {
            const arr: any = []
            const l = user.meal_number || 5
            for (let i = 0; i < l; i++) {
                arr.push([])
            }
            const length = arr.length
            data.nutrition_diary.forEach((meal: any) => {
                if (!meal.deleted) {
                    if (!meal.meal) {
                        meal.meal = 0
                    }
                    if (meal.meal + 1 > length) {
                        for (let i = 0; i < meal.meal + 1 - length; i++) {
                            arr.push([])
                        }
                    }
                    arr[meal.meal].push(meal)
                }
            })
            setNutrition_diary(arr)
        }
    }, [data])

    return (
        <div className="NutritionDiary">
            <Link passHref href={`/${router.query.login}/nutrition-diary/${addDaysToDate(router.query.date, 1)}`}><a>Next</a></Link>
            {
                nutrition_diary && nutrition_diary.map((x, i) => (
                    <MealBox
                        key={i}
                        index={i}
                        products={x}
                        openDialog={() => {
                            setIndex(i)
                            setIsAddDialog(true)
                        }}
                        openEditProduct={(product) => {
                            setProduct(product)
                            setIsEditDialog(true)
                        }}
                    />
                ))
            }
            {
                token && token.login == router.query.login &&
                <AddProducts
                    index={index}
                    isAddDialog={isAddDialog}
                    dailyMeasurement={data}
                    closeDialog={() => setIsAddDialog(false)}
                    reload={reloadDailyMeasurement}
                />
            }
            {
                token && token.login == router.query.login &&
                <DialogEditProduct
                    product={product}
                    isDialog={isEditDialog}
                    closeDialog={() => setIsEditDialog(false)}
                    deleteProduct={(_id) => deleteProduct(_id)}
                    changeProduct={(newProduct) => changeProduct(newProduct)}
                />
            }
        </div>
    );
};

export default NutritionDiary;