import useTranslation from "next-translate/useTranslation";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import styled from "styled-components";
import NavbarOnlyTitle from "../../common/navbar-only-title";

const Box = styled.div`
    width: 100%;
    height: calc(100vh - var(--BothNavHeightAndPadding));
    display: grid;
    grid-template-rows: 44px auto auto 44px;
    grid-gap: 5px;
    text-align: center;
    ${this} div {
        margin: auto;
    }
`

const ArrowBack = styled.div`
    margin: auto 0;
    width: 100%;
    display: grid;
    grid-template-columns: 40px 1fr;
`

const Tutorial_6 = ({ setStep }: { setStep: (arg0: string) => void }) => {
    const { t } = useTranslation('coach')

    return (
        <Box>
            <ArrowBack>
                <IconButton aria-label="back" onClick={() => setStep('Tutorial_5')}>
                    <KeyboardBackspaceIcon />
                    <div />
                </IconButton>
            </ArrowBack>
            <NavbarOnlyTitle title="coach:EXTRA_ACTIVITY" />
            <div>{t('TUTORIAL_6')}</div>
            <Button variant="contained" onClick={() => setStep('Tutorial_7')}>{t('NEXT_STEP')}</Button>
        </Box>
    )
}

export default Tutorial_6;