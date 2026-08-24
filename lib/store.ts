import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "@/features/theme/themeSlice";
import usersReducer from "@/features/users/usersSlice";
import newsReducer from "@/features/news/newsSlice";

export const store = configureStore({
  reducer: { 
    theme: themeReducer,
    users: usersReducer,
    news: newsReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});
   
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

