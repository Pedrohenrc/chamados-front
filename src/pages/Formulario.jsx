import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    listarChamadoPorId,
    criarChamado,
    atualizarChamado,
    listarTipos,
    listarLocais,
    listarPrioridades,
    mensagemDeErro,
} from "../services/chamadoService.js";

import InputField from "../components/InputField.jsx";
import SelectField from "../components/SelectField.jsx";

function Formulario() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [tipo, setTipo] = useState("");
    const [local, setLocal] = useState("");
    const [prioridade, setPrioridade] = useState("");
    const [dataAbertura, setDataAbertura] = useState("");

    const [tipos, setTipos] = useState([]);
    const [locais, setLocais] = useState([]);
    const [prioridades, setPrioridades] = useState([]);

    const [carregando, setCarregando] = useState(true);
    const [resolvido, setResolvido] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    useEffect(function () {
        async function carregar() {
            try {
                setTipos(await listarTipos());
                setLocais(await listarLocais());
                setPrioridades(await listarPrioridades());

                if (id) {
                    const chamado = await listarChamadoPorId(id);

                    if (chamado.status === "resolvido") {
                        setResolvido(true);
                    } else {
                        setTitulo(chamado.titulo);
                        setDescricao(chamado.descricao);
                        setTipo(chamado.tipo);
                        setLocal(chamado.local);
                        setPrioridade(chamado.prioridade);
                        setDataAbertura(chamado.data_abertura);
                    }
                }
            } catch (e) {
                setErro(
                    mensagemDeErro(
                        e,
                        "Não foi possível carregar o formulário."
                    )
                );
            } finally {
                setCarregando(false);
            }
        }

        carregar();
    }, [id]);

    async function salvar(evento) {
        evento.preventDefault();
        setErro("");
        setSucesso("");

        const chamado = {
            titulo,
            descricao,
            tipo,
            local,
            prioridade,
            data_abertura: dataAbertura,
        };

        try {
            let dados;

            if (id) {
                dados = await atualizarChamado(id, chamado);
            } else {
                dados = await criarChamado(chamado);
            }

            setSucesso("Chamado salvo com sucesso!");

            setTimeout(function () {
                navigate("/chamado/" + (dados.id || id));
            }, 1000);
        } catch (e) {
            setErro(
                mensagemDeErro(
                    e,
                    "Não foi possível salvar o chamado."
                )
            );
        }
    }

    if (carregando) {
        return <p>Carregando...</p>;
    }

    if (resolvido) {
        return (
            <div>
                <p className="mensagem-erro">
                    Chamado resolvido não pode ser editado.
                </p>

                <button
                    onClick={function () {
                        navigate("/chamado/" + id);
                    }}
                >
                    Voltar
                </button>
            </div>
        );
    }

    return (
        <div>
            <h2>{id ? "Editar chamado" : "Abrir chamado"}</h2>

            <form className="formulario" onSubmit={salvar}>
                <InputField
                    label="Título"
                    value={titulo}
                    onChange={function (e) {
                        setTitulo(e.target.value);
                    }}
                    required
                />

                <InputField
                    label="Descrição"
                    type="textarea"
                    value={descricao}
                    onChange={function (e) {
                        setDescricao(e.target.value);
                    }}
                    required
                />

                <SelectField
                    label="Tipo"
                    value={tipo}
                    onChange={function (e) {
                        setTipo(e.target.value);
                    }}
                    opcoes={tipos}
                    required
                />

                <SelectField
                    label="Local"
                    value={local}
                    onChange={function (e) {
                        setLocal(e.target.value);
                    }}
                    opcoes={locais}
                    required
                />

                <SelectField
                    label="Prioridade"
                    value={prioridade}
                    onChange={function (e) {
                        setPrioridade(e.target.value);
                    }}
                    opcoes={prioridades}
                    required
                />

                <InputField
                    label="Data de abertura"
                    type="date"
                    value={dataAbertura}
                    onChange={function (e) {
                        setDataAbertura(e.target.value);
                    }}
                    required
                />

                {erro && (
                    <p className="mensagem-erro">{erro}</p>
                )}

                {sucesso && (
                    <p className="mensagem-sucesso">{sucesso}</p>
                )}

                <div className="acoes">
                    <button type="submit">Salvar</button>

                    <button
                        type="button"
                        onClick={function () {
                            navigate(id ? "/chamado/" + id : "/");
                        }}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Formulario;