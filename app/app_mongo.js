const express = require('express');
const app = express();
const PORT = 3000;

const { MongoClient } = require("mongodb");

const uri = "mongodb://root:admin@mongo";

const client = new MongoClient(uri);

app.set('view engine', 'ejs');

app.get('/' , async (req, res) => {
  try {
    await client.connect();
    const database = client.db('projeto');
    const movies = database.collection('placa');

    const query = { title: 'Back to the Future' };
    await movies.deleteOne(query);

    const movie = await movies.find();
    let cursor = await movies.find();
    let placas = await cursor.toArray();

    console.log('movie', placas);
    res.render('lista' , {placas});
  } finally {
    await client.close();
  }
})

app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});