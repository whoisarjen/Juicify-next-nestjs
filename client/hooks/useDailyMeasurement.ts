import { useRouter } from "next/router";
import { useAppSelector } from "./useRedux";
import { useState, useEffect } from "react";
import { getCookie, readToken } from "../utils/checkAuth";
import { getIndexedDBbyID } from "../utils/indexedDB";
import { loadValueByLogin } from "../utils/API";
import schema from "../schema/dailyMeasurement";

const useDailyMeasurement = (when: string, login: string): [any, () => void] => {
    const router: any = useRouter();
    const [user, setUser] = useState();
    const [reload, setReload] = useState(0);
    const [data, setDataObject] = useState<Object>();
    const theOldestSupportedDate = useAppSelector(state => state.config.theOldestSupportedDate());

    useEffect(() => {
        if (when) {
            (async () => {
                const token = readToken(await getCookie('token'))
                if (
                    token.login == (login || token.login) && // Sometimes need to use only in token's user case and this block errors
                    theOldestSupportedDate <= when
                ) {
                    let data = await getIndexedDBbyID(
                        "daily_measurement",
                        new Date(when).toISOString()
                    );
                    setUser(token);
                    setDataObject(schema(data, "XD" + new Date().getTime(), when, token._id));
                } else {
                    let res = await loadValueByLogin(
                        "daily_measurement",
                        when,
                        login
                    );
                    setUser(res.user);
                    setDataObject(schema(res.data, "XD" + new Date().getTime(), when, res.user._id));
                }
            })();
        }
    }, [when, login, reload, router.query]);

    return [{ data, user }, () => setReload(reload + 1)];
};

export { useDailyMeasurement };