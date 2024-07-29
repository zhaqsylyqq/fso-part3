const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

const PORT = process.env.PORT || 3001;
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.static('dist'))

let persons = [
	{
		"id": "1",
		"name": "Arto Hellas",
		"number": "040-123456"
	},
	{
		"id": "2",
		"name": "Ada Lovelace",
		"number": "39-44-5323523"
	},
	{
		"id": "3",
		"name": "Dan Aramov",
		"number": "12-43-234345"
	},
	{
		"id": "4",
		"name": "Mary Poppendieck",
		"number": "39-23-6423122"
	}
];

app.get('/', (request, response) => {
	response.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (request, response) => {
	response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
	const id = request.params.id;
	const person = persons.find(e => e.id === id);
	if (person) {
		response.json(person);
	} else {
		response.status(404).end();
	}
});

app.get('/info', (request, response) => {
	const num = persons.length;
	const date = new Date();
	const info = `Phone book has info for ${num} people`;
	response.send(`<p>${info}<br/>${date}</p>`);
});

app.delete('/api/persons/:id', (request, response) => {
	const id = request.params.id;
	persons = persons.filter(note => note.id !== id);

	response.status(204).end();
});

const generateId = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

app.post('/api/persons', (request, response) => {
	const body = request.body;

	if (!body.name || !body.number) {
		return response.status(400).json({
			error: 'name or number missing'
		});
	}



	else if (persons.find(m=>m.name === body.name)){
		return response.status(400).json({
			error: 'name is already exist'
		});
	}

	const person = {
		id: generateId(1, 10000).toString(),
		name: body.name,
		number: body.number
	};

	persons = persons.concat(person);

	response.json(person);
});



app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
