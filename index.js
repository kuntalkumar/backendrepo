const express = require("express");
const bcrypt = require("bcrypt"); // Add this line
const jwt = require("jsonwebtoken"); // Add this line

const app = express();
const { TwiterModel } = require('./Model/Tweeter.js');
const {  CustmerModels } = require('./Model/User.js');
const { connection } = require('./Config/db.js');

const cors = require("cors");
app.use(express.json());

app.use(cors({
    origin : "*"
  }))

app.get('/', async (req, res) => {
    res.send("Hello World");
});

//......................authentication at here......................................

const authentication = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.send("log in first");
    } else {
        jwt.verify(token, "kuntal", function (err, decode) {
            if (err) {
                res.send("login first");
            } else {
                const { userID } = decode;
                req.userID = userID;
                next();
            }
        });
    }
};

//..............................signup at here...................................................

app.post("/signup", async (req, res) => {
    const { name, email, password, gender, country } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10); // Use async/await for bcrypt
        const data = await CustmerModels.create({
            name,
            email,
            password: hash,
            gender,
            country,
            
        });
        res.send(data);
    } catch (err) {
        console.log("something wrong", err);
        res.status(500).send({ msg: "Internal Server Error" });
    }
});

//...................LOGIN............................

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const is_user = await CustmerModels.findOne({ email });
        if (is_user) {
            const userPassword = is_user.password;
            const result = await bcrypt.compare(password, userPassword);
            if (result) {
                const token = jwt.sign({ userID: is_user._id }, "kuntal", { expiresIn: '1h' });
                res.send({ msg: "login successful", token: token });
            } else {
                res.send("login fail, password miss matched");
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: "Internal Server Error" });
    }
});

app.get("/user", async (req, res) => {
    try {
        const data = await CustmerModels.find();
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: "Internal Server Error" });
    }
});

// *****************************************Tweeter here ************************************************

app.get("/twiter", authentication,async (req, res) => {
    try {
        const data = await TwiterModel.find();
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: "Internal Server Error" });
    }
});

app.post("/twiteradd",authentication, async (req, res) => {
    const { title, body, category } = req.body;
    try {
        const data = await TwiterModel.create({
            title,
            body,
            category
        });
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: "Internal Server Error" });
    }
});

app.put("/twiter/:twiterId",authentication, async (req, res) => {
    try {
        const update = await TwiterModel.findByIdAndUpdate(
            req.params.twiterId,
            req.body,
            { new: true }
        );
        if (update) {
            res.status(201).send("All done " + update);
        } else {
            console.log(object);
            console.log(" failed to updated ");
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Not Authorized" });
    }
});

// DELETE /products/:productID endpoint part
app.delete("/twitter/:twiterId",authentication, async (req, res) => {
    try {
        const deletemadi = await TwiterModel.findByIdAndDelete(
            req.params.twiterId
        );
        if (deletemadi) {
            res.status(200).send("Deleted" + deletemadi);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: "Internal Server Error" });
    }
});

app.listen(8080, async () => {
    try {
        await connection();
        console.log("Connected to the database");
    } catch (err) {
        console.error("Error connecting to the database: ", err);
    }

    console.log("App is running on port 8080");
});

