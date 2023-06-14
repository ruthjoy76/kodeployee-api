import express from "express";
import employeeController from "../controllers/employeeController.js";
import upload from "../utils/multer.js";

const employeeRouter = express.Router();

employeeRouter.get("/", employeeController.getEmployees);
employeeRouter.get("/:id", employeeController.getEmployee);
employeeRouter.post(
  "/",
  upload.single("image"),
  employeeController.createEmployee
);
employeeRouter.put("/:id", employeeController.updateEmployee);
employeeRouter.delete("/:id", employeeController.deleteEmployee);

export default employeeRouter;
