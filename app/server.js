var express = require('express') //llamamos a Express
var bodyParser = require('body-parser');
var app = express()
const cors = require('cors');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
const fs = require('fs');
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

/* A function that is called when the user makes a GET request to the /posts/:id endpoint. */
app.get('/posts/:id', (req, res) => {
	try {
		/* Reading the file db.json and returning the data in the file. */
		let rawData = fs.readFileSync('./db.json');
		let data = JSON.parse(rawData);
		/* Returning the post with the id that is passed in the url. */
		res.json({ data: data.posts.find(item => item.id === req.params.id) });
	} catch (error) {
		res.json({ message: error });
	}
});

/* A function that is called when the user makes a POST request to the /posts endpoint. */
app.post('/posts', (req, res) => {
	try {
		/* Creating a new post object and pushing it to the posts array in the db.json file. */
		let rawData = fs.readFileSync('./db.json');
		let data = JSON.parse(rawData);
		let newData = data;
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

/* Updating the post with the id that is passed in the url. */
app.put('/posts/:id', (req, res) => {
	try {
		/* Reading the file db.json and returning the data in the file. */
		let rawData = fs.readFileSync('./db.json');
		let data = JSON.parse(rawData);
		/* Finding the post with the id that is passed in the url and then updating the title, text and image
		with the data that is passed in the body of the request. */
		let post = data.posts.find(item => item.id === req.params.id);
		post = {
			...post,
			title: req.body.title,
			text: req.body.text,
			image: req.body.image,
		}
		/* Updating the post with the id that is passed in the url. */
		data.posts.map(item => {
			if(item.id === post.id) {
				item.title = post.title;
				item.image = post.image;
				item.text = post.text;
			}
			return item
		})
		/* Writing to the file db.json. */
		fs.writeFile('./db.json', JSON.stringify(data), 'utf8', (err) => {
			if (err) {
				console.log(err);
				throw { mmessage: err };
			};
			message = 'Post  guardado con exito';
			res.json({ mensaje: message, data: post });
		});
	} catch (error) {
		res.json({ message: error });
	}
});



/* Deleting the post with the id that is passed in the url. */
app.delete('/posts/:id', (req, res) => {
	try {
		/* Reading the file db.json and returning the data in the file. */
		let rawData = fs.readFileSync('./db.json');
		let data = JSON.parse(rawData);
		/* Filtering the posts array and returning the posts that do not have the id that is passed in the
		url. */
		data.posts = data.posts.filter(item => item.id !== req.params.id);
		fs.writeFile('./db.json', JSON.stringify(data), 'utf8', (err) => {
			if (err) {
				console.log(err);
				throw { mmessage: err };
			};
			message = 'Post  eliminado con exito';
			res.json({ mensaje: message});
		});
	} catch (error) {
		res.json({ message: error });
	}
});

// iniciamos nuestro servidor
app.listen(port)
console.log('API escuchando en el puerto ' + port)
