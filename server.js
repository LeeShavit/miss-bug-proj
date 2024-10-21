import express from 'express'
import { bugService } from './services/bugs.service.js'

const app = express()

app.listen(3030, () => console.log('Server ready at port 3030'))

//express configuration
app.use(express.static('public'))


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
    const bugToSave = { _id, title, severity: +severity, description, createdAt}
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
    bugService.get(bugId)
        .then(bug => res.send(bug))
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
