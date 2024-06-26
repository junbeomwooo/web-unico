import { configureStore } from "@reduxjs/toolkit";
import CategorySlice from './slices/CategorySlice'
import colorReducer from "./slices/fontColorReducer";
import SubCategorySlice from './slices/SubCategorySlice';
import ProductSlice from './slices/ProductSlice';
import MemberSlice from "./slices/MemberSlice";
import CartSlice from "./slices/CartSlice";
import GuestCartSlice from "./slices/GuestCartSlice";
import OrderDetailSlice from "./slices/OrderDetailSlice";
import GuestOrderDetailSlice from './slices/GuestOrderDetailSlice'

const store = configureStore({
    reducer: {
        CategorySlice: CategorySlice,
        colorReducer: colorReducer,
        SubCategorySlice : SubCategorySlice,
        ProductSlice : ProductSlice,
        MemberSlice: MemberSlice,
        CartSlice: CartSlice,
        GuestCartSlice: GuestCartSlice,
        OrderDetailSlice: OrderDetailSlice,
        GuestOrderDetailSlice: GuestOrderDetailSlice,
        
    },
    middleware: (getDefaultMiddleware) => [
        ...getDefaultMiddleware({
            serializableCheck: false,
        }),
    ],
});

export default store;