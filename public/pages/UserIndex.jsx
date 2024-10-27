import { userService } from '../services/user.service.js'
import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

const { useState, useEffect } = React

export function UserIndex() {
    const [users, setUsers] = useState(null)

    useEffect(() => {
        loadUsers()
    }, [])

    function loadUsers() {
        userService.query().then(setUsers)
    }

    function onRemoveUser(userId) {
        bugService.query()
            .then(bugs => {
                const hasBugs = bugs.some(bug => bug.creator._id === userId)
                return hasBugs
            })
            .then(hasBugs => {
                if (hasBugs) return
                userService
                    .remove(userId)
                    .then(() => {
                        console.log('Deleted Succesfully!')
                        const usersToUpdate = users.filter((user) => user._id !== userId)
                        setUsers(usersToUpdate)
                        showSuccessMsg('user removed')
                    })
                    .catch((err) => {
                        console.log('Error from onRemoveUser ->', err)
                        showErrorMsg('Cannot remove user')
                    })
            }
            )
    }


    // function onAddUser() {
    //     const user = {
    //         title: prompt('user title?'),
    //         severity: +prompt('user severity?'),
    //     }
    //     userService
    //         .save(user)
    //         .then((savedUser) => {
    //             console.log('Added user', savedUser)
    //             setUsers([...users, savedUser])
    //             showSuccessMsg('user added')
    //         })
    //         .catch((err) => {
    //             console.log('Error from onAddUser ->', err)
    //             showErrorMsg('Cannot add user')
    //         })
    // }

    function onEditUser(user) {
        const username = prompt('New username?')
        // const fullname = prompt('New name?')
        // const password = prompt('New password?')
        const userToSave = {
            ...user,
            username
            // fullname: fullname || user.fullname,
            // password: password || user.password
        }
        userService
            .save(userToSave)
            .then((savedUser) => {
                const usersToUpdate = users.map((currUser) =>
                    currUser._id === savedUser._id ? savedUser : currUser
                )
                setUsers(usersToUpdate)
                showSuccessMsg('user updated')
            })
            .catch((err) => {
                console.log('Error from onEditUser ->', err)
                showErrorMsg('Cannot update user')
            })
    }

    if (!users) return <div>loading...</div>


    return (
        <main>
            <section className='info-actions'>
                <h3>Admin users management</h3>
                {/* <button onClick={onAddUser}>Add user ⛐</button> */}

            </section>
            <ul className="users-list">
                {users.map(user => (
                    <li className="user-preview" key={user._id}>
                        <span>{user.fullname} </span>
                        <span>{user.username} </span>
                        <span>{user._id}</span>
                        <span>{user.isAdmin === 'false' && 'Not '}Admin</span>
                        <button onClick={() => onRemoveUser(user._id)}>x</button>
                        <button onClick={() => onEditUser(user)}>Edit</button>
                    </li>
                ))
                }
            </ul >
        </main>
    )
}
