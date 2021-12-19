import styles from '../../styles/workout.module.css'
import Checkbox from '@mui/material/Checkbox';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import { useEffect, useState } from 'react'
import { addIndexedDB, deleteIndexedDB, getIndexedDBbyID } from '../../utils/indexedDB';

const AddProductsBox = ({ exercise, refreshCheckedExercises }) => {
    const [checked, setChecked] = useState(false);
    const [value, setValue] = useState('1.0')
    const [fav, setFav] = useState(false)

    const handleLike = async () => {
        if (fav) {
            setFav(false)
            await deleteIndexedDB('favourite_exercise', exercise._id)
        } else {
            setFav(true)
            await addIndexedDB('favourite_exercise', [exercise])
        }
    }

    const handleCheck = async () => {
        if (checked) {
            setChecked(false)
            await deleteIndexedDB('checked_exercise', exercise._id)
        } else {
            setChecked(true)
            await addIndexedDB('checked_exercise', [{ ...exercise, how_many: value }])
        }
        refreshCheckedExercises()
    }

    useEffect(async () => {
        await getIndexedDBbyID('favourite_exercise', exercise._id) ? setFav(true) : setFav(false)
        await getIndexedDBbyID('checked_exercise', exercise._id) ? setChecked(true) : setChecked(false)
    }, [])

    return (
        <div className={styles.addExercisesBox} style={{ borderLeft: exercise.v ? '5px solid #1976d2' : '' }}>
            <div className={styles.addExercisesBoxName}>
                {exercise.name}
            </div>
            <div className={styles.addExercisesBoxFavourite} onClick={handleLike}>
                <Checkbox checked={fav} icon={<FavoriteBorder fontSize="small" />} checkedIcon={<Favorite fontSize="small" />} />
            </div>
            <div className={styles.addExercisesBoxSubmit} onChange={handleCheck}>
                <Checkbox
                    checked={checked}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
            </div>
        </div>
    );
}

export default AddProductsBox;