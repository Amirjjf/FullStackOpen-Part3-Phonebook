const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/people");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

// Configure morgan to log the request body
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

// Default route
app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

// Get all persons
app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((people) => res.json(people))
    .catch((error) => next(error));
});

// Get info
app.get("/info", (req, res, next) => {
  Person.find({})
    .then((people) => {
      res.send(`<p>Phonebook has info for ${people.length} people</p><p>${new Date()}</p>`);
    })
    .catch((error) => next(error));
});

// Get person by ID
app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// Delete person by ID
app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (result) {
        res.status(204).end();
      } else {
        res.status(404).send({ error: "person not found" });
      }
    })
    .catch((error) => next(error));
});

// Add a new person
app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: "content missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => res.json(savedPerson))
    .catch((error) => next(error));
});

// Update person by ID
app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      if (updatedPerson) {
        res.json(updatedPerson);
      } else {
        res.status(404).send({ error: "person not found" });
      }
    })
    .catch((error) => next(error));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.message);
  if (error.name === "CastError" && error.kind === "ObjectId") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  res.status(500).json({ error: "Something went wrong" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
