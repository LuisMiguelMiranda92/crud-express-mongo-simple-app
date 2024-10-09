const express = require('express')
const bodyParser = require('body-parser');
const { reset } = require('nodemon');
const app = express()
const MongoClient = require('mongodb').MongoClient
const connectionString ='mongodb+srv://yoda:igcmCEVGcjtPb@cluster0.jblcr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

app.set('view engine', 'ejs')

MongoClient.connect(connectionString)
	.then(client => { 
		console.log('Connected to Database')
		const db = client.db('star-wars-quotes');

		const quotesCollection = db.collection('quotes')
		app.set('view engine', 'ejs');
		app.use(bodyParser.urlencoded({ extended: true }));
    	app.use(express.static('public'));
    	app.use(bodyParser.json());
		
		app.get('/', (req, res) => {
			quotesCollection
			  .find()
			  .toArray()
			  .then((results) => {
				console.log(results);
				res.render('index.ejs', { quotes: results });
			  })
			  .catch((error) => console.log(error));
		  });

		  app.post('/quotes', (req, res) => {
			quotesCollection
			  .insertOne(req.body)
			  .then((result) => {
				res.redirect('/');
				console.log(result);
			  })
			  .catch((error) => console.log(error));
		  });
		
		  app.put('/quotes', (req, res) => {
			quotesCollection
			  .findOneAndUpdate(
				{ name: 'yoda' },
				{
				  $set: {
					name: req.body.name,
					quote: req.body.quote
				  }
				},
				{ upsert: true }
			  )
			  .then((result) => {
				const updatedDocument = result.value;
				res.json(updatedDocument);
			  })
			  .catch((error) => {
				console.log(error);
				res.sendStatus(500);
			  });
		  });
		
		  app.delete('/quotes', (req, res) => {
			quotesCollection
			  .deleteOne({ name: req.body.name })
			  .then((result) => {
				res.json("Deleted Darth Vader's Quote");
			  })
			  .catch((error) => console.log(error));
		  });
		  


		  app.listen(3000, function () {
			console.log('listening on 3000');
		  });
		})
		.catch((error) => console.error(error));