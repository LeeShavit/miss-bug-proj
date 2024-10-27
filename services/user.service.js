import fs from 'fs'
import Cryptr from 'cryptr'
import { utilService } from './util.service.js'

const users = utilService.readJsonFile('./data/users.json')
const cryptr = new Cryptr(process.env.SECRET1 || 'secret-puk-1234')

export const userService = {
    query,
    get,
    remove,
    save,

    checkLogin,
    getLoginToken,
    validateToken,
}

function query() {
    return Promise.resolve(users.map(user => ({ _id: user._id, fullname: user.fullname, username: user.username, isAdmin: user.isAdmin })))
}

function get(userId) {
    let user = users.find(user => userId === user._id)
    if (!user) return Promise.reject('User not found!')
    user = {
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        isAdmin: user.isAdmin
    }
    return Promise.resolve(user)
}

function remove(userId) {
    const idx = users.findIndex(user => userId === user._id)
    if (idx < 0) return Promise.reject('user not fount')
    users.splice(idx, 1)
    return _saveUsersToFile()
}

function save(userToSave) {
    if (userToSave._id) {
        const idx = users.findIndex(user => userToSave._id === user._id)
        if (idx < 0) return Promise.reject('user not found')
        users[idx] = userToSave
    } else {
        userToSave._id = utilService.makeId()
        users.unshift(userToSave)
    }

    return _saveUsersToFile()
        .then(() => ({
            _id: userToSave._id,
            fullname: userToSave.fullname,
            isAdmin: userToSave.isAdmin
        }))
}

function _saveUsersToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(users, null, 4)
        fs.writeFile('./data/users.json', data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}

function checkLogin({ username, password }) {
    let user = users.find(user => user.username === username && user.password === password)
    if (user) {
        user = {
            _id: user._id,
            fullname: user.fullname,
            isAdmin: user.isAdmin
        }
    }
    return Promise.resolve(user)
}

function getLoginToken(user) {
    return cryptr.encrypt(JSON.stringify(user))
}

function validateToken(token) {
    if (!token) return null
    // returns decrypted user
    return JSON.parse(cryptr.decrypt(token))
}