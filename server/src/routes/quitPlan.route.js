const express = require("express");
const quitPlanRouter = express.Router();
const quitPlanController = require("../controllers/quitPlan.controller");
const { validateToken, checkRole } = require("../middlewares/AuthMiddleware");

//Get all quit plans — Admin only
quitPlanRouter.get("/", validateToken, checkRole(["admin"]), quitPlanController.getAllQuitPlans);

//Get a quit plan by ID — Only owner or admin
quitPlanRouter.get("/:id", validateToken, quitPlanController.getQuitPlanById);

// Create a new quit plan — User or Coach (Coach can create on behalf of user)
quitPlanRouter.post("/", validateToken, checkRole(["user", "coach", "admin"]), quitPlanController.createQuitPlan);

// Update a quit plan — Only owner or admin
quitPlanRouter.put("/:id", validateToken, checkRole(["user", "coach", "admin"]), quitPlanController.updateQuitPlan);

//Delete a quit plan — Admin only
quitPlanRouter.delete("/:id", validateToken, checkRole(["admin"]), quitPlanController.deleteQuitPlan);

module.exports = quitPlanRouter;
