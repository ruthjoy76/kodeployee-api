import express from "express";
import leaveController from "../controllers/leaveController.js";

const leaveRouter = express.Router();

leaveRouter.get("/", leaveController.getLeaveApplications);
leaveRouter.get("/:id", leaveController.getLeaveApplication);
leaveRouter.post("/", leaveController.createLeaveApplication);
leaveRouter.put("/:id", leaveController.updateLeaveApplication);
leaveRouter.delete("/:id", leaveController.deleteLeaveApplication);

export default leaveRouter;
