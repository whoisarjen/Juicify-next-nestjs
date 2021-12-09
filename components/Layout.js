import Head from 'next/head'
import Navbar from './Navbar'
import Footer from './Footer'
import { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { useDispatch } from 'react-redux'
import { setToken } from '../redux/features/tokenSlice'
import { io } from "socket.io-client";

const Layout = ({ children }) => {
    const [cookies] = useCookies()
    const dispatch = useDispatch()

    useEffect(() => {
        if(cookies.token){
            dispatch(setToken(cookies.token))
            const socket = io('http://localhost:1000')
        }
    }, [cookies.token])

    return (
        <div className="layout">
            <Head>
                <title>Dynamic title INC...</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Navbar/>
                <div className="content">
                    { children }
                </div>
            <Footer/>
        </div>
    );
}
 
export default Layout;