function InputField({ label, type = "text", value, onChange, rows, required = false }) {
    return (
        <>
            <label>{label}</label>
            {type === "textarea" ? (
                <textarea
                    rows={rows || 4}
                    value={value}
                    onChange={onChange}
                    required={required}
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    required={required}
                />
            )}
        </>
    );
}

export default InputField;