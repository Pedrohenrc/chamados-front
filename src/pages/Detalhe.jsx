import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import {
    listarChamadoPorId,
    iniciarChamadoPorId,
    resolverChamadoPorId,
    deletarChamado,
    mensagemDeErro,
} from "../services/chamadoService.js";

function Detalhe() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [chamado, setChamado] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const [responsavel, setResponsavel] = useState("");
    const [solucao, setSolucao] = useState("");
    const [confirmando, setConfirmando] = useState(false);

    useEffect(function () {
        async function carregar() {
            try {
                const dados = await listarChamadoPorId(id);
                setChamado(dados);
            } catch (e) {
                setErro(mensagemDeErro(e, "Não foi possível carregar o chamado."));
            } finally {
                setCarregando(false);
            }
        }

        carregar();
    }, [id]);

    async function iniciar() {
        setErro("");
        try {
            await iniciarChamadoPorId(id, responsavel);
            setChamado(await listarChamadoPorId(id));
            setResponsavel("");
        } catch (e) {
            setErro(mensagemDeErro(e, "Não foi possível iniciar o atendimento."));
        }
    }

    async function resolver() {
        setErro("");
        try {
            await resolverChamadoPorId(id, solucao);
            setChamado(await listarChamadoPorId(id));
            setSolucao("");
        } catch (e) {
            setErro(mensagemDeErro(e, "Não foi possível resolver o chamado."));
        }
    }

    async function excluir() {
        try {
            await deletarChamado(id);
            navigate("/");
        } catch (e) {
            setConfirmando(false);
            setErro(mensagemDeErro(e, "Não foi possível excluir o chamado."));
        }
    }

    if (carregando) {
        return <p>Carregando chamado...</p>;
    }

    if (!chamado) {
        return (
            <div>
                <p className="mensagem-erro">{erro}</p>
                <Link to="/">← Voltar</Link>
            </div>
        );
    }

    return (
        <div>
            <Link to="/">← Voltar</Link>

            <h2>{chamado.titulo}</h2>
            <p>
        <span className={"status-" + chamado.status.replace(" ", "-")}>
          {chamado.status}
        </span>{" "}
                | Prioridade: {chamado.prioridade}
            </p>

            <div className="card-chamado">
                <p>Descrição: {chamado.descricao}</p>
                <p>Tipo: {chamado.tipo}</p>
                <p>Local: {chamado.local}</p>
                <p>Aberto em: {chamado.data_abertura}</p>
                <p>Responsável: {chamado.responsavel}</p>
                <p>Solução: {chamado.solucao}</p>
            </div>

            {erro && <p className="mensagem-erro">{erro}</p>}

            <div className="acoes">
                {chamado.status !== "resolvido" && (
                    <button onClick={function () { navigate("/editar/" + id); }}>
                        Editar
                    </button>
                )}
                <button onClick={function () { setConfirmando(true); }}>
                    Excluir
                </button>
            </div>

            {confirmando && (
                <div className="confirmacao">
                    <p>Tem certeza que deseja excluir este chamado?</p>
                    <button onClick={excluir}>Excluir</button>
                    <button onClick={function () { setConfirmando(false); }}>
                        Cancelar
                    </button>
                </div>
            )}

            {chamado.status === "aberto" && (
                <div className="etapa">
                    <h3>Iniciar atendimento</h3>
                    <input
                        type="text"
                        placeholder="Responsável"
                        value={responsavel}
                        onChange={function (e) { setResponsavel(e.target.value); }}
                    />
                    <button onClick={iniciar}>Iniciar</button>
                </div>
            )}

            {chamado.status === "em andamento" && (
                <div className="etapa">
                    <h3>Resolver chamado</h3>
                    <input
                        type="text"
                        placeholder="Solução"
                        value={solucao}
                        onChange={function (e) { setSolucao(e.target.value); }}
                    />
                    <button onClick={resolver}>Resolver</button>
                </div>
            )}
        </div>
    );
}

export default Detalhe;