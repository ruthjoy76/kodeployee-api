import mongoose from "mongoose";

const leaveApplicationSchema = new mongoose.Schema({
  Leavetype: { type: String, required: true },
  FromDate: { type: Date, required: true },
  ToDate: { type: Date, required: true },
  Reasonforleave: { type: String, required: true },
  Status: { type: String, required: true },
  employees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
  ],
});

leaveApplicationSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const LeaveApplication = mongoose.model(
  "LeaveApplication",
  leaveApplicationSchema
);

export default LeaveApplication;
