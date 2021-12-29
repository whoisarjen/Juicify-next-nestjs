import { FunctionComponent } from "react";
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from "next/router";

interface BottomFlyingGuestBannerProps {
    user: any
}

const BottomFlyingGuestBanner: FunctionComponent<BottomFlyingGuestBannerProps> = ({ user }) => {
    const router = useRouter()
    
    return (
        <div className="bottomFlyingGuestBanner">
            {
                user &&
                (
                    <>
                        <div
                            style={{
                                height: 36.5,
                                width: '100%'
                            }}
                        />
                        <Button
                            onClick={() => router.push(`/${router.query.login}`)}
                            sx={{
                                width: '100%',
                                maxWidth: 700,
                                position: 'fixed',
                                bottom: 52
                            }}
                            variant="contained"
                            startIcon={<DeleteIcon />}
                        >
                            Watching {user.login}'s profile
                        </Button>
                    </>
                )
            }
        </div>
    )
}

export default BottomFlyingGuestBanner;