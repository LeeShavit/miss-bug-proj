const { useState, useEffect, useRef } = React

import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js"
import { userService } from "../services/user.service.js"


export function LoginSignup({ onSetUser }) {

    const [isSignup, setIsSignup] = useState(false)
    const [credentials, setCredentials] = useState(userService.getEmptyCredentials())


    function onHandleSubmit(ev) {
        ev.preventDefault()

        if (isSignup) {
            userService.signup(credentials)
                .then(onSetUser)
                .then(() => showSuccessMsg('Welcome'))
                .catch(() => showErrorMsg('Try again'))
        } else {
            userService.login(credentials)
                .then(user=>  onSetUser(user))
                .then(() => showSuccessMsg('Welcome back'))
                .catch(() => showErrorMsg('Try again'))
        }
    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value
        setCredentials(prevCredentials => ({ ...prevCredentials, [field]: value }))
    }


    const { username, password, fullname } = credentials

    return (
        <section>
            <form onSubmit={onHandleSubmit}>
                <input placeholder="User name" value={username} onChange={handleChange} name="username" type="text" autoComplete="off" required/>

                <input placeholder="Password" value={password} onChange={handleChange} name="password" type="password" autoComplete="off" required/>

                {isSignup &&
                    <input placeholder="Full name" value={fullname || ''} onChange={handleChange} name="fullname" type="text" autoComplete="off" required/>}

                <button>{isSignup ? 'Signup' : 'Login'}</button>
            </form>
            <div onClick={() => setIsSignup(!isSignup)}>{!isSignup ? 'New user? signup here' : 'Already a member? Login here'}</div>
        </section>
    )
}
