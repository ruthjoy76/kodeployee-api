import User from "../models/User.js";
import Employee from "../models/Employee.js";
import isString from "../utils/isString.js";
import getTokenFrom from "../utils/getTokenFrom.js";
import jwt from "jsonwebtoken";
import config from "../utils/config.js";
import storage from "../utils/firebaseConfig.js";
import { ref, uploadBytes, deleteObject } from "firebase/storage";
import generateUniqueImageFileName from "../utils/generateUniqueImageFileName.js";

async function getEmployees(req, res) {
  const decodedToken = jwt.verify(getTokenFrom(req), config.SECRET);
  const employees = await Employee.find({ user: decodedToken.id });

  return res.json(employees);
}

async function getEmployee(req, res, next) {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);

    if (employee) return res.json(employee);

    return res.status(404).json({ error: "Employee not found" });
  } catch (error) {
    next(error);
  }
}

async function createEmployee(req, res, next) {
  try {
    const { name, number } = req.body;
    const decodedToken = jwt.verify(getTokenFrom(req), config.SECRET);

    if (!decodedToken.id) {
      return res.status(401).json({ error: "Token missing or invalid" });
    }

    const user = await User.findById(decodedToken.id);

    const storageRef = ref(storage, generateUniqueImageFileName(req.file));
    const metadata = {
      contentType: "image/jpeg",
    };
    const snapshot = await uploadBytes(storageRef, req.file.buffer, metadata);
    const photoUrl = `https://firebasestorage.googleapis.com/v0/b/${snapshot.ref.bucket}/o/${snapshot.ref.fullPath}?alt=media`;

    const employee = new Employee({
      name,
      number,
      user: user._id,
      photoInfo: {
        url: photoUrl,
        filename: snapshot.ref.fullPath,
      },
    });

    const savedEmployee = await employee.save();

    user.employees = user.employees.concat(savedEmployee._id);
    await user.save();

    return res.status(201).json(savedEmployee);
  } catch (error) {
    next(error);
  }
}

async function updateEmployee(req, res, next) {
  const id = req.params.id;
  const { name, number } = req.body;

  if (name === undefined || number === undefined)
    return res.status(400).json({ error: "Content is missing" });

  if (name === "" || number === "")
    return res.status(400).json({ error: "Name and number are required" });

  if (!isString(name) || !isString(number))
    return res.status(400).json({ error: "Name and number must be strings" });

  const employee = {
    name,
    number,
  };

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(id, employee, {
      new: true,
      runValidators: true,
      context: "query",
    });

    if (updatedEmployee) return res.json(updatedEmployee);

    return res.status(404).json({ error: "Employee not found" });
  } catch (error) {
    next(error);
  }
}

async function deleteEmployee(req, res, next) {
  try {
    const id = req.params.id;
    const decodedToken = jwt.verify(getTokenFrom(req), config.SECRET);

    if (!decodedToken.id) {
      return res.status(401).json({ error: "Token missing or invalid" });
    }

    const user = await User.findById(decodedToken.id);
    const employee = await Employee.findByIdAndDelete(id);
    const photoRef = ref(storage, employee.photoInfo.filename);

    await deleteObject(photoRef);

    user.employees = user.employees.filter(
      (employeeID) => employeeID.toString() !== employee._id.toString()
    );
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
}

export default {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
