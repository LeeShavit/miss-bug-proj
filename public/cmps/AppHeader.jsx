const { NavLink, useNavigate } = ReactRouterDOM
const { useState } = React

import { LoginSignup } from './LoginSignup.jsx'
import { userService } from "../services/user.service.js"
import { UserMsg } from './UserMsg.jsx'
import { showErrorMsg } from '../services/event-bus.service.js'

export function AppHeader() {

    const [user, setUser] = useState(userService.getLoggedInUser())
    const navigate = useNavigate()

    function onLogout() {
        userService.logout()
            .then(() => {
                setUser(null)
                navigate(-1)
            })
            .catch(err => showErrorMsg('could not log out'))
    }

    function onSetUser(user) {
        setUser(user)
        navigate('/')
    }

    return (
        <header className='container'>
            <UserMsg />
            <nav>
                <NavLink to="/">Home</NavLink> |<NavLink to="/bug">Bugs</NavLink> |
                <NavLink to="/about">About</NavLink>
                {user && <NavLink to={`/user/${user._id}`}>Profile</NavLink>}
                {user.isAdmin && <NavLink to="/user">Users</NavLink>}
            </nav>
            <h1>Bugs are Forever</h1>
            {user
                ? <p>Welcome {user.fullname}
                    <button onClick={onLogout}>Logout?</button>
                </p>
                : <LoginSignup onSetUser={onSetUser} />
            }
        </header>
    )
}
