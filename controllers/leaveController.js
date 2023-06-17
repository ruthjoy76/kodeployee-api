import Employee from "../models/Employee.js";
import LeaveApplication from "../models/LeaveApplication.js";
import isString from "../utils/isString.js";

async function getLeaveApplications(_req, res) {
  const leaveApplications = await LeaveApplication.find({
    employee: LeaveApplication.id,
  });

  return res.json(leaveApplications);
}

async function getLeaveApplication(req, res, next) {
  try {
    const { id } = req.params;
    const leaveApplication = await LeaveApplication.findById(id);

    if (leaveApplication) return res.json(leaveApplication);

    return res.status(404).json({ error: "Aplication not found" });
  } catch (error) {
    next(error);
  }
}

async function createLeaveApplication(req, res, next) {
  try {
    const {
      firstname,
      middlename,
      lastname,
      Leavetype,
      FromDate,
      ToDate,
      Reasonforleave,
      Status,
    } = req.body;

    const employee = await Employee.findById(employee.id);

    const leaveApplication = new LeaveApplication({
      firstname,
      middlename,
      lastname,
      Leavetype,
      FromDate,
      ToDate,
      Reasonforleave,
      Status,
      employee: employee._id,
    });

    const savedLeaveApplication = await leaveApplication.save();

    employee.leaveApplication = employee.leaveApplication.concat(
      savedLeaveApplication._id
    );
    await employee.save();

    return res.status(201).json(savedLeaveApplication);
  } catch (error) {
    next(error);
  }
}

async function updateLeaveApplication(req, res, next) {
  const id = req.params.id;
  const {
    firstname,
    middlename,
    lastname,
    Leavetype,
    FromDate,
    ToDate,
    Reasonforleave,
    Status,
  } = req.body;

  if (
    firstname === undefined ||
    middlename === undefined ||
    lastname === undefined ||
    Leavetype === undefined ||
    FromDate === undefined ||
    ToDate === undefined ||
    Reasonforleave === undefined ||
    Status === undefined
  )
    return res.status(400).json({ error: "Content is missing" });

  if (
    firstname === "" ||
    middlename === "" ||
    lastname === "" ||
    Leavetype === "" ||
    FromDate === "" ||
    ToDate === "" ||
    Reasonforleave === "" ||
    Status === ""
  )
    return res.status(400).json({ error: "All fields are required" });

  if (
    !isString(firstname) ||
    !isString(middlename) ||
    !isString(lastname) ||
    !isString(Leavetype) ||
    !isString(FromDate) ||
    !isString(ToDate) ||
    !isString(Reasonforleave) ||
    !isString(Status)
  )
    return res.status(400).json({ error: "All fields must be strings" });

  const leaveApplication = {
    firstname,
    middlename,
    lastname,
    Leavetype,
    FromDate,
    ToDate,
    Reasonforleave,
    Status,
  };

  try {
    const updatedLeaveApplication = await LeaveApplication.findByIdAndUpdate(
      id,
      leaveApplication,
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    if (updatedLeaveApplication) return res.json(updatedLeaveApplication);

    return res.status(404).json({ error: "Application not found" });
  } catch (error) {
    next(error);
  }
}

async function deleteLeaveApplication(req, res, next) {
  try {
    const id = req.params.id;

    const employee = await Employee.findByIdAndDelete(id);
    const leaveApplication = await LeaveApplication.findByIdAndDelete(id);

    employee.leaveApplications = employee.leaveApplications.filter(
      (leaveApplicationID) =>
        leaveApplicationID.toString() !== leaveApplication._id.toString()
    );
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
}

export default {
  getLeaveApplications,
  getLeaveApplication,
  createLeaveApplication,
  updateLeaveApplication,
  deleteLeaveApplication,
};
