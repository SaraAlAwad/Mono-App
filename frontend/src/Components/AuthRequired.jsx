import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { apiUrl } from "../api/api"

const AuthRequired = (props) => {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if(props.token) {
            setLoading(false)
            return
        }
        
        fetch(apiUrl + "/api/users/refreshtoken", {
            method: "POST",
            mode: 'cors',
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        })
        .then(response => response.json())
        .then((data) => {
            setLoading(false)
            console.log(data)
            if(data.token) {
                props.setToken(data.token)
            }
        })
    }, [props])

    if(loading) {
        return <p className='text-light'>Loading...</p>
    } 
    
    if(!props.token) {
        return <Navigate to="/" />
    }

    
    return <>{props.children}</>
}
 
export default AuthRequired;