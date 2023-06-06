import React, { useState } from "react";
import { AppButton } from "./AppButton";

interface InputProps {
  value: string,
	className?: string,
	label?: string,
	onChange: (arg: string) => void,
	clearable?: boolean
}

export function TextInput({ value, className, onChange, label, clearable = false }: InputProps) {
	const [focus, setFocus] = useState(false);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onChange(event.target.value);
	};

	const clearValue = () => onChange("");

	const onFocusLabelClasses = "top-[-7px] bg-white px-0.5 text-xs text-indigo-700";
	const onBlurLabelClasses = "top-3 text-gray-300";

	const labelClasses = [
		"absolute left-4 transition-all",
		focus || value !== "" ? onFocusLabelClasses : onBlurLabelClasses
	].join(" ");

	const inputClasses = 
		["border h-[48px] px-4 w-full border-2 rounded-md outline-indigo-700", className, ].join(" ");

	return (
		<div className="relative my-1">
			{label && 
				<label htmlFor={label} className={labelClasses}>
					{label}
				</label>
			}
			<input 
				id={label}
				className={inputClasses}
				type="text"
				value={value} 
				onChange={handleChange}
				onFocus={() => setFocus(true)}
				onBlur={() => setFocus(false)}
			/>
			{clearable && value &&
				<AppButton 
					className="absolute right-1 top-1" 
					icon="cancel" 
					onClick={clearValue}
				/>
			}
		</div>
	);
}