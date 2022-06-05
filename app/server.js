var express = require('express') //llamamos a Express
var bodyParser = require('body-parser');
var app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
const fs = require('fs');
const db = require('../db.json');
var randomstring = require("randomstring");
var moment = require("moment");

var port = process.env.PORT || 8080  // establecemos nuestro puerto


/* A function that is called when the user makes a GET request to the /posts endpoint. */
app.get('/posts', (req, res) => {
	try {
		/* Reading the file db.json and returning the data in the file. */
		let rawData = fs.readFileSync('./db.json');
		let data = JSON.parse(rawData);
		res.json({ data: data.posts.reverse() });
	} catch (error) {
		res.json({ message: error });
	}
});

/* A function that is called when the user makes a POST request to the /posts endpoint. */
app.post('/posts', (req, res) => {
	try {
		/* Creating a new post object and pushing it to the posts array in the db.json file. */
		let newData = db;
		var message = '';
		let post = {
			...req.body,
			id: randomstring.generate(7),
			createdAt: moment()
		};
		newData.posts.push(post);
		/* Writing to the file db.json. */
		fs.writeFile('./db.json', JSON.stringify(newData), 'utf8', (err) => {
			if (err) {
				console.log(err);
				throw { mmessage: err };
			};
			message = 'Post  guardado con exito';
			res.json({ mensaje: message, data: post });
		});
	} catch (error) {
		console.log(error);
		res.json({ mensaje: 'Ocurrio un error al escribir en la base de datos', err: error });
	}
});

app.put('/posts/:id', (req, res) => {
	try {
		/* Reading the file db.json and returning the data in the file. */
		let rawData = fs.readFileSync('./db.json');
		let data = JSON.parse(rawData);
		let post = data.find(item => item.id === req.params.id);
		res.json({ data: post });
	} catch (error) {
		res.json({ message: error });
	}
});

// iniciamos nuestro servidor
app.listen(port)
console.log('API escuchando en el puerto ' + port)
