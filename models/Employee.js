import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  firstname: { type: String, minLength: 3, required: true },
  middlename: { type: String, minLength: 3, required: true },
  lastname: { type: String, minLength: 3, required: true },
  number: { type: String, minLength: 8, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, required: true },
  dob: { type: Date, required: true },
  user: String,
  photoInfo: { url: String, filename: String },
});

employeeSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
