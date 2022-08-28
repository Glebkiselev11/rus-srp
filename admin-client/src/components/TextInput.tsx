import React from "react";

interface InputProps {
  value: string | number,
	className?: string,
	onChange: (arg: string) => void,
}

export function TextInput({value, className, onChange}: InputProps) {
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onChange(event.target.value);
	};

	const classes = ["border h-[50px] px-2", className].join(" ");

	return (
		<input 
			className={classes}
			type="text"
			value={value} 
			onChange={handleChange}
		/>
	);
}