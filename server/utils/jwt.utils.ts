import jwt from 'jsonwebtoken'
import config from 'config'

const tokenKey = config.get<string>('TOKEN_KEY')

export function signJWT(object: Object, options?: jwt.SignOptions | undefined) {
    return jwt.sign(object, tokenKey, {
        ...(options && options),
        // algorithm: 'RS256'
    })
}

export function verifyJWT(token: string) {
    try {
        const decoded = jwt.verify(token, tokenKey)
        return {
            valid: true,
            expired: false,
            decoded,
        }
    } catch (error: any) {
        return {
            valid: false,
            expired: error.message === 'jwt expired',
            decoded: null
        }
    }
}