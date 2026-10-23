import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
    listarChamados,
    listarTipos,
    listarLocais,
    listarPrioridades,
    mensagemDeErro,
} from "../services/chamadoService.js";
import CardChamado from "../components/CardChamado.jsx";
import SelectFiltro from "../components/SelectFiltro.jsx";

const OPCOES_STATUS = [
    { valor: "aberto", texto: "Aberto" },
    { valor: "em andamento", texto: "Em andamento" },
    { valor: "resolvido", texto: "Resolvido" },
];

function paraOpcoes(lista) {
    return lista.map(function (item) {
        return { valor: item, texto: item };
    });
}

function Home() {
    const [chamados, setChamados] = useState([]);

    const [tipos, setTipos] = useState([]);
    const [locais, setLocais] = useState([]);
    const [prioridades, setPrioridades] = useState([]);

    const [local, setLocal] = useState("");
    const [tipo, setTipo] = useState("");
    const [prioridade, setPrioridade] = useState("");
    const [status, setStatus] = useState("");
    const [busca, setBusca] = useState("");
    const [buscaAplicada, setBuscaAplicada] = useState("");
    const [recarregar, setRecarregar] = useState(0);

    const [error, setError] = useState("");
    const [carregando, setCarregando] = useState(true);

    const navigate = useNavigate();

    useEffect(function () {
        let ativo = true;

        async function carregarListas() {
            try {
                const resultado = await Promise.all([
                    listarTipos(),
                    listarLocais(),
                    listarPrioridades(),
                ]);
                if (!ativo) return;
                setTipos(resultado[0]);
                setLocais(resultado[1]);
                setPrioridades(resultado[2]);
            } catch (erro) {
                console.error("Erro ao carregar listas:", erro);
            }
        }

        carregarListas();

        return function () {
            ativo = false;
        };
    }, []);

    useEffect(function () {
        let ativo = true;

        async function carregarChamados() {
            const filtros = {
                status: status || null,
                tipo: tipo || null,
                local: local || null,
                prioridade: prioridade || null,
                busca: buscaAplicada || null,
            };

            try {
                const dados = await listarChamados(filtros);
                if (!ativo) return;
                setChamados(dados);
                setError("");
            } catch (erro) {
                if (!ativo) return;
                setError(mensagemDeErro(erro, "Não foi possível carregar os chamados."));
            } finally {
                if (ativo) setCarregando(false);
            }
        }

        carregarChamados();

        return function () {
            ativo = false;
        };
    }, [status, tipo, local, prioridade, buscaAplicada, recarregar]);

    function alterarFiltro(setter, valor) {
        setCarregando(true);
        setError("");
        setter(valor);
    }

    function buscarPorTexto() {
        setCarregando(true);
        setError("");

        const novaBusca = busca.trim();

        if (novaBusca === buscaAplicada) {
            setRecarregar(function (n) {
                return n + 1;
            });
        } else {
            setBuscaAplicada(novaBusca);
        }
    }

    return (
        <div>
            <div className="titulo-lista">
                <h2>Chamados de manutenção</h2>

                <button
                    onClick={function () {
                        navigate("/novo");
                    }}
                >
                    + Abrir chamado
                </button>
            </div>

            <div className="filtros">
                <input
                    type="text"
                    placeholder="Buscar por título ou descrição"
                    aria-label="Buscar chamados"
                    value={busca}
                    onChange={function (evento) {
                        setBusca(evento.target.value);
                    }}
                    onKeyDown={function (evento) {
                        if (evento.key === "Enter") {
                            buscarPorTexto();
                        }
                    }}
                />

                <button onClick={buscarPorTexto}>Buscar</button>

                <SelectFiltro
                    rotulo="Filtrar por status"
                    placeholder="Todos os status"
                    valor={status}
                    opcoes={OPCOES_STATUS}
                    onChange={function (valor) {
                        alterarFiltro(setStatus, valor);
                    }}
                />

                <SelectFiltro
                    rotulo="Filtrar por tipo"
                    placeholder="Todos os tipos"
                    valor={tipo}
                    opcoes={paraOpcoes(tipos)}
                    onChange={function (valor) {
                        alterarFiltro(setTipo, valor);
                    }}
                />

                <SelectFiltro
                    rotulo="Filtrar por local"
                    placeholder="Todos os locais"
                    valor={local}
                    opcoes={paraOpcoes(locais)}
                    onChange={function (valor) {
                        alterarFiltro(setLocal, valor);
                    }}
                />

                <SelectFiltro
                    rotulo="Filtrar por prioridade"
                    placeholder="Todas as prioridades"
                    valor={prioridade}
                    opcoes={paraOpcoes(prioridades)}
                    onChange={function (valor) {
                        alterarFiltro(setPrioridade, valor);
                    }}
                />
            </div>

            {carregando && <p>Carregando chamados...</p>}

            {!carregando && error && <p className="mensagem-erro">{error}</p>}

            {!carregando && !error && chamados.length === 0 && (
                <p>Nenhum chamado encontrado.</p>
            )}

            {!carregando &&
                !error &&
                chamados.map(function (chamado) {
                    return (
                        <CardChamado
                            key={chamado.id}
                            chamado={chamado}
                            aoVerDetalhes={function (id) {
                                navigate("/chamado/" + id);
                            }}
                        />
                    );
                })}
        </div>
    );
}

export default Home;