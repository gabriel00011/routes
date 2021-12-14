const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")
const secret = "password"

app.use(bodyParser.urlencoded({ extended: true }))

function verifyJwt(req, res, next) {
    const token = req.headers["x-access-token"]
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).end()
        }

        req.userId = decoded.userId
        next()
    })
}

app.get("/AppJwt", verifyJwt, (req, res, next) => {
    res.set({'Content-Type': 'text/plain'})
    console.log('chamada de usuario ' + req.userId)
    res.send("Hello World")
})

app.post("/login", (req, res, next) => {
    if (req.body.user === "luiz" && req.body.password === "123") {
        const token = jwt.sign({ userId: 1 }, secret, { expiresIn: 300 })
        return res.json({ auth: "true", token })
    }

    res.status(401).end()
})

app.listen(8081, () => {
    console.log("execute>>>")
})