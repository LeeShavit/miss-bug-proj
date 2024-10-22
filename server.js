import express from 'express'
import cookieParser from 'cookie-parser'
import { bugService } from './services/bugs.service.js'
import { pdfService } from "./services/pdf.service.js"


const app = express()

app.listen(3030, () => console.log('Server ready at port 3030'))

//express configuration
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())


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

//saveAsPDF
app.get('/api/bug/download', (req, res) => {
    bugService.query()
        .then(bugs => pdfService.buildBugPDF(bugs))
        .then(() => {
            const filePath = './data/bugs.pdf'
            res.download(filePath, 'bugs.pdf', (err) => {
                if (err) {
                    console.error('Error downloading the PDF:', err)
                    res.status(500).send('Error downloading the file')
                }
            })
        })
        .catch(err => {
            console.error('Error creating PDF:', err)
            res.status(500).send('Cannot create pdf')
        })
})

//create
app.post('/api/bug/', (req, res) => {
    const bugToSave = { ...req.body, severity: +req.body.severity } 
    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch(err => {
            console.log('err:', err)
            res.status(500).send('Cannot Save bug')
        })
})
//update
app.put('/api/bug/', (req, res) => {
    const bugToSave = { ...req.body, severity: +req.body.severity } 
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
app.delete('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() => res.send(`bug ${bugId} removed successfully`))
        .catch(err => {
            console.log('err:', err)
            res.status(500).send('Cannot remove bug')
        })
})