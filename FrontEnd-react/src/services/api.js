import axios from 'axios'

const api = axios.create({
 // baseURL: 'https://expense-tracker-back-node.herokuapp.com/api'
 baseURL: 'http://localhost:5000/api'
})


export { api }
