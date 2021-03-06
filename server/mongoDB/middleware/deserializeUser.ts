import { get } from 'lodash'
import { Request, Response, NextFunction } from 'express'
import { verifyJWT } from '../../utils/jwt.utils';
import { reIssueAccessToken } from '../service/session.service';

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {

    const token = get(req, 'cookies.token') || get(req, 'headers.authorization', '').replace(/^Bearer\s/, '')
    const refresh_token = get(req, 'cookies.refresh_token') || get(req, 'headers.x-refresh', '').replace(/^Bearer\s/, '')
    const socket_ID = get(req, 'cookies.socket_ID') || get(req, 'headers.x-socket_ID', '').replace(/^Bearer\s/, '')

    if (!token) {
        return next();
    }

    const { decoded, expired } = verifyJWT(token)

    if (decoded) {
        res.locals.token = decoded
    }

    if (expired && refresh_token) {
        const newToken = await reIssueAccessToken(refresh_token, res)

        if (newToken) {
            res.setHeader('x-access-token', newToken)

            res.cookie('token', newToken, {
                maxAge: parseInt(process.env.COOKIE_TOKEN_LIFE_TIME_IN_S as string),
                httpOnly: !!process.env.COOKIE_HTTPONLY,
                domain: process.env.COOKIE_DOMAIN,
                path: '/',
                sameSite: 'strict',
                secure: !!process.env.COOKIE_SECURE
            })

            const result = verifyJWT(newToken)

            res.locals.token = result.decoded;
        }
    }

    if (socket_ID) {
        res.locals.socket_ID = socket_ID;
    }

    return next();
}

export default deserializeUser;