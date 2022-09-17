export default function Select(options, onChange) {
  return (
    <select
      className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:bg-white focus:border-gray-500"
      onChange={onChange}
    >
      {options.map((o) => (
        <option value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
