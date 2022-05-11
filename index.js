const express = require('express');
const cors = require('cors');
const jsonwebtoken = require('jsonwebtoken');
const app = express()
require('dotenv').config()
const jwt = require('jsonwebtoken')
const port = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(express.json())

const verifyjwt = (req, res, next) => {
    const authHeader = req.headers.authorization
    // console.log('insede header', authHeader)
    if (!authHeader) {
        return res.status(401).send({ message: "unauthorized" })
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SCREET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: "forbidden" })
        }
        req.decoded = decoded
        next()
    })
}

app.get('/', (req, res) => {
    res.send('hello world')
})

app.post('/login', (req, res) => {
    const user = req.body
    console.log(user)
    if (user.email === 'user@gmail.com' && user.password === '123456') {
        const accessToken = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SCREET, { expiresIn: "1h" })
        res.send({
            success: true,
            accessToken: accessToken
        })

    }
    else {

        res.send({ success: false })
    }
})

app.get('/orders', verifyjwt, (req, res) => {
    // console.log(req.headers.authorization)
    res.send([{ id: 1, name: "orange" }, { id: 2, name: "apple" }])
})

app.listen(port, () => {
    console.log('simple jwt running', port)
})