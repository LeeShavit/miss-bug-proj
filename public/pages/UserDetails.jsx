
const { useState, useEffect } = React
const { Link, useParams } = ReactRouterDOM

import { userService } from '../services/user.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { bugService } from '../services/bug.service.js'

export function UserDetails() {

    const [user, setUser] = useState(null)
    const [bugs, setBugs] = useState(null)


    useEffect(() => {
        const { _id } = userService.getLoggedInUser()
        userService.getById(_id)
            .then(user => {
                setUser(user)
                return user
            })
            .catch(err => {
                showErrorMsg('Cannot load user')
            })
            .then(user => loadBugs(user))
    }, [])

    function loadBugs(user) {
        console.log(user)
        const filterBy = { _id: user._id }
        bugService.query(filterBy).then(setBugs)
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const description = prompt('New description?')
        const bugToSave = { ...bug, severity, description }
        bugService
            .save(bugToSave)
            .then((savedBug) => {
                console.log('Updated Bug:', savedBug)
                const bugsToUpdate = bugs.map((currBug) =>
                    currBug._id === savedBug._id ? savedBug : currBug
                )
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch((err) => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }


    function onRemoveBug(bugId) {
        bugService
            .remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    if (!user) return <h1>loadings....</h1>

    const { _id, username, fullname, isAdmin } = user
    return (<div>
        <h3>User Details</h3>
        <h4>{fullname}</h4>
        <p>username: {username} id: {_id} {!isAdmin && 'not '}an admin</p>
        <p>id: {_id}</p>
        <p>{!isAdmin && 'not '}an admin</p>
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
        <Link to="/home">Back to home</Link>
    </div>
    )
}

