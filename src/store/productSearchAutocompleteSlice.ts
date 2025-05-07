// store/productSearchAutocompleteSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductSearchState {
  query: string;
}

const initialState: ProductSearchState = {
  query: "",
};

const productSearchAutocompleteSlice = createSlice({
  name: "productSearchAutocomplete",
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    clearSearchQuery(state) {
      state.query = "";
    },
  },
});

export const { setSearchQuery, clearSearchQuery } =
  productSearchAutocompleteSlice.actions;
export default productSearchAutocompleteSlice.reducer;
