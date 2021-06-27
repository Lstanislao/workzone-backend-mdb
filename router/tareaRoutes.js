/**
 * path api/tasks
 */

const { Router } = require("express");
const {
  updateTarea,
  getTarea,
  createTarea,
  getTareasProyecto,
  deleteTarea,
  getTareasPorMiembro,
} = require("../controllers/tareaController");

const router = Router();

router.post("/create", createTarea);
router.post("/update", updateTarea);
router.get("/from/:proyecto", getTareasProyecto);
router.get("/from/:proyecto/by-member", getTareasPorMiembro);
router.get("/:tarea", getTarea);
router.post("/delete", deleteTarea);

module.exports = router;
