import useTranslation from "next-translate/useTranslation";
import { FunctionComponent } from "react";
import styled from "styled-components";

const Grid = styled.div`
    text-align: center;
    width: 100%;
    height: 100%;
    display: grid;
`

const Box = styled.div`
    width: 100%;
    margin: auto;
`

const Error404: FunctionComponent = () => {
    const { t } = useTranslation('error')

    return (
        <Grid>
            <Box className="error404box">
                <h1>404</h1>
                <h2>{t('ERROR_404')}</h2>
            </Box>
        </Grid>
    );
};

export default Error404;
