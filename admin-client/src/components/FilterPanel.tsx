import { useTranslation } from "react-i18next";
import { IRequestParams, Order } from "../models/api";
import { TextInput } from "./TextInput";
import { AppSelect } from "./AppSelect";
import { useState } from "react";

type OrderOptionType = { label: string, value: Order };

interface FilterPanelProps {
  params: IRequestParams,
  onChange: (p: IRequestParams) => void
}

export function FilterPanel({ params, onChange }: FilterPanelProps) {
	const { t } = useTranslation();

	const [orderState, setOrderState] = useState<Order>(params.order ?? "created_at");

	const orderOptions: OrderOptionType[] = [
		{ label: t("order.old-words"), value: "created_at" },
		{ label: t("order.new-words"), value: "-created_at" }
	];

	const handleOrderChange = (x: string) => {
		const order = x as Order;
		setOrderState(order);
		onChange({ ...params, order });
	};

	return (
		<div className="flex items-center justify-between">
			<TextInput 
				value={params.search || ""} 
				onChange={search => onChange({ ...params, search })} 
				label={t("search")} 
			/>

			<AppSelect selected={orderState} options={orderOptions} onChange={handleOrderChange}/>
		</div>
	);
}