// 创建一个分仓库
import { createSlice } from '@reduxjs/toolkit'


// 创建一个初始化分仓库数据		==> 名字必须为 initialState
const initialState = {
    product: {
        pmsSkuStockList: [],
        product: {}
    }
}

// 使用 createSlice 配置分仓库的配置选项，并向外导出
export const productSlice = createSlice({
    // 当前仓库名称/命名空间
    name: 'productInfo',
    // 向分仓库中挂载初始化数据
    initialState,
    // 当前仓库的管理员（里面放当前仓库中存储的同步方法）
    reducers: {
        changePmsSkuStockList: (state, { payload }) => {
            state.product.pmsSkuStockList = payload
        },
        changeProduct: (state, { payload }) => {
            state.product.product = {
                ...state.product.product,
                ...payload
            }
        },
        initProductStore: (state) => {
            state.product = {
                pmsSkuStockList: [],
                product: {}
            }
        }
    },
})

// 向外导出 所有的同步方法      productSlice：当前分仓库       actions：同步方法
export const {
    changePmsSkuStockList,
    changeProduct,
    initProductStore
} = productSlice.actions


// 导出分仓库的管理员
export default productSlice.reducer