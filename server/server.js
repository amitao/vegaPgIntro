// requires
const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const app = express();
const pg = require('pg');


//uses
app.use( express.static( 'server/public/' ) );
app.use( bodyParser.urlencoded( { extended: true } ) );

//globals
const port = process.env.PORT || 5000;
// create our Pool for SQL connections
const Pool = pg.Pool;
// takes objects
const pool = new Pool({
    database: 'music_library',
    host: 'localhost',
    port: 5432,
    max: 10, // 10 connections
    idleTimeoutMillis: 30000
});

// when connect to db
pool.on('connect', ()=>{
    console.log('connected to DB');
})
pool.on('error', (err)=>{
    console.log('error with DB:', err);
})

// spin up server
app.listen( port, ( req, res )=>{
    console.log( 'server up on:', port );
});


// test route
app.get('/songs', (req, res)=>{
    console.log('/test GET');
    // create a query
    const queryString = `SELECT * FROM songs;`;
    // run the query on the pool
    pool.query(queryString).then((results)=>{
        // send results back to client
        res.send(results.rows);
    }).catch( (err)=>{
        // handle any errors
        console.log('error retrieving data:', err);
    });
    
});

app.post('/songs', (req, res)=>{
    console.log('in /songs POST:', req.body);
    // create query string
    const queryString = `INSERT INTO songs (artist, track, rank, published)
    VALUES ($1, $2, $3, $4);`; // $1 placeholders
    pool.query(queryString, [req.body.artist, req.body.track, req.body.rank, req.body.published]).then(()=>{
        res.sendStatus(201);
    }).catch((err)=>{
        console.log('error wrtiting song:', err);
        res.sendStatus( 500 );
    });
})