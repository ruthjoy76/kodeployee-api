import express from "express";
import employeeController from "../controllers/employeeController.js";

const employeeRouter = express.Router();

employeeRouter.get("/", employeeController.getEmployees);
employeeRouter.get("/:id", employeeController.getEmployee);
employeeRouter.post("/", employeeController.createEmployee);
employeeRouter.put("/:id", employeeController.updateEmployee);
employeeRouter.delete("/:id", employeeController.deleteEmployee);

export default employeeRouter;
