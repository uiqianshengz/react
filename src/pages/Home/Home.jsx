import React, { useEffect, useState } from 'react';
import { Layout, Menu, theme, Breadcrumb, Button } from 'antd';
import { getmenulist } from '../../untils/home'
import { Navigate } from 'react-router-dom'
import { useDispatch } from "react-redux";
import { changeMenusAction } from "../../store/exmepel";
//样式表
import styles from './index.module.css'
//中间视口
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
//组件图标
import { MenuFoldOutlined, MenuUnfoldOutlined, ShopOutlined, CreditCardOutlined, CarryOutOutlined, TeamOutlined, AppstoreAddOutlined, AlignRightOutlined, UserOutlined, DashboardOutlined, ApartmentOutlined } from '@ant-design/icons';
const { Header, Sider, Content } = Layout;

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}
const icons = [
    <CreditCardOutlined />, <ShopOutlined />, <CarryOutOutlined />, <AppstoreAddOutlined />, <AlignRightOutlined />, <TeamOutlined />
];
export default function Home() {
    let dispatch = useDispatch()
    //用户信息
    let [userinfo, setUser] = useState(JSON.parse(localStorage.getItem('userinfo')))
    //商品列表
    let [menulist, setlist] = useState([])
    let [items, setItems] = useState([])
    // [getItem('User', 'sub1', <UserOutlined />, [
    //     getItem('Tom', '3'),
    //     getItem('Bill', '4'),
    //     getItem('Alex', '5'),
    // ])]
    useEffect(() => {
        //获取左侧菜单栏数据
        async function getlist() {
            let res = await getmenulist()
            if (res.code === 20000) {
                let list = res.data.permissionList

                list.forEach(item =>
                    item.children ? item.children = item.children.filter(item1 => item1.hidden === false) : ''
                )

                list.forEach((item, ind) => {
                    icons.forEach((item1, indx) => {
                        if (ind === indx) {
                            item.icon = item1
                        }
                    })
                })

                // 判断本地缓存中有 userinfo 并且其中的 nickname 为超级管理员  ===》 添加权限管理
                if (localStorage.getItem('userinfo') && JSON.parse(localStorage.getItem('userinfo')).username === 'admin') {
                    list.unshift({
                        name: 'auth',
                        title: '权限管理',
                        path: '/auth',
                        icon: <ApartmentOutlined />,
                        hidden: false,
                        level: 0,
                        children: [
                            {
                                name: 'user',
                                path: 'user',
                                hidden: false,
                                title: '账号管理',
                                level: 1,
                            },
                            {
                                name: 'role',
                                path: 'role',
                                hidden: false,
                                title: '角色管理',
                                level: 1,
                            },
                            {
                                name: 'permission',
                                path: 'permission',
                                hidden: false,
                                title: '资源管理',
                                level: 1,
                            }
                        ]
                    })

                }

                // 添加主页
                list.unshift({
                    name: 'home',
                    title: '主页',
                    path: '/home',
                    icon: <DashboardOutlined />
                })
                list = list.splice(0, 7)
                setlist(list)
                console.log("list", list);
                //把菜单中的路由处理出来
                let menu = list.map(item => {
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
                })
                dispatch(changeMenusAction(menu))
                // console.log("menu", menu);
                setItems(list.map((item, index) => {
                    if (item.children) {
                        return item = {
                            label: item.title,
                            key: item.path,
                            icon: item.icon,
                            children: item.children.map((item1, ind) =>
                                item1 = {
                                    label: item1.title,
                                    key: item.path + '/' + item1.path,
                                })
                        }
                    } else {
                        return item = {
                            label: item.title,
                            key: item.path,
                            icon: item.icon,
                        }
                    }
                }))
            }
        }
        getlist()
    }, [])
    //收放按钮
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    let [page, setPage] = useState('')
    let [pages, setPages] = useState('')
    // const [keys,setkeys]=useState()
    let navgite = useNavigate()


    let clickMenu = ({ key, keyPath, }) => {
        setpathnames(keyPath)
        // console.log(11111, key, keyPath);
        if (key === '/home') {
            setPage('主页')
            setPages('')
            navgite(key)
            return
        }
        // console.log(22222, keyPath);
        //面包屑文字
        let string = key.split('/')
        // console.log(5555, keyPath[1]);
        if (menulist.length) {
            let res = menulist.find(item => {
                if (item.path === keyPath[1]) {
                    return item
                }
            })
            // console.log('res', res);
            let pagess = res.children.find(item => {
                if (item.path === string[string.length - 1]) {
                    return item
                }
            })
            // console.log(pagess)
            setPage(res.title)
            setPages(pagess.title)
            //点击跳转
            let path = "/home" + key
            navgite(path)
        }
    }

    // 退出
    const exit = () => {
        // 清空本地缓存
        localStorage.clear();
        // 回到登录页面
        navgite('/login')
    }
    let [paths, setpaths] = useState('')
    let [pathnames, setpathnames] = useState('')
    //页面刷新获取路径中的数据
    const { pathname } = useLocation()
    // console.log('hhehh', pathname);

    useEffect(() => {
        if (pathname === '/') {
            setPage('主页')
            setPages('')
            navgite('/home')
            return
        }
        setpathnames([pathname.split('/home')[1]])
        setpaths(['/' + pathname.split('/home')[1].split('/')[1]])
        setTimeout(() => {
            // console.log(2222, pathnames, paths);
        }, 1000);
        //面包屑导航页面一刷新显示 
        if (pathname) {
            if (pathname === '/home') {
                setPage('主页')
                setPages('')
                setpathnames(['/home'])
                setpaths(['/home'])
                return
            }
            //点击面包屑判断事件
            let key = pathname.split('/home')[1]
            let keyPath = [key, ('/' + key.split('/')[1])]
            if (pathname === '/home/product/addDetail') {
                key = '/product/list'
                keyPath = ['/product/list', '/product']
            } else if (pathname === '/home/order/detail') {
                key = '/order/list'
                keyPath = ['/order/list', '/order']
            } else if (pathname === '/home/order/returnbackdetail') {
                key = '/order/back'
                keyPath = ['/order/back', '/order']
            }
            //面包屑显示函数
            clickMenu({ key, keyPath })

        }
    }, [menulist])



    function gotoBread(page) {
        // console.log(page);
        let arr = menulist.filter(item => item.title === page)
        // console.log(arr[0]);
        let key = ''
        let keyPath = []
        if (arr[0].path == '/home') {
            // console.log(arr[0].path, 55555);
            key = arr[0].path
            keyPath = [arr[0].path]
        } else {
            key = arr[0].path + '/' + arr[0].children[0].path
            keyPath = [arr[0].path + '/' + arr[0].children[0].path, arr[0].path]
            console.log(arr[0].path + '/' + arr[0].children[0].path, 22222);
        }
        // console.log(11111, key, keyPath);
        clickMenu({ key, keyPath })
        setpathnames([keyPath[0]])
        setpaths([key])

        // setTimeout(() => {
        //     console.log(pathnames, paths);
        // }, 1000);
    }
    return (
        <Layout >
            {/* 侧边栏 */}
            <Sider
                className={styles.xScroll}
                width='180'
                style={{
                    height: "100vh"
                }}
                breakpoint="md" trigger={null} collapsible collapsed={collapsed}>
                <div className={styles.logo} />
                {/*菜单栏 */}
                {/* {
                        console.log("地址更新",pathname,newpathname)
                    } */}

                {
                    (pathnames.length && paths.length) && <Menu
                        className={styles.menu}
                        theme="dark"
                        mode="inline"
                        // defaultSelectedKeys={pathnames}
                        defaultOpenKeys={paths}
                        // forceSubMenuRender="true"
                        selectedKeys={pathnames}
                        items={items}
                        onSelect={clickMenu}

                    />
                }

            </Sider>

            <Layout className="site-layout">
                {/* 头部 */}
                <Header
                    style={{
                        boxSizing: "border-box",
                        padding: 10,
                        height: "10vh",
                        background: colorBgContainer,
                        lineHeight: "2rem"
                    }}
                    className={styles.Header}
                >
                    <div className={styles.headerBread}>
                        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: 'trigger',
                            onClick: () => setCollapsed(!collapsed),
                        })}
                        {/* 面包屑导航 */}
                        <div className={styles.user}>
                            <Breadcrumb >
                                <Breadcrumb.Item onClick={() => gotoBread(page)}>{page}</Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    {pages}
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </div>

                    </div>
                    <div className={styles.headerBread}>
                        <div className={styles.headerBread_left}>
                            <div className={styles.user}>欢迎管理员:{userinfo.username}</div>
                            <div className={styles.icons}><img className={styles.imgs} src={userinfo.icon} alt="" /></div>

                        </div>
                        {/* 退出按钮 */}
                        <div className={styles.headerBread_right}>
                            <Button type="primary" danger className={styles.exits} onClick={() => exit()}>退出</Button>
                        </div>
                    </div>


                </Header>
                {/* 内容部分 */}
                <Content className={styles.xScroll}>
                    <Outlet></Outlet>
                </Content>
            </Layout>
        </Layout>
    )
}