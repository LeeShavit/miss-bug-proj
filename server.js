import express from 'express'
import cookieParser from 'cookie-parser'
import { bugService } from './services/bugs.service.js'

const app = express()

app.listen(3030, () => console.log('Server ready at port 3030'))

//express configuration
app.use(express.static('public'))
app.use(cookieParser())


//express routing:
//read list
app.get('/api/bug', (req, res) => {
    bugService.query()
        .then(bugs => res.send(bugs))
        .catch(err => {
            console.log('err:', err)
            res.status(500).send('Cannot find bugs')
        })
})

//save
app.get('/api/bug/save', (req, res) => {
    const { _id, title, severity, description, createdAt } = req.query
    const bugToSave = { _id, title, severity: +severity, description, createdAt }
    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch(err => {
            console.log('err:', err)
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
            console.log('err:', err)
            res.status(500).send('Cannot find bug')
        })

})
//delete
app.get('/api/bug/:bugId/remove', (req, res) => {
    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() => res.send(`bug ${bugId} removed successfully`))
        .catch(err => {
            console.log('err:', err)
            res.status(500).send('Cannot remove bug')
        })

})
