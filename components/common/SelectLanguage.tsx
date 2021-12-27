import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import { useCookies } from "react-cookie";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import useTranslation from "next-translate/useTranslation";

const useLanguage: FunctionComponent = () => {
    const router: any = useRouter();
    const { t } = useTranslation("home");
    const [, setCookie] = useCookies(["NEXT_LOCALE"]);

    const setLanguage = (e: any) => {
        setCookie("NEXT_LOCALE", e.target.value, {
            path: "/",
            expires: new Date(new Date().setFullYear(new Date().getFullYear() + 20)),
        });
        router.push(router.asPath, router.asPath, { locale: e.target.value });
    }

    return (
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">{t("Language")}</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={router.locale}
                autoWidth
                onChange={(e) => setLanguage(e)}
                label={t("Language")}
            >
                {router.locales.map((locale: any) => (
                    <MenuItem key={locale} value={locale}>
                        {locale}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}


export default useLanguage;