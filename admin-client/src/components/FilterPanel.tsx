import { useTranslation } from "react-i18next";
import { IRequestParams, Order } from "../models/api";
import { TextInput } from "./TextInput";
import { AppSelect } from "./AppSelect";
import { useState } from "react";

type OrderOptionType = { label: string; value: Order };

interface FilterPanelProps {
  params: IRequestParams;
  onChange: (p: IRequestParams) => void;
}

export function FilterPanel({ params, onChange }: FilterPanelProps) {
  const { t } = useTranslation();

  const orderOptions: OrderOptionType[] = [
    { label: t("order.new-words"), value: "-created_at" },
    { label: t("order.old-words"), value: "created_at" },
    { label: t("order.last-updated"), value: "-updated_at" },
  ];

  const [orderState, setOrderState] = useState<Order>(
    params.order ?? orderOptions[0].value
  );

  const handleOrderChange = (x: string) => {
    const order = x as Order;
    setOrderState(order);
    onChange({ ...params, order });
  };

  const handleSearchInput = (search: string) => {
    onChange({ ...params, search });
  };

  return (
    <div className="flex items-end justify-between">
      <TextInput
        value={params.search || ""}
        onChange={handleSearchInput}
        label={t("search")}
      />

      <AppSelect
        selected={orderState}
        options={orderOptions}
        onChange={handleOrderChange}
      />
    </div>
  );
}
