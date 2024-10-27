import express from 'express'
import cookieParser from 'cookie-parser'
import { bugService } from './services/bug.service.js'
import { userService } from './services/user.service.js'
import { pdfService } from "./services/pdf.service.js"
import { loggerService } from "./services/logger.service.js"


const app = express()
const PORT = 3030

app.listen(PORT, () => console.log(`Server ready at port ${PORT}`))

//express configuration
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

//express routing for Bugs:
//read list
app.get('/api/bug', ({ query }, res) => {
    const filterBy = { txt: query.txt || '', minSeverity: +query.minSeverity || 0, labels: query.labels, pageIdx: query.pageIdx, _id: query._id }
    const sortBy = { key: query.key, dir: +query.dir }
    bugService.query(filterBy, sortBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error('Cannot find bugs', err)
            res.status(500).send('Cannot find bugs')
        })
})

//saveAsPDF
app.get('/api/bug/download', (req, res) => {
    bugService.query()
        .then(bugs => pdfService.buildBugPDF(bugs))
        .then(() => {
            const filePath = './data/bugs.pdf'
            res.download(filePath, 'bugs.pdf', (err) => {
                if (err) {
                    loggerService.error('Cannot download PDF', err)
                    res.status(500).send('Error downloading the file')
                }
            })
        })
        .catch(err => {
            loggerService.error('Cannot create pdf', err)
            res.status(500).send('Cannot create pdf')
        })
})

//create
app.post('/api/bug/', (req, res) => {
    const loggedInUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedInUser) return res.status(401).send('Cannot create bug')

    const bugToSave = { ...req.body, severity: +req.body.severity }
    bugService.save(bugToSave, loggedInUser)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot create bug', err)
            res.status(500).send('Cannot create bug')
        })
})

//update
app.put('/api/bug/', (req, res) => {
    const loggedInUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedInUser) return res.status(401).send('Cannot remove bug')

    const bugToSave = { ...req.body, severity: +req.body.severity, createdAt: +req.body.createdAt }
    bugService.save(bugToSave, loggedInUser)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot save bug', err)
            res.status(500).send('Cannot Save bug')
        })
})

//read item
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    const visitedBugs = req.cookies.visitedBugs || []
    bugService.get(bugId)
        .then(bug => {
            if (visitedBugs.includes(bugId)) {
                res.send(bug)
            } else {
                visitedBugs.push(bugId)
                res.cookie('visitedBugs', visitedBugs, { maxAge: 1000 * 7 })
                if (visitedBugs.length > 3) {
                    res.status(401).send('Wait for a bit')
                } else {
                    res.send(bug)
                }
            }
        })
        .catch(err => {
            loggerService.error('Cannot find bug', err)
            res.status(500).send('Cannot find bug')
        })

})

//delete
app.delete('/api/bug/:bugId', (req, res) => {
    const loggedInUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedInUser) return res.status(401).send('Cannot remove bug')

    const { bugId } = req.params
    bugService.remove(bugId, loggedInUser)
        .then(() => res.send(`bug ${bugId} removed successfully`))
        .catch(err => {
            loggerService.error('Cannot remove bug', err)
            res.status(500).send('Cannot remove bug')
        })
})

//express routing for Users
//users list
app.get('/api/user', (req, res) => {
    const loggedInUser = userService.validateToken(req.cookies.loginToken)
    if(!loggedInUser.isAdmin) return res.status(401).send('can not access users')
    userService.query()
        .then(users => res.send(users))
        .catch(err => {
            loggerService.error('Cannot find users', err)
            res.status(500).send('Cannot find users')
        })
})

// get user
app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params
    console.log(req.params)
    userService.get(userId)
        .then(user => res.send(user))
        .catch(err => {
            loggerService.error('Cannot find user', err)
            res.status(400).send('Cannot find user')
        })
})

//create
app.post('/api/user/', (req, res) => {
    const loggedInUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedInUser || !loggedInUser.isAdmin) return res.status(401).send('Cannot create user')

    const bugToSave = { ...req.body, severity: +req.body.severity }
    bugService.save(bugToSave, loggedInUser)
        .then(user => res.send(user))
        .catch(err => {
            loggerService.error('Cannot create user', err)
            res.status(500).send('Cannot create user')
        })
})

//update
app.put('/api/user/', (req, res) => {
    const loggedInUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedInUser || !loggedInUser.isAdmin) return res.status(401).send('Cannot update user')

    const userToSave = { ...req.body}
    console.log(userToSave)
    userService.save(userToSave, loggedInUser)
        .then(user => res.send(user))
        .catch(err => {
            loggerService.error('Cannot save user', err)
            res.status(500).send('Cannot Save user')
        })
})

// remove user
app.delete('/api/user/:userId', (req, res) => {
    const loggedInUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedInUser || !loggedInUser.isAdmin) return res.status(401).send('Cannot remove user')

    const { userId } = req.params
    userService.remove(userId, loggedInUser)
        .then(() => res.send(`user ${userId} removed successfully`))
        .catch(err => {
            loggerService.error('Cannot remove user', err)
            res.status(500).send('Cannot remove user')
        })
})

//Authentication API
//signUp
app.post('/api/auth/signup', (req, res) => {
    const userToSave = req.body

    userService.save(userToSave)
        .then(user => {
            res.cookie('loginToken', userService.getLoginToken(user))
            res.send(user)
        })
        .catch(err => {
            loggerService.error('Cannot signup', err)
            res.status(400).send('Cannot signup')
        })
})

//login
app.post('/api/auth/login', (req, res) => {
    const credentials = req.body

    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                res.cookie('loginToken', userService.getLoginToken(user))
                res.send(user)
            } else {
                res.status(401).send('Invalid credentials')
            }
        })
})

app.get('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Logged Out')
})