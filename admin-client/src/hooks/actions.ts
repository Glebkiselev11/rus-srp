import { useDispatch } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { notificatonActions } from "../store/notification";

const actions = {
  ...notificatonActions,
};

export const useActions = () => {
  const dispatch = useDispatch();
  return bindActionCreators(actions, dispatch);
};
