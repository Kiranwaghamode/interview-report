import React, { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router'


const Protected = ({children}) => {
    const navigate = useNavigate()
    const { loading, user} = useAuth()

     useEffect(() => {
        if (!loading && !user) {
        navigate('/login')
        }
    }, [user, loading])

  return children
}

export default Protected