import React, { useState } from "react";

interface InputProps {
  value: string,
	className?: string,
	label?: string,
	onChange: (arg: string) => void,
}

export function TextInput({ value, className, onChange, label }: InputProps) {
	const [focus, setFocus] = useState(false);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onChange(event.target.value);
	};

	const onFocusLabelClasses = "top-1 text-xs text-gray-500";
	const onBlurLabelClasses = "top-4 text-gray-300";

	const labelClasses = [
		"absolute left-4 transition-all",
		focus || value !== "" ? onFocusLabelClasses : onBlurLabelClasses
	].join(" ");

	const inputClasses = ["border h-[56px] px-4 w-full", className].join(" ");

	return (
		<div className="relative">
			{label && <label htmlFor={label} className={labelClasses}>{label}</label>}
			<input 
				id={label}
				className={inputClasses}
				type="text"
				value={value} 
				onChange={handleChange}
				onFocus={() => setFocus(true)}
				onBlur={() => setFocus(false)}
			/>
		</div>
	);
}