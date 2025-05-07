// store/productSearchSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductSearchState {
  searchTerm: string;
}

const initialState: ProductSearchState = {
  searchTerm: "",
};

const productSearchSlice = createSlice({
  name: "productSearch",
  initialState,
  reducers: {
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
  },
});

export const { setSearchTerm } = productSearchSlice.actions;
export default productSearchSlice.reducer;
