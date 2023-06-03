const express = require("express")
const path = require("path")
const {open} = require("sqlite")
const sqlite3 = require("sqlite3")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cors = require("cors")
const app = express();
app.use(express.json())
app.use(cors())
let db = null

const dbpath = path.join(__dirname,"weatherPortal.db")

const intializeDbAndServer = async() => {
    try {
        db = await open({
            filename : dbpath,
            driver : sqlite3.Database
        });
        app.listen(3001, () => {
            console.log("The sever is running at http://localhost:3001/")
        });
    }catch (e) {
        console.log(e.message)
        process.exit(1);
    }
}

intializeDbAndServer();

// POST ### API FOR NEW USER REGISTRATION
app.post("/users", async(request,response) => {
    const {email, name, password} = request.body
    console.log(request.body)
    const hashedPassword = await bcrypt.hash(password,10);
    console.log("hai")
    const selectQuery = `SELECT * FROM users WHERE email = "${email}";`;
    const dbUser = await db.get(selectQuery);
    if (dbUser === undefined) {
        const createNewUserQuery = `INSERT INTO users(email,name,password)
                                    VALUES
                                    (
                                        '${email}',
                                        '${name}',
                                        '${hashedPassword}'
                                    );`;
        const dbResponse = await db.run(createNewUserQuery);
        const id = dbResponse.lastID;
        response.status(200)
        response.send({ Id: id, result:"user Registeration successfull" });
    }
    else {
        response.status(400);
        response.send({result :"User already exists"});
      }
});

// ### MIDDLEWEAR FOR AUTHENTICATION
const authenticateToken = async (request, response, next) => {
    let jwtToken;
    const authHeader = request.headers["authorization"];
    if (authHeader !== undefined) {
      jwtToken = authHeader.split(" ")[1];
    } else {
      response.status(401);
      response.send({result : "Invalid JWT Token"});
    }
    if (jwtToken !== undefined) {
      jwt.verify(jwtToken, "udaynikhwify", async (error, payload) => {
        if (error) {
          response.status(401);
          response.send({resutl: "Invalid JWT Token"});
        } else {
          request.email = payload.email;
          next();
        }
      });
    }
  };

// POST ### API FOR LOGIN
app.post("/login", async(request, response) => {
    const {email, password} = request.body
    const findUserQuery = `SELECT * FROM users WHERE email='${email}';`;
    const dbUser = await db.get(findUserQuery);
    console.log(email)
    if (dbUser === undefined) {
        response.status(400)
        response.send({error_msg : "Invalid User"})
    }else {
        const isCorrectPassword = await bcrypt.compare(password, dbUser.password)
        if (isCorrectPassword) {
            const payload = {email : email};
            const jwtToken = jwt.sign(payload, "udaynikhwify")
            response.send({jwtToken})
        }else {
            response.status(400)
            response.send({error_msg : "User & password didn't match"})
        }
    }
})

// POST ### API FOR ADDING NEW LOCATION
app.post("/add-location",authenticateToken, async(request, response) => {
    let {email} = request
    console.log("/add-location called")
    const getUserIdQuery = `select id from users where email='${email}';`;
    const getUserId = await db.get(getUserIdQuery);
    //console.log(getUserId.user_id);
    const { location } = request.body;

    const postRequestQuery = `insert into location(fav_location, user_id) values ("${location}", ${getUserId.id});`;

    const responseResult = await db.run(postRequestQuery);
    const id = responseResult.lastID;
    response.send({result: "New location added"});
    
})

// GET ### API FOR GETTING USER FAVOURITE LOCATIONS
app.get("/my-location",authenticateToken, async(request, response) => {
  let {email} = request
  console.log("/my-location/userId called")
  const getUserIdQuery = `select id from users where email='${email}';`;
  const getUserId = await db.get(getUserIdQuery);
  const getRequestQuery = `SELECT * FROM location WHERE user_id=${getUserId.id};`;
  
  const responseResult = await db.all(getRequestQuery);
  response.send(responseResult);
})

// DELETE ### API FOR DELETING USER FAVOURITE LOCATION
app.delete("/delete-location", authenticateToken, async(request, response) => {
  let {email} = request
  
  console.log("delete location called")
  const getUserIdQuery = `select id from users where email='${email}';`;
  const getUserId = await db.get(getUserIdQuery);
  const getLocationListQuery = `SELECT * FROM location WHERE user_id=${getUserId.id};`;
  const getLocationList = await db.all(getLocationListQuery);
  const { location } = request.body;
  console.log(request.body.location)
  const locationIdList = getLocationList.map((each) => each.fav_location)
  if (locationIdList.includes(location)){
    const deleteQuery = `DELETE FROM location where fav_location='${location}';`;
    await db.run(deleteQuery)
    response.send({result : "location Removed"})
  }
  else {
    response.status(401)
    response.send({result : "Invalid Request"})
  }
})