import { text } from "body-parser";
import * as jogoModel from "../models/jogoModel.js";
import { inteiroPositivo, textoValido } from "../utils/validacoes.js";

export function listar(req, res, next) {
    jogoModel.listar((erro, resultado) => {
        if (erro) return next(erro);
        return res.status(200).json(resultado);
    });
}

export function buscarPorId(req, res, next) {
    jogoModel.buscarPorId(req.id, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.length === 0) {
            return res.status(404).json({ erro: "Jogo não encontrado" });
        }
        return res.status(200).json(resultado[0]);
    });
}

export function criar(req, res, next) {
    const {titulo, ano_lancamento, estudio_id} = req.body ?? {};
    if (!textoValido(titulo, 50) || !ano_lancamento || !estudio_id) {
        return res.status(400).json({ erro: "Informe título (até 50 caracteres), ano_lançamento (até 60 caracteres) e estudio_id (até 10 caracteres" });
    }
    const dados = { titulo: titulo.trim(), ano_lancamento: ano_lancamento, estudio_id: estudio_id};

    jogoModel.criar(dados, (erro, resultado) => {
        if (erro) return next(erro);
        return res.status(201).json({
            mensagem: "Jogo cadastrado com sucesso",
            id: resultado.insertId
        });
    });
}

export function atualizar(req, res, next) {
    const {titulo, ano_lancamento, estudio_id } = req.body ?? {};
    if (!textoValido(titulo, 50) || !textoValido(ano_lancamento, 60) || !textoValido(estudio_id, 10)) {
        return res.status(400).json({ erro: "Informe título (até 50 caracteres), ano_lançamento (até 60 caracteres) e estúdio_id (até 10 caracteres)" });
    }
    const dados = { titulo: titulo.trim(), ano_lancamento: ano_lancamento.trim(), estudio_id: estudio_id.trim() };

    // Consulta didática para confirmar que o registro existe antes de editar.
    jogoModel.buscarPorId(req.id, (erro, registros) => {
        if (erro) return next(erro);
        if (registros.length === 0) {
            return res.status(404).json({ erro: "Jogo não encontrado" });
        }
        jogoModel.atualizar(req.id, dados, (erro, resultado) => {
            if (erro) return next(erro);
            return res.status(200).json({ mensagem: "Jogo atualizado com sucesso" });
        });
    });
}

export function excluir(req, res, next) {
    jogoModel.excluir(req.id, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Jogo não encontrado" });
        }
        return res.status(200).json({ mensagem: "Jogo excluído com sucesso" });
    });
}