import { configureStore } from "@reduxjs/toolkit";
import receiptReducer from "./receiptSlice";
import { RootState } from "./types";

const store = configureStore({
  reducer: {
    receipts: receiptReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export default store;
