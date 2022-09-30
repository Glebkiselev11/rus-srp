import { useTranslation } from "react-i18next";
import { IRequestParams } from "../models/api";
import { TextInput } from "./TextInput";

interface FilterPanelProps {
  params: IRequestParams,
  onChange: (p: IRequestParams) => void
}

export function FilterPanel({ params, onChange }: FilterPanelProps) {
	const { t } = useTranslation();

	return (
		<div>
			<TextInput 
				value={params.search || ""} 
				onChange={search => onChange({ ...params, search })} 
				label={t("search")} 
			/>
		</div>
	);
}