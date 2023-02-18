import { lazy } from "react";

import loadable from '@loadable/component'
const Auth = loadable(() => import('./Auth'))
const Home = loadable(() => import('../pages/Home/Home'))
const Login = loadable(() => import('../pages/Login/Login'))
const Layout = loadable(() => import('../pages/Layout'))
const Echarts = loadable(() => import('../views/echarts/index'))
const Authuser = loadable(() => import('../views/auth/user/index'))
const Authrole = loadable(() => import('../views/auth/role/index'))
const Authpermission = loadable(() => import('../views/auth/permission/index'))
//导入组件
const lazyLoad = (moduleName) => {
    // console.log(moduleName)
    const Module = loadable(() => import(`../views/${moduleName}`))
    return <Auth> <Module></Module></Auth>
};

//静态路由
const router = [
    {
        path: '/login',
        element: <Login></Login>
    },
    {
        path: '/',
        element: <Auth><Layout></Layout></Auth>,
        children: [
            {
                index: true,
                element: <Auth><Home></Home></Auth>
            },
            {
                path: 'home',
                element: <Auth><Home></Home></Auth>,
                children: [
                    {
                        index: true,
                        element: <Auth><Echarts></Echarts></Auth>
                    },
                    {
                        path: 'auth',
                        element: <Auth><Layout></Layout></Auth>,
                        children: [{
                            path: 'user',
                            element: <Auth><Authuser></Authuser></Auth>,
                        },
                        {
                            path: 'role',
                            element: <Auth><Authrole></Authrole></Auth>,
                        },
                        {
                            path: 'permission',
                            element: <Auth><Authpermission></Authpermission></Auth>,
                        },]
                    },
                ]
            },

        ]

    }
];

let pathrouter = {}
let list = JSON.parse(localStorage.getItem('menus'))


if (list) {
    // console.log(list);
    list.find(item => item.path === '/order').children.push(
        {
            path: 'detail',

            component: '@/views/order/detail'
        },
        {
            path: 'returnbackdetail',

            component: '@/views/order/orderBack/order'
        })
    list.find(item => item.path === '/product').children.push(
        {
            path: 'addDetail',

            component: '@/views/product/addDetail/index'
        },)
    list.find(item => item.path === '/content').children.push(
        {
            path: 'addArticle',
            component: '@/views/content/addArticle'
        },
    )
    list.splice(0, 2)
    list.forEach(item => {
        pathrouter = {
            path: item.name,
            element: <Auth><Layout></Layout></Auth>,
            children: item.children ? item.children.map(item2 => {
                return {
                    path: item2.path,
                    element: item2.component ? lazyLoad(item2.component.split('@/views/')[1]) : ''
                }
            }
            ) : []
        }

        router[1].children[1].children.push(pathrouter)
        // console.log(router[1].children[1].children)

    }
    )
}
export default router