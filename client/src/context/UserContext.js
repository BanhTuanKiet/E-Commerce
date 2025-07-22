import { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

const UserContext = createContext()

const UserProvider = ({ children }) => {
    const navigate = useNavigate()
    const [user, setUser] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        gender: "",
        password: "",
        passwordConfirmed: "",
        location: {
            address: "",
            ward: "",
            city: "",
        },
    })

    useEffect(() => {
        const getUserName = () => {
            const userCookie = Cookies.get('user')

            if (!userCookie) {
                return
            }

            const paredUserCookie = JSON.parse(userCookie)
            setUser({ ...user, name: paredUserCookie.name })
        }

        getUserName()
    }, [])

    const signup = (email) => {
        setUser(({ ...user, email: email, password: "" }))
        navigate('/signin')
    }

    const signin = (email, name) => {
        Cookies.set('user', JSON.stringify({ name: name }), { expires: 1 / 24 })
        setUser({ ...user, name: name, email: email })
        const prevPage = localStorage.getItem('prevPage')
        console.log(prevPage)
        navigate(prevPage.toString())
    }

    const signout = () => {
        Cookies.remove('user')
        setUser({ ...user, name: '', email: '' })
        navigate('/signin')
    }

    return (
        <UserContext.Provider value={{ user, setUser, signin, signout, signup }}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserProvider }