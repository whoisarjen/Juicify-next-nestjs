import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';
import ConfirmDialog from '../common/ConfirmDialog'
import useTranslation from "next-translate/useTranslation";


const DialogEditProduct = ({ product, isDialog, closeDialog, deleteProduct, changeProduct }) => {
    const { t } = useTranslation('nutrition-diary');
    const [meal, setMeal] = useState(0)
    const [howMany, setHowMany] = useState(1)
    const [isDialogConfirm, setIsDialogConfirm] = useState(false)
    const [calories, setCalories] = useState(0)
    const [activity, setActivity] = useState('')
    const token = useSelector(state => state.token.value)

    const beforeChangeProduct = async () => {
        let newProduct = JSON.parse(JSON.stringify(product))
        let isChanged = false
        if (calories != product.calories) {
            newProduct.calories = calories || 1
            isChanged = true
        }
        if (meal != product.meal) {
            newProduct.meal = meal || 0
            isChanged = true
        }
        if (howMany != product.how_many) {
            newProduct.how_many = howMany || 1
            isChanged = true
        }
        if (activity != product.activity) {
            newProduct.activity = activity || 1
            isChanged = true
        }
        console.log('newProduct', newProduct)
        if (isChanged) {
            changeProduct(newProduct)
        }
        closeDialog()
    }

    useEffect(() => {
        setMeal(product.meal)
        setHowMany(product.how_many)
        setCalories(product.calories)
        setActivity(product.activity)
    }, [product])

    return (
        <div className="dialogEditProduct">
            <Dialog
                open={isDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {t('Edit')}
                </DialogTitle>
                <DialogContent>
                    {
                        parseInt(product.meal) >= 0 &&
                        <Select
                            sx={{ width: '100%' }}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={meal}
                            onChange={(e) => setMeal(e.target.value)}
                        >
                            {
                                [...Array(token.meal_number)].map((x, i) =>
                                    <MenuItem key={i} value={i}>{t('Meal')} {i + 1}</MenuItem>
                                )
                            }
                        </Select>
                    }
                    {
                        product.activity &&
                        <TextField
                            type="text"
                            label={t('Activity')}
                            sx={{ marginTop: '10px', width: '100%' }}
                            value={activity}
                            onChange={(e) => setActivity(e.target.value)}
                        />
                    }
                    {
                        product.calories &&
                        <TextField
                            type="number"
                            label={t('How many calories')}
                            sx={{ marginTop: '10px', width: '100%' }}
                            value={calories}
                            onChange={(e) => setCalories(e.target.value)}
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        />
                    }
                    {
                        product.how_many &&
                        <TextField
                            type="number"
                            label={t('How many times 100g/ml')}
                            sx={{ marginTop: '10px', width: '100%' }}
                            value={howMany}
                            onChange={(e) => setHowMany(e.target.value)}
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        />
                    }

                </DialogContent>
                <DialogActions>
                    <Button sx={{ color: 'red' }} onClick={() => setIsDialogConfirm(true)}>{t('Delete')}</Button>
                    <Button onClick={closeDialog}>{t('Deny')}</Button>
                    <Button onClick={beforeChangeProduct}>{t('Confirm')}</Button>
                </DialogActions>
            </Dialog>
            <ConfirmDialog
                isDialog={isDialogConfirm}
                closeDialog={() => setIsDialogConfirm(false)}
                confirm={() => {
                    deleteProduct(product._id)
                    closeDialog()
                    setIsDialogConfirm(false)
                }}
            />
        </div>
    );
}

export default DialogEditProduct;