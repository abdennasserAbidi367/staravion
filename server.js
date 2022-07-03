const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const path = require('path');
const server = require('http').createServer(app);
/** var https = require("https"); 
var app = https.createServer();  */
const io = require('socket.io')(server);

const mongo = require('mongodb').MongoClient;
const {MongoClient} = require('mongodb');


const port = process.env.PORT || 3000;

var mysql = require('mysql');

var id = 0;
var isReady = false;

/**
 * mysql
 * var connection = mysql.createConnection({
    connectionLimit : 10,
    host            : 'example.org',
    user            : 'bob',
    password        : 'secret',
    database        : 'my_db'
});
 
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as id ' + connection.threadId);
});

app.post('/save', function(req, res) {
    var sql = "INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
});
 * 
 */


server.listen(port, () => {
  console.log('Server listening at port %d', port);
  var url = "mongodb+srv://tunisavia:Yd5vvQXv2NvpTmbO@cluster0.tvq4us6.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);
try {
 client.connect();
} catch (e) {
  console.error(e)
} finally {
  //await client.close();
  client.connect();
}

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/getAll', function(req, res) {
  listUser(client, res);
});

app.post('/getUserByEmail', urlencodedParser, function(req, res) {
  console.log(req.body.email);
  listUserByEmail(client, req, res);
});

app.post('/getFlightById', urlencodedParser, function(req, res) {
  console.log(req.body.id);
  listFlightById(client, req, res);
});

app.post('/deleteFlightById', urlencodedParser, function(req, res) {
  console.log(req.body.id);
  deleteFlightById(client, req, res);
});

app.post('/save', function(req, res) {
  addUser(client, req, res);
});

app.post('/saveTechnic', function(req, res) {
  addTechnique(client, req, res);
});

app.post('/updateTechnic', function(req, res) {
  updateTechnique(client, req, res);
});

app.get('/getAllVol', function(req, res) {
  listVol(client, res);
});

async function listVol(client, res) {
  const cursor = client
    .db('tunisavia')
    .collection('tech')
    .find()

   const results = await cursor.toArray();
  console.log(`Found ${results.length} listing(s):`);
  return res.send({ results })
  //res.status(200).json({ message: 'ok' });
  if (results.length > 0) {
    results.forEach((result, i) => {
      console.log();
      console.log(`   _id: ${result._id}`);
      
    });
  }
}

async function addTechnique(client, req, result) {
  var db = client.db('tunisavia')
  var myobj = { id: req.body.id, type: req.body.type, name_vol: req.body.name_vol, number_passenger: req.body.number_passenger, date_dep: req.body.date_dep, zone_dep: req.body.zone_dep, date_arr: req.body.date_arr, zone_arr: req.body.zone_arr, is_checked: req.body.is_checked, pilot_id: req.body.pilot_id, plane_id: req.body.plane_id };
    db.collection('tech').insertOne(myobj, function(err, res) {
      if (err) {
        return result.send({ message: 'error' });
        //throw err;
      } else {
        return result.send({ message: 'ok' });
      }
      console.log("1 document inserted");
      //db.close();
    
    });
}

async function listFlightById(client, req, res) {
  var query = { id: req.body.id,};
  //var query = { email: "a@a.a", password: "" };
  const cursor = client
    .db('tunisavia')
    .collection('tech')
    .find(query)

   const results = await cursor.toArray();
  console.log(`${results}:`);
  return res.send({ results })
}

async function deleteFlightById(client, req, res) {
  var query = { id: req.body.id,};
  //var query = { email: "a@a.a", password: "" };
  const cursor = client
    .db('tunisavia')
    .collection('tech')
    .deleteOne(query);

    if (result.deletedCount === 1) {
      console.log("Successfully deleted one document.");
      return result.send({ message: 'Successfully deleted one document.' });
    } else {
      console.log("No documents matched the query. Deleted 0 documents.");
      return result.send({ message: 'No documents matched the query. Deleted 0 documents.' });
    }
  return res.send({ results })
}


async function listUserByEmail(client, req, res) {
  var query = { email: req.body.email, password: req.body.password };
  //var query = { email: "a@a.a", password: "" };
  const cursor = client
    .db('tunisavia')
    .collection('user')
    .find(query)

   const results = await cursor.toArray();
  console.log(`${results}:`);
  return res.send({ results })
}

async function addUser(client, req, result) {
  var db = client.db('tunisavia')
  var myobj = { id: req.body.id, full_name: req.body.full_name, email: req.body.email, password: req.body.password, type: req.body.type, pic: req.body.pic };
    db.collection('user').insertOne(myobj, function(err, res) {
      if (err) {
        return result.send({ message: 'error' });
        //throw err;
      } else {
        return result.send({ message: 'ok' });
      }
      console.log("1 document inserted");
      //db.close();
    
    });
}

async function listUser(client, res) {
  const cursor = client
    .db('tunisavia')
    .collection('user')
    .find()

   const results = await cursor.toArray();
  console.log(`Found ${results.length} listing(s):`);
  return res.send({ results })
  //res.status(200).json({ message: 'ok' });
  if (results.length > 0) {
    results.forEach((result, i) => {
      console.log();
      console.log(`   _id: ${result._id}`);
      
    });
  }
}

async function findListings(client, resultsLimit) {
  const cursor = client
    .db('sample_airbnb')
    .collection('listingsAndReviews')
    .find()
    .limit(resultsLimit);

  const results = await cursor.toArray();
  if (results.length > 0) {
    console.log(`Found ${results.length} listing(s):`);
    results.forEach((result, i) => {
      date = new Date(result.last_review).toDateString();

      console.log();
      console.log(`${i + 1}. name: ${result.name}`);
      console.log(`   _id: ${result._id}`);
      console.log(`   bedrooms: ${result.bedrooms}`);
      console.log(`   bathrooms: ${result.bathrooms}`);
      console.log(
        `   most recent review date: ${new Date(
          result.last_review
        ).toDateString()}`
      );
    });
  }
}

async function listDatabases(client){
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
  
};

async function updateTechnique(client, req, result) {
  var db = client.db('tunisavia')

  var myquery = { id: req.body.id };
  var newvalues = { $set: {is_checked: req.body.isready} };
  db.collection('tech').updateOne(myquery, newvalues, function(err, res) {
      if (err) {
        return result.send({ message: 'error' });
        //throw err;
      } else {
        return result.send({ message: 'ok' });
      }
      console.log("1 document inserted");
      //db.close();
    
    });
}

});


//Socket.io Connection------------------
io.on('connection', (socket) => {

    console.log("New socket connection: " + socket.id)

    socket.on('check', (msg) => {
        const myArray = msg.split(" ");
        let word = myArray[1];
        let isready = myArray[0];
        console.log(word)
        id = word;
        if(isready == "ready") isReady = true;
        else isReady = false;
        io.emit('check', msg);
    })
})

//io.listen(3000);