import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import productSearchReducer from "./productSearchSlice";
import productSearchAutocompleteReducer from "./productSearchAutocompleteSlice";

export const store = configureStore({
  reducer: {
    productSearch: productSearchReducer,
    productSearchAutocomplete: productSearchAutocompleteReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
