const express = require("express");
const morgan = require("morgan"); // Import Morgan
const cors = require("cors");
const Person = require("./models/people");


const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static("dist"));

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((people) => {
    res.json(people);
  });
});

// app.get("/info", (req, res) => {
//   const length = persons.length;
//   const reqTime = new Date().toString();
//   res.send(`Phonebook has info for ${length} people<br>${reqTime}`);
// });

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  Person.findById(id).then((person) => {
    if (person) {
      res.json(person);
    } else {
      res.status(404).end();
    }
  });
});

// app.delete("/api/persons/:id", (req, res) => {
//   const id = Number(req.params.id);
//   persons = persons.filter((person) => person.id !== id);
//   res.status(204).end();
// });

// const generateId = () => {
//   return Math.floor(Math.random() * 100000);
// };

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "content missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
