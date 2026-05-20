import { useContext, useEffect} from "react";
import { AuthContext } from "../auth.context.jsx";
import { login, register, logout, getMe } from "../services/auth.api.js";



export const useAuth = () =>{
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    const handleLogin = async({email, password})=>{
        try {
            const data = await login({email, password})
            setUser(data.user)
            localStorage.setItem("token", data.token)
        } catch (error) {
            console.log("Error while login please check useAuth.js file")            
            alert("Invalid Credentials")
        }
    }

    const handleRegister = async ({username, email, password})=>{
        try {
            const data = await register({username, email, password})
            setUser(data.user)
            localStorage.setItem("token", data.token)
        } catch (error) {
            console.log("Error while register please check useAuth.js file")            
            
        }
    }

    const handleLogout = async ()=>{
        try {
            const data = await logout()
            if(data) {
                setUser(null)
                localStorage.removeItem("token")
            }
        } catch (error) {
            console.log("Error while logout please check useAuth.js file") 

        }
    }


    useEffect(() => {
        const token = localStorage.getItem("token")

        const getAndSetUser = async()=>{
            try {
                const data = await getMe()
                setUser(data.user)
            } catch (error) {
                console.log("Error while fetching user data please check useAuth.js file")
                localStorage.removeItem("token")
            }finally{
                setLoading(false)
            }
        }
    
        if(token){
            getAndSetUser()
        }else{
            setLoading(false)
        }

    }, [])


    return {
        user,
        loading, 
        handleLogin,
        handleLogout,
        handleRegister
    }
}