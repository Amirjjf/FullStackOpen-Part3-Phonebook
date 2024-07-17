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

const phoneValidator = [
  {
    validator: function (v) {
      return /^\d{2,3}-\d{5,}$/.test(v);
    },
    message: (props) => `${props.value} is not a valid phone number!`,
  },
  {
    validator: function (v) {
      return v.length >= 8;
    },
    message: (props) => `${props.value} is shorter than the minimum allowed length (8)!`,
  },
];

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: phoneValidator,
    required: true,
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
