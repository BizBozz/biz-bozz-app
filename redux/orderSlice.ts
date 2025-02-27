import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface OrderItem {
  dishName: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  table: string;
  orderType: "Dine In" | "Take Away";
  orders: OrderItem[];
  tax: number;
  totalPrice: number;
  finalPrice: number;
  paymentType: string;
  paidPrice: number;
  extraChange: number;
  createdAt: string;
}

interface OrderState {
  currentOrder: Order | null;
  isEdited: boolean;
}

const initialState: OrderState = {
  currentOrder: null,
  isEdited: false,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setCurrentOrder: (state, action: PayloadAction<Order>) => {
      state.currentOrder = action.payload;
      state.isEdited = false;
    },
    incrementOrderItem: (state, action: PayloadAction<string>) => {
      if (!state.currentOrder) return;
      
      const dishName = action.payload;
      const item = state.currentOrder.orders.find(i => i.dishName === dishName);
      
      if (item) {
        item.quantity += 1;
      }
      
      // Recalculate totals
      state.currentOrder.totalPrice = state.currentOrder.orders.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      state.currentOrder.finalPrice = 
        state.currentOrder.totalPrice + (state.currentOrder.totalPrice * state.currentOrder.tax);
      
      state.isEdited = true;
    },
    decrementOrderItem: (state, action: PayloadAction<string>) => {
      if (!state.currentOrder) return;
      
      const dishName = action.payload;
      const itemIndex = state.currentOrder.orders.findIndex(i => i.dishName === dishName);
      
      if (itemIndex > -1) {
        if (state.currentOrder.orders[itemIndex].quantity > 1) {
          state.currentOrder.orders[itemIndex].quantity -= 1;
        } else {
          state.currentOrder.orders.splice(itemIndex, 1);
        }
        
        // Recalculate totals
        state.currentOrder.totalPrice = state.currentOrder.orders.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        state.currentOrder.finalPrice = 
          state.currentOrder.totalPrice + (state.currentOrder.totalPrice * state.currentOrder.tax);
        
        state.isEdited = true;
      }
    },
    addNewOrderItem: (state, action: PayloadAction<OrderItem>) => {
      if (!state.currentOrder) return;
      
      const existingItem = state.currentOrder.orders.find(
        i => i.dishName === action.payload.dishName
      );
      
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.currentOrder.orders.push(action.payload);
      }
      
      // Recalculate totals
      state.currentOrder.totalPrice = state.currentOrder.orders.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      state.currentOrder.finalPrice = 
        state.currentOrder.totalPrice + (state.currentOrder.totalPrice * state.currentOrder.tax);
      
      state.isEdited = true;
    },
    clearOrderEdited: (state) => {
      state.isEdited = false;
    },
  },
});

export const {
  setCurrentOrder,
  incrementOrderItem,
  decrementOrderItem,
  addNewOrderItem,
  clearOrderEdited,
} = orderSlice.actions;

export default orderSlice.reducer;
