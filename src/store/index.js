/* import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './exmepel'
export default configureStore({
  reducer: {
    count: counterReducer
  }
})
 */


import { configureStore } from "@reduxjs/toolkit";
import loginReducer, { loadLocalLogin } from './exmepel'
import productReducer from './productInfo'

// 创建一个 Redux
const store = configureStore({
  reducer: {
    login: loginReducer,
    product: productReducer
  },
});

// 统一在这里初始化一些缓存的数据
export function setupStore() {
  // 这里是缓存的菜单，程序加载会先调用这个
  store.dispatch(loadLocalLogin());
}
/* 
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; */
export default store;
