export interface OptionItem {
  value: string;
  label: string;
}

interface AppSelectProps {
  selected: string | undefined;
  options: Array<OptionItem>;
  onChange: (x: OptionItem["value"]) => void;
  id?: string;
}

export function AppSelect({ selected, options, onChange, id }: AppSelectProps) {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value as OptionItem["value"]);
  };

  return (
    <select id={id} value={selected} onChange={handleSelectChange}>
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
