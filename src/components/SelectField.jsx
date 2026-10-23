function SelectField({ label, value, onChange, opcoes, required = false }) {
    return (
        <>
            <label>{label}</label>
            <select
                value={value}
                onChange={onChange}
                required={required}
            >
                <option value="">Selecione</option>
                {opcoes.map(function (option) {
                    return (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    );
                })}
            </select>
        </>
    );
}

export default SelectField;