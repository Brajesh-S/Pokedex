const express = require('express');
const app = express();
const cors = require('cors');
const pokemonRoute = require('./routes/pokemonRoute.js')


app.use(cors({
    origin:["http://localhost:3001"],
    methods:['POST' , 'GET'],
    credentials: true
}));

app.use('/api/pokemon', pokemonRoute);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`${port}`));
