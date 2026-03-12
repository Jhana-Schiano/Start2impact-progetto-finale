import { useCallback } from "react";
import { useAppDispatch } from "../store/hooks";
import {
  dismissToast,
  showToast,
  type ShowToastInput,
} from "../store/toastSlice";

const useToast = () => {
  const dispatch = useAppDispatch();

  const onShowToast = useCallback(
    (input: ShowToastInput) => {
      dispatch(showToast(input));
    },
    [dispatch],
  );

  const onDismissToast = useCallback(
    (id: number) => {
      dispatch(dismissToast(id));
    },
    [dispatch],
  );

  return {
    showToast: onShowToast,
    dismissToast: onDismissToast,
  };
};

export default useToast;
