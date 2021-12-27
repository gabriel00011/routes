const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")
const cors = require("cors")
const secret = "password"
const credential = require("./credential.development.json")
const cookie = require("cookie")
const port = process.env.PORT || 8081


app.disable('x-powered-by');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

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

app.get("/", (req, res, next) => {
    res.send("Cadastrado no heroku")

    console.log(req.hostname)
})

app.get("/AppJwt", verifyJwt, (req, res, next) => {

    res.set({ 'Content-Type': 'application/json' })
    console.log('chamada de usuario ' + req.userId)
    res.json({ Status: 200 })

})

app.post("/login", (req, res, next) => {

    console.log('user ', req.body.user)
    console.log('password ', req.body.password)

    if (req.body.user === "luiz" && req.body.password === "senha123") {
        const token = jwt.sign({ userId: 1 }, secret, { expiresIn: 300 })
        return res.json({ auth: "true", token })
    }

    res.status(401).end()
})

app.get("/user(name)?", (req, res, next) => {

    if (0 == 0) next();
    res.send("unique path 1")
},

    (req, res, next) => {
        if (0 == 0) next();
        res.send("unique path 2")
    },

    (req, res, next) => {
        res.send("unique path 3")
    },
);

app.get("/flutter/:nome", (req, res, next) => {

    const { nome } = req.params;
    res.type("text/plain")
    res.send("voce conseguiu");
    console.log(nome);
    console.log(`Hostname ${req.hostname}`)
    console.log(`ip ${req.ip}`)

});

app.listen(port, () => {
    console.log("execute>>>")
})

app.use((req, res, next) => {
    res.type('text/plain');
    res.send('<h1> 404 - Not Found </h1>').status(404);

    next()
})

app.use((err, req, res, next) => {
    console.log(err.message);
    res.type('text/plain');
    res.send("<h1> 500 - error server </h1>").status(500);
})