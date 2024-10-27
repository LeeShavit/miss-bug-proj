import fs from 'fs'
import { utilService } from './util.service.js'

const bugs = utilService.readJsonFile('./data/bugs.json')
const PAGE_SIZE = 8

export const bugService = {
    query,
    get,
    remove,
    save,
}

function query(filterBy, sortBy) {
    return Promise.resolve(bugs)
        .then(bugs => {
            //sorting
            if (sortBy.dir === 0) sortBy.dir = 1
            if (sortBy.key === 'title') bugs = bugs.sort((a, b) => (a.title.localeCompare(b.title)) * sortBy.dir)
            if (sortBy.key === 'severity') bugs = bugs.sort((a, b) => (b.severity - a.severity) * sortBy.dir)
            if (sortBy.key === 'createdAt') bugs = bugs.sort((a, b) => (b.createdAt - a.createdAt) * sortBy.dir)
            //filtration
            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                bugs = bugs.filter(bug => regExp.test(bug.title))
            }
            if (filterBy.minSeverity) bugs = bugs.filter(bug => bug.severity >= filterBy.minSeverity)
            if (filterBy.labels) {
                const labels = filterBy.labels.trim().toLowerCase().split(',')
                bugs = bugs.filter(bug => labels.some(label => bug.labels.includes(label)))
            }
            if(filterBy._id)
                bugs= bugs.filter(bug=> bug.creator._id === filterBy._id)
            if (filterBy.pageIdx !== undefined) {
                const startIdx = +filterBy.pageIdx * PAGE_SIZE // 0,3,6
                bugs = bugs.slice(startIdx, startIdx + PAGE_SIZE)
            }
            return bugs
        })
}

function get(bugId) {
    const bug = bugs.find(bug => bugId === bug._id)
    return Promise.resolve(bug)
}

function remove(bugId, loggedInUser) {
    const idx = bugs.findIndex(bug => bugId === bug._id)
    if (idx < 0) return Promise.reject('bug not fount')

    if (!loggedInUser.isAdmin &&
        bugs[idx].creator._id !== loggedInUser._id) return Promise.reject('not your bug')

    bugs.splice(idx, 1)
    return _saveBugsToFile()
}

function save(bugToSave, loggedInUser) {
    if (bugToSave._id) {
        const idx = bugs.findIndex(bug => bugToSave._id === bug._id)
        if (idx < 0) return Promise.reject('bug not found')
        if (!loggedInUser.isAdmin &&
            bugs[idx].creator._id !== loggedInUser._id) return Promise.reject('not your bug')

        bugs[idx] = {
            ...bugs[idx],
            title: bugToSave.title,
            description: bugToSave.description,
            severity: bugToSave.severity
        }
    } else {
        bugToSave.creator = loggedInUser
        bugToSave = {
            ...bugToSave,
            _id: utilService.makeId(),
            createdAt: Date.now(),
            creator: loggedInUser
        }
        bugs.unshift(bugToSave)
    }
    return _saveBugsToFile().then(() => bugToSave)
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile('./data/bugs.json', data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}