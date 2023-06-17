export interface OptionItem {
  value: string;
  label: string;
}

interface AppSelectProps {
  selected: string;
  options: Array<OptionItem>;
  onChange: (x: OptionItem["value"]) => void;
}

export function AppSelect({ selected, options, onChange }: AppSelectProps) {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value as OptionItem["value"]);
  };

  return (
    <select value={selected} onChange={handleSelectChange}>
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
