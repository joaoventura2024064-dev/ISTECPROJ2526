export default function Slider(type, name, min, max, step, value, onChange, readOnly) {
    return (
        <div>
            <div className="flex justify-between items-center">
                <label className="text-neutral-500 text-xs font-montserrat font-semibold">Duração (Dias)</label>
                <span className="text-primary-500 text-xs font-montserrat font-bold">{value}</span>
            </div>
            <input
                type={type}
                name={name}
                min={min}
                max={max}
                step={step}
                value="1"
                //onChange={onChange}
                //disabled={readOnly}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-500 disabled:accent-neutral-300"
            />
        </div>
    );
}