import api from "./api"

export async function buscarUsuarioAtual() {
    const resposta = await api.get("/eu")
    return resposta.data
}

export async function listarChamados(filtros = {}) {
    const resposta = await api.get("/chamados", {
        params: filtros
    })
    return resposta.data
}

export async function listarChamadoPorId(id) {
    const resposta = await api.get(`/chamados/${id}`)
    return resposta.data
}

export async function criarChamado(chamado) {
    const resposta = await api.post("/chamados", chamado)
    return resposta.data
}

export async function atualizarChamado(id, chamado) {
    const resposta = await api.put(`/chamados/${id}`, chamado)
    return resposta.data
}

export async function iniciarChamadoPorId(id, responsavel) {
    const resposta = await api.patch(`/chamados/${id}/iniciar`, { responsavel })
    return resposta.data
}

export async function resolverChamadoPorId(id, solucao) {
    const resposta = await api.patch(`/chamados/${id}/resolver`, { solucao })
    return resposta.data
}

export async function deletarChamado(id) {
    await api.delete(`/chamados/${id}`)
}

export async function listarTipos() {
    const resposta = await api.get("/tipos")
    return resposta.data
}

export async function listarLocais() {
    const resposta = await api.get("/locais")
    return resposta.data
}

export async function listarPrioridades() {
    const resposta = await api.get("/prioridades")
    return resposta.data
}

export function mensagemDeErro(erro, padrao) {
    const status = erro.response?.status
    const detail = erro.response?.data?.detail

    if (status === 401) {
        return "Chave inválida."
    }
    if (Array.isArray(detail)) {
        return detail.map(function (d) {
            return d.msg
        }).join(", ")
    }
    if (typeof detail === "string") {
        return detail
    }
    return padrao
}

export function formatarData(data) {
    if (!data) return ""
    return data.split("-").reverse().join("/")
}