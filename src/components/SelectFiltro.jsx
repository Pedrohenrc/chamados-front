function SelectFiltro({ rotulo, placeholder, valor, opcoes, onChange }) {
    return (
        <select
            aria-label={rotulo}
            value={valor}
            onChange={function (evento) {
                onChange(evento.target.value);
            }}
        >
            <option value="">{placeholder}</option>
            {opcoes.map(function (opcao) {
                return (
                    <option key={opcao.valor} value={opcao.valor}>
                        {opcao.texto}
                    </option>
                );
            })}
        </select>
    );
}

export default SelectFiltro;