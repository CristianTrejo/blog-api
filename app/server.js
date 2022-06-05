var express = require('express') //llamamos a Express
var bodyParser  = require('body-parser');
var app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
const fs = require('fs');
const db = require('../db.json');
var randomstring = require("randomstring");
var moment = require("moment");

var port = process.env.PORT || 8080  // establecemos nuestro puerto


app.get('/posts', function (req, res) {
	res.json({ mensaje: '¡Funciona!', data: db.posts})
})

app.post('/posts', function (req, res) {
	try {
		let newData = db;
		var message = '';
		let post = {
			...req.body,
			id: randomstring.generate(7),
			createdAt: moment()
		};
		newData.posts.push(post);
		fs.writeFile('./db.json', JSON.stringify(newData), 'utf8', function (err) {
			if(err) {
				console.log(err)
				throw {mmessage: err}
			};
			message = 'Post  guardado con exito'
			res.json({ mensaje: message, data: post});
		});
	} catch (error) {
		console.log(error)
		res.json({mensaje: 'Ocurrio un error al escribir en la base de datos', err: error});
	}
})

// iniciamos nuestro servidor
app.listen(port)
console.log('API escuchando en el puerto ' + port)
