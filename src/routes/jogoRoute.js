import { Router } from "express";
import * as jogoContoller from "../controllers/jogoContoller.js";
import { validarId } from "../middlewares/validarId.js";


const router = Router();

router.get("/", jogoContoller.listar);
router.get("/:id", validarId, jogoContoller.buscarPorId);
router.post("/", jogoContoller.criar);
router.put("/:id", validarId, jogoContoller.atualizar);
router.delete("/:id", validarId, jogoContoller.excluir);

export default router;