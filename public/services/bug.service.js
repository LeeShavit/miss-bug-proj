
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

// const STORAGE_KEY = 'bugDB'
const BASE_URL = 'http://127.0.0.1:3030/api/bug/'

// _createBugs()

export const bugService = {
    query,
    getById,
    save,
    remove,
}


function query() {
    return axios.get(BASE_URL).then(res => res.data)
}

function getById(bugId) {
    return axios.get(BASE_URL + bugId).then(res => res.data)
}

function remove(bugId) {
    return axios.get(BASE_URL + bugId + '/remove').then(res => res.data)
}

function save(bug) {
    let query = new URLSearchParams(bug)
    return axios.get(BASE_URL + 'save?' + query.toString()).then(res => res.data)
}

// function _createBugs() {
//     let bugs = utilService.loadFromStorage(STORAGE_KEY)
//     if (!bugs || !bugs.length) {
//         bugs = [
//             {
//                 title: "Infinite Loop Detected",
//                 severity: 4,
//                 _id: "1NF1N1T3"
//             },
//             {
//                 title: "Keyboard Not Found",
//                 severity: 3,
//                 _id: "K3YB0RD"
//             },
//             {
//                 title: "404 Coffee Not Found",
//                 severity: 2,
//                 _id: "C0FF33"
//             },
//             {
//                 title: "Unexpected Response",
//                 severity: 1,
//                 _id: "G0053"
//             }
//         ]
//         utilService.saveToStorage(STORAGE_KEY, bugs)
//     }



// }
