import { loadMissingDataForDailyMeasurement } from "../utils/dailyMeasurement.utils";
import { useQuery } from "urql";
import useCommon from "./useCommon";
import { useEffect, useMemo } from "react";

const DAILY = `
    query daily ($findOneDailyInput: FindOneDailyInput!) {
        daily (findOneDailyInput: $findOneDailyInput) {
            _id
            whenAdded
            user {
                _id
                login
                numberOfMeals
                macronutrients{
                    proteins
                    carbs
                    fats
                }
            }
        }
    }
`

export const useDailyMeasurement = (when: string, login: string) => {
    const { token, router } = useCommon()

    const [result, reexecuteQuery] = useQuery({
        query: DAILY,
        pause: true,
        variables: {
            findOneDailyInput: {
                login: login || router.query.login,
                whenAdded: when || router.query.date,
            }
        }
    })

    const { data, user } = useMemo(() => {
        return {
            user: result?.data?.daily?.user,
            data: loadMissingDataForDailyMeasurement({
                whenAdded: when,
                user_ID: token._id,
                object: result?.data?.daily,
            }),
        }
    }, [result?.data?.daily, token._id, when])

    useEffect(() => {
        reexecuteQuery()
    }, [reexecuteQuery, router.query.login, router.query.whenAdded, when, login])

    return {
        data,
        user,
    };
};
