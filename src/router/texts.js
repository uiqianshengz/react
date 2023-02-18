function routelist() {
    return localStorage.getItem('menu')
}

let menus = routelist()

export default menus