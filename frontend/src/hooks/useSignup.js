import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import toast from "react-hot-toast";

export const useSignup = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch} = useAuthContext() 
    const signup = async (email, password, firstName, middleName, lastName, suffix, username, dateofbirth) => {
        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/user/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password, firstName, middleName, lastName, suffix, username, dateofbirth})
        })
        const json = await response.json()

        if (!response.ok){
            setIsLoading(false)
            setError(json.error)
        }
        if (response.ok){
            // save the user to local storage
            localStorage.setItem('user', JSON.stringify(json))

            // update the auth contect
            dispatch({type: 'LOGIN', payload: json})
            setIsLoading(false)
            toast.success(`Welcome, ${json.userData.firstName}!`, {
                duration: 8000,
                style: {
                    border: "1px solid #4caf50", 
                    padding: "16px", 
                    fontSize: "1.2rem", 
                  },
            });
        }
    }

    return {signup, isLoading, error, setError}
}