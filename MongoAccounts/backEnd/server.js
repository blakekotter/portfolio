const express = require("express");
const cors = require("cors");
const app = express();

const session = require("express-session");
const mongoStore = require("connect-mongo");

require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "HEAD", "PATCH", "POST", "PUT", "DELETE"], 
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(session({
    secret: 'keyboard cat',
    saveUninitialized: true, // create session when something is stores
    resave: false, //don't save session if unmodified
    cookie: { secure: false },
    store: mongoStore.create({ mongoUrl: process.env.ATLAS_URI
    }),
}
));

const dbo = require("./db/conn");

app.use(express.json());

app.use(require("./routes/account"));
app.use(require("./routes/session"));

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(port, () => {
    dbo.connectToServer(function (err) {
        if (err) console.error(err);
    });
    console.log(`Server is running on port ${port}`);
});

const accountRouter = require('./routes/account');
app.use('/', accountRouter);





