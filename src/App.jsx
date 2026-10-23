import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import "./index.css"

import { buscarUsuarioAtual } from "./services/chamadoService.js";
import Home from "./pages/Home.jsx";
import Detalhe from "./pages/Detalhe.jsx";
import Formulario from "./pages/Formulario.jsx";

function App() {
  const [user, setUser] = useState(null);

  useEffect(function () {
    async function carregarUsuario() {
      try {
        const dados = await buscarUsuarioAtual();
        setUser(dados);
      } catch (erro) {
        console.error("Erro ao carregar usuário:", erro);
      }
    }

    carregarUsuario();
  }, []);

  return (
      <div className="pagina">
        <header className="cabecalho">
          <Link to="/">
            <h1>Sistema de Chamados</h1>
          </Link>
          <p>Olá, {user?.nome || user?.name || "Usuário"}</p>
        </header>

        <main className="conteudo">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chamado/:id" element={<Detalhe />} />
            <Route path="/novo" element={<Formulario />} />
            <Route path="/editar/:id" element={<Formulario />} />
          </Routes>
        </main>
      </div>
  );
}

export default App;