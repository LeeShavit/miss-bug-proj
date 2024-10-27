import { userService } from './user.service.js'

// const STORAGE_KEY = 'bugDB'
const BASE_URL = 'http://127.0.0.1:3030/api/bug/'

// _createBugs()

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getDefaultSort,
    loadPDF,
}


function query(filterBy, sortBy = null) {
    return axios.get(BASE_URL, { params: { ...filterBy, ...sortBy } })
        .then(res => res.data)
}

function getById(bugId) {
    return axios.get(BASE_URL + bugId).then(res => res.data)
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId).then(res => res.data)
}

function save(bug) {
    const method = bug._id ? 'put' : 'post'
        return axios[method](BASE_URL, bug).then(res => res.data)
}

function getDefaultFilter() {
    return { txt: '', minSeverity: 0, labels: '', pageIdx: '' }
}
function getDefaultSort() {
    return { key: '', dir: '' }
}

function loadPDF() {
    return axios.get(BASE_URL + 'download')
}
