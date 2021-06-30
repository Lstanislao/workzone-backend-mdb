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
  getTareasUsuarioProyecto,
  getTareasPorMiembro,
  desasignarTarea,
} = require("../controllers/tareaController");

const router = Router();

router.post("/create", createTarea);
router.post("/update", updateTarea);
router.post("/remove-member", desasignarTarea);
router.get("/from/:proyecto", getTareasProyecto);
router.get("/from/:proyecto/by-member", getTareasPorMiembro);
router.get("/from/:proyecto/:usuario", getTareasUsuarioProyecto);
router.get("/:tarea", getTarea);
router.post("/delete", deleteTarea);

module.exports = router;
