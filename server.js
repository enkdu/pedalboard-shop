const express = require('express'),
			fs = require('file-system'),
			bodyParser = require('body-parser'),
			app = express();

app.use('/', express.static('frontend'));

var jsonParser = bodyParser.json()

app.post('/basket',jsonParser, (req,res) => {
	let user = req.body;

	if(!req.body) return res.sendStatus(400);
	writeInDB(user);
	res.send('ok');
});


app.get('/overdrive',(req,res) => {
	let products = getProductsFromDB('./database/products/overdrive.json');
	res.send(products);
});

app.get('/delay',(req,res) => {
	let products = getProductsFromDB('./database/products/delay.json');
	res.send(products);
});

app.get('/modulation',(req,res) => {
	let products = getProductsFromDB('./database/products/modulation.json');
	res.send(products);
});

app.get('/compressor',(req,res) => {
	let products = getProductsFromDB('./database/products/compressor.json');
	res.send(products);
});

app.get('/looper',(req,res) => {
	let products = getProductsFromDB('./database/products/looper.json');
	res.send(products);
});

app.get('/multieffect',(req,res) => {
	let products = getProductsFromDB('./database/products/multieffect.json');
	res.send(products);
});

app.get('/other',(req,res) => {
	let products = getProductsFromDB('./database/products/other.json');
	res.send(products);
});

app.listen(4000, () => console.log('running server...'));

function getProductsFromDB(Category) {
	return JSON.parse(fs.readFileSync(Category, 'utf8'));
}

function writeInDB(user) {
	fs.readFile('./database/users/users.json', function (err, data) {
		let json = data && data.length ? JSON.parse(data) : []
		json.push(user)
		fs.writeFile('./database/users/users.json', JSON.stringify(json))
});
}