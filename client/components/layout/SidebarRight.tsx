import { useState, useEffect } from "react"
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { useDailyMeasurement } from "../../hooks/useDailyMeasurement";
import useMacro from "../../hooks/useMacro";
import { useAppSelector } from "../../hooks/useRedux";
import { getDiffrentBetweenDays, getShortDate, reverseDateDotes } from "../../utils/date.utils";
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Link from "next/link";
import ListSubheader from '@mui/material/ListSubheader';
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import Weights from "../common/Weights";
import { useTheme } from "../../hooks/useTheme";
import NutritionDiaryProps from "../../interfaces/nutritionDiary.interface";
import { getCalories } from "../../utils/product.utils";
import styled from 'styled-components'

const SidebarRight = styled.aside`
    padding: 12px;
    @media (max-width: 1089px) {
        display: none;
    }
`

const SidebarRightCircleBox = styled.aside`
    padding: 6px;
    display: grid;
    grid-template-columns: 80px auto;
    height: 80px;
    ${this} div {
        margin: auto 12px;
    }
`

export default ({ token }: { token: any }) => {
    const router = useRouter()
    const { t } = useTranslation('home')
    const [isWeights, setIsWeights] = useState(false)
    const keyDaily = useAppSelector(state => state.key.daily_measurement)
    const [{ data }, reload] = useDailyMeasurement(getShortDate(), token.login)
    const [{ getDay }] = useMacro()
    const [weight, setWeight] = useState(0)
    const [calories, setCalories] = useState(0)
    const [caloriesGoal, setCaloriesGoal] = useState(0)
    const [workout, setWorkout] = useState(0)
    const [coach, setCoach] = useState(0)
    const [styles, setStyles]: any = useState()
    const [getTheme]: any = useTheme()

    useEffect(() => {
        if (data && token) {
            setWeight(data.weight || 0)

            let calories = 0
            data.nutrition_diary.forEach((x: NutritionDiaryProps) => {
                calories += getCalories(x)
            })
            setCalories(calories)

            const macro = getDay(new Date(getShortDate()), token)
            setCaloriesGoal(macro.proteins * 4 + macro.carbs * 4 + macro.fats * 9)

            setWorkout(data.workout_result ? data.workout_result.length : 0)

            setCoach(getDiffrentBetweenDays(token.coach, getShortDate()))

            setStyles(buildStyles({
                textSize: '15px',
                pathTransitionDuration: 0.5,
                pathColor: getTheme('PRIMARY'),
                textColor: 'rgba(122, 122, 122, 1',
                trailColor: '#d6d6d6',
                backgroundColor: getTheme('PRIMARY')
            }))
        }
    }, [data, token])

    useEffect(() => reload(), [keyDaily])

    return (
        <SidebarRight>
            {
                styles &&
                <>
                    <List
                        sx={{ width: '100%', bgcolor: 'background.paper' }}
                        subheader={
                            <ListSubheader component="div" id="nested-list-subheader">
                                {t('Data for')} {reverseDateDotes()}:
                            </ListSubheader>
                        }
                    >
                        <Link href={`${router.asPath}`}>
                            <a>
                                <ListItemButton onClick={() => setIsWeights(true)}>
                                    <SidebarRightCircleBox>
                                        <CircularProgressbar
                                            value={weight ? 100 : 0}
                                            text={`${weight}kg`}
                                            styles={styles}
                                        />
                                        <div>
                                            {t("Weight")}
                                        </div>
                                    </SidebarRightCircleBox>
                                </ListItemButton>
                            </a>
                        </Link>
                        <Link href={`/${token.login}/nutrition-diary/${getShortDate()}`}>
                            <a>
                                <ListItemButton>
                                    <SidebarRightCircleBox>
                                        <CircularProgressbar
                                            value={calories ? calories / caloriesGoal * 100 : 0}
                                            text={`${calories}Kcal`}
                                            styles={styles}
                                        />
                                        <div>
                                            {t("Calories")}
                                        </div>
                                    </SidebarRightCircleBox>
                                </ListItemButton>
                            </a>
                        </Link>
                        <Link href={`/${token.login}/workout-results/`}>
                            <a>
                                <ListItemButton>
                                    <SidebarRightCircleBox>
                                        <CircularProgressbar
                                            value={workout * 100}
                                            text={`${workout}`}
                                            styles={styles}
                                        />
                                        <div>
                                            {t("Workout")}
                                        </div>
                                    </SidebarRightCircleBox>
                                </ListItemButton>
                            </a>
                        </Link>
                        <Link href={`/coach`}>
                            <a>
                                <ListItemButton>
                                    <SidebarRightCircleBox>
                                        <CircularProgressbar
                                            value={(7 - coach) / 7 * 100}
                                            text={`${coach >= 0 ? coach : 0}dni`}
                                            styles={styles}
                                        />
                                        <div>
                                            {t("Coach")}
                                        </div>
                                    </SidebarRightCircleBox>
                                </ListItemButton>
                            </a>
                        </Link>
                    </List>
                    <Weights
                        isWeights={isWeights}
                        closeWeights={() => {
                            reload()
                            setIsWeights(false)
                        }}
                    />
                </>
            }
        </SidebarRight>
    )
}