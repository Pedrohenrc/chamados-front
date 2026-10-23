function CardChamado(props) {
    return (
        <div className="card-chamado">
            <h3>{props.chamado.titulo}</h3>
            <p>{props.chamado.descricao}</p>
            <p>Tipo: {props.chamado.tipo}</p>
            <p>Local: {props.chamado.local}</p>
            <p>Prioridade: {props.chamado.prioridade}</p>
            <p>Status: {props.chamado.status}</p>
            <p>Data de abertura: {props.chamado.data_abertura}</p>

            <button onClick={function () {
                props.aoVerDetalhes(props.chamado.id);
            }}>
                Ver detalhes
            </button>
        </div>
    );
}

export default CardChamado;