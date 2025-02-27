import { configureStore } from "@reduxjs/toolkit";
import receiptReducer from "./receiptSlice";
import orderReducer from "./orderSlice";
import { RootState } from "./types";

const store = configureStore({
  reducer: {
    receipts: receiptReducer,
    order: orderReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export default store;
