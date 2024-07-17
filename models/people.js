const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.MONGODB_URL;

mongoose.set("strictQuery", false);

mongoose
  .connect(url)

  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  });

// if (process.argv.length === 3) {
//   Person.find({}).then((result) => {
//     console.log("phonebook:");
//     result.forEach((person) => {
//       console.log(person.name, person.number);
//     });
//     mongoose.connection.close();
//   });
// } else if (process.argv.length === 5) {
//   const person = new Person({
//     name: process.argv[3],
//     number: process.argv[4],
//   });
//   person.save().then(() => {
//     console.log(`added ${person.name} number ${person.number} to phonebook`);
//     mongoose.connection.close();
//   });
// } else {
//   console.log("Invalid number of arguments");
//   mongoose.connection.close();
// }

module.exports = mongoose.model("Person", personSchema);
