
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const BASE_URL = 'http://127.0.0.1:3030/api/user/'
const AUTH_URL = 'http://127.0.0.1:3030/api/auth/'

const USER_STORAGE_KEY = 'loggedInUser'


export const userService = {
    login,
    signup,
    logout,
    getLoggedInUser,

    query,
    remove,
    save,
    getById,
    getEmptyCredentials,
}

//returns logged in user
function login({ username, password }) {
    return axios.post(AUTH_URL + 'login', { username, password })
        .then(res => res.data)
        .then(user => {
            console.log(user)
            _setLoggedInUser(user)
            return user
        })
}

function signup(credentials) {
    return axios.post(AUTH_URL + 'signup', credentials)
        .then(res => res.data)
        .then(user => {
            _setLoggedInUser(user)
            return user
        })
}

function logout() {
    return axios.get(AUTH_URL + 'logout')
        .then(()=> sessionStorage.removeItem(USER_STORAGE_KEY))
}

function getLoggedInUser() {
    return JSON.parse(sessionStorage.getItem(USER_STORAGE_KEY))
}

function _setLoggedInUser(user) {
    sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
}

function query(){
    return axios.get(BASE_URL).then(res=> res.data)
}

function getById(userId) {
    return axios.get(BASE_URL + userId).then(res => res.data)
}

function remove(userId) {
    return axios.delete(BASE_URL + userId).then(res => res.data)
}

function save(user) {
    const method = user._id ? 'put' : 'post'
        return axios[method](BASE_URL, user).then(res => res.data)
}

function getEmptyCredentials() {
    return { username: '', password: '', fullname: '' }
}
