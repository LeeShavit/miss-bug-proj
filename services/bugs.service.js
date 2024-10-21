import fs from 'fs'
import { utilService } from './util.service.js'

const bugs = utilService.readJsonFile('./data/bugs.json')

export const bugService = {
    query,
    get,
    remove,
    save,
}

function query(){
    return Promise.resolve(bugs)
}

function get(bugId) {
    const bug = bugs.find(bug => bugId === bug._id)
    return Promise.resolve(bug)
}

function remove(bugId) {
    const idx = bugs.findIndex(bug => bugId === bug._id)
    if (idx < 0) return Promise.reject('bug not fount')
    bugs.splice(idx, 1)
    return _saveBugsToFile()
}

function save(bugToSave) {
    if (bugToSave._id) {
        const idx = bugs.findIndex(bug => bugToSave._id === bug._id)
        if (idx < 0) return Promise.reject('bug not found')
        bugs[idx] = bugToSave
    } else {
        bugToSave._id = utilService.makeId()
        bugs.unshift(bugToSave)
    }
    return _saveBugsToFile().then(()=> bugToSave)
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