import { INotification } from "../models";
import { useActions } from "./actions";

export function useNotification() {
  const { add, shift } = useActions();

  return {
    trigger: (note: INotification) => {
      add(note);
      setTimeout(() => {
        shift();
      }, 5000);
    },
  };
}
