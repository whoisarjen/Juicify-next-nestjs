import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../hooks/useRedux";
import { getAllIndexedDB } from "../../utils/indexedDB.utils";
import styled from 'styled-components'
import BetterLink from "../common/better-link";

const Box = styled.div`
    color: #fff;
    background: #f44336;
    width: 100%;
    padding: 12px 0;
    text-align: center;
    font-size: 0.9rem;
    box-shadow: 0 -2px -4px 1px rgb(0 0 0 / 20%), 0 4px 5px 0 rgb(0 0 0 / 14%);
`

const TopNotify = () => {
    const [notSaved, setNotSaved]: any = useState([])
    const [allowed, setAllowed] = useState(false)
    const [timer, setTimer]: any = useState()
    const token: any = useAppSelector(state => state.token.value)
    const isOnline: boolean = useAppSelector(state => state.online.isOnline)
    const router: any = useRouter()
    const { t } = useTranslation('home')
    const [offlineBar, setOfflineBar] = useState(false)
    const [offlineTimer, setOfflineTimer] = useState<any>()

    useEffect(() => {
        (async () => {
            clearTimeout(timer)
            setAllowed(false)
            if (token && token.login) {
                document.documentElement.style.setProperty('--BothNavHeightAndPaddingDefault', '141px')
                const workoutResults = await getAllIndexedDB('workout_result')
                if (!router.pathname.includes('workout/results') && workoutResults.length) {
                    document.documentElement.style.setProperty('--BothNavHeightAndPaddingDefault', '183px')
                } else {
                    document.documentElement.style.setProperty('--BothNavHeightAndPaddingDefault', '141px')
                }
                setNotSaved(workoutResults)
            }
            setTimer(setTimeout(() => setAllowed(true), 1500))
        })()
    }, [router.pathname, token.id])

    useEffect(() => {
        document.addEventListener("visibilitychange", () => {
            clearTimeout(offlineTimer)
            if (document.visibilityState === 'visible') {
                setOfflineTimer(setTimeout(() => {
                    setOfflineBar(true)
                }, 1500))
            } else {
                setOfflineBar(false)
            }
        });
    }, [])

    return (
        <>
            {
                allowed &&
                (
                    notSaved.length > 0 &&
                        !router.pathname.includes('workout/results')
                        ?
                        (
                            <BetterLink href={`/${token.login}/workout/results/${notSaved[0].whenAdded}/${notSaved[0].id}`}>
                                <Box>{t('Comeback to not saved workout')}</Box>
                            </BetterLink>
                        )
                        :
                        offlineBar
                            ?
                            (
                                !isOnline && token && token.id
                                    ?
                                    (
                                        <Box>{t('YOU_ARE_WORKING_IN_OFFLINE_MODE')}</Box>
                                    )
                                    :
                                    <></>
                            )
                            :
                            <></>
                )
            }
        </>
    )
};

export default TopNotify;