import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 这里统一加载缓存的一些数据
export const loadLocalLogin = createAsyncThunk(
    "login/loadLocalLogin",
    (_, { dispatch }) => {
        const menus = localStorage.getItem("menus");
        if (menus) {
            dispatch(changeMenusAction(JSON.parse(menus)));
        }
    }
);

const loginSlice = createSlice({
    name: "login",
    initialState: {
        menulists: [],
    },
    reducers: {
        changeMenusAction(state, { payload }) {
            // 把数据存到redux里面，有点类似vuex
            payload.forEach(element => {
                element.icon = ''
            });
            state.menulists = payload;

            //把菜单中的路由处理出来
            /*   let menu = list.map(item => {
                  if (item.children) {
                      return item = {
                          name: item.name,
                          path: item.path,
                          children: item.children.map(item1 => item1 = {
                              name: item1.name,
                              component: item1.component,
                              path: item1.path
                          })

                      }
                  } else {
                      return item = {
                          name: item.name,
                          path: item.path
                      }
                  }
              }) */


            localStorage.setItem("menus", JSON.stringify(payload));
        },
    },
});



export const { changeMenusAction } = loginSlice.actions;

export default loginSlice.reducer;
