const url = 'http://localhost:3000/'
const axiosAPI = async(body) => await axios(body)
const getCategories = async() => {
    const urlProducts = url + 'Categories'
    const body = {
        method: 'get',
        url: urlProducts,
        responseType: 'json'
    }
    return await axiosAPI(body)
}
const getCategoryById = async(id) => {
    const urlProducts = url + 'Categories/' + id
    const body = {
        method: 'get',
        url: urlProducts,
        responseType: 'json'
    }
    return await axiosAPI(body)
}
const getProducts = async() => {
    const urlProducts = url + 'Products'
    const body = {
        method: 'get',
        url: urlProducts,
        responseType: 'json'
    }
    return res = await axiosAPI(body)
}
const getProductById = async(id) => {
    const urlProducts = url + 'Products/' + id
    const body = {
        method: 'get',
        url: urlProducts,
        responseType: 'json'
    }
    return await axiosAPI(body)
}

const showItemsShop = async() => {
    const res_products = await getProducts()
    const res_categories = await getCategories()
    const data_products = res_products.data
    const data_categories = res_categories.data

    let listProducts = ""
    data_products.forEach((x) => {
        // console.log(x);
        let name_category = data_categories.find(category => category.id == x.id_category).name
        listProducts += `
        <div class="col-lg-4 col-sm-6">
            <div class="product-item">
                <div class="pi-pic">
                    <img src="../uploads/products/${x.image}" alt="" onerror="this.src='img/products/man-4.jpg'" width="270" height="300">
                    <div class="sale pp-sale">Sale</div>
                    <div class="icon">
                        <i class="icon_heart_alt"></i>
                    </div>
                    <ul>
                        <li class="w-icon active"><a href="#"><i class="icon_bag_alt"></i></a></li>
                        <li class="quick-view"><a href="./product.html?id=${x.id}">+ Quick View</a></li>
                        <li class="w-icon"><a href="#"><i class="fa fa-random"></i></a></li>
                    </ul>
                </div>
                <div class="pi-text">
                    <div class="catagory-name"></div>
                    <a href="#">
                        <h5>Pure Pineapple</h5>
                    </a>
                    <div class="product-price">
                        $${x.reduced_price}
                        <span>$${x.price}</span>
                    </div>
                </div>
            </div>
        </div>`
    });
    $("#showItemsProducts").html(listProducts)
}

const showProduct = async() => {
    const res = await getProductById(id)
    const product = res.data
    $("#price").html(`$${product.reduced_price}.00 <span>${product.price}.99</span>`), $(".name_product").html([product.name])
    $(".img-product").attr("src", `../uploads/products/${product.image}`)
    console.log(product.image);
}

// Add to Cart
// [{product:{id: 1,name: "sp1",price:123},quantity:1}]
let cart = []
const addtoCart = async(id) => {
    if ($("#quantity").val() <= 0) alert("Số lượng sản phẩm lớn hơn 0")
    else {
        let storage = localStorage.getItem('cart')
        let quantityAdd = Number($("#quantity").val())
        if (storage) {
            cart = JSON.parse(storage)
        }
        let product = await getProductById(id)
        product = product.data
        let item = cart.find(c => c.product.id == id)
        if (item) {
            item.quantity += quantityAdd
        } else {
            cart.push({ product, quantity: quantityAdd })
        }
        localStorage.setItem("cart", JSON.stringify(cart))
        changeQuantity()
        alert("Đã thêm sản phẩm vào giỏ hàng")
    }
}
const changeQuantity = () => {
        let storage = localStorage.getItem('cart')
        let quantity = 0
        if (storage) {
            cart = JSON.parse(storage)
            cart.forEach(c => {
                quantity += c.quantity
            });
        }
        $("#countCart").html(quantity)
    }
    //Show Cart Page
const showCartPage = () => {
    let storage = localStorage.getItem('cart')
    if (storage) {
        let tr = ""
        let subtotal = 0
        cart = JSON.parse(storage)
        cart.forEach(item => {
            tr += `
            <tr>
                <td class="cart-pic first-row"><img src="../uploads/products/${item.product.image}" alt="" width="170" height="170"></td>
                <td class="cart-title first-row">
                    <h5>${item.product.name}</h5>
                </td>
                <td class="p-price first-row">$${item.product.reduced_price}.00</td>
                <td class="qua-col first-row">
                    <div class="quantity">
                        <div class="pro-qty">
                            <input type="text" value="${item.quantity}">
                        </div>
                    </div>
                </td>
                <td class="total-price first-row">$${item.product.reduced_price*item.quantity}.00</td>
                <td class="close-td first-row"><i class="ti-close" onclick="removeItem(${item.product.id})"></i></td>
            </tr>
            `
            subtotal += item.product.reduced_price * item.quantity
        });
        $("#subtotal,#cart-total").html(`$${subtotal}.00`)
        $("#cartBody").html(tr), $("#cart-empty").addClass("d-none")
    } else {
        $("#table-cart").html(""), $("#cart-empty").removeClass("d-none")
    }
}
const removeItem = (id) => {
    let storage = localStorage.getItem('cart')
    if (storage) {
        cart = JSON.parse(storage)
    }
    cart = cart.filter(item => item.product.id != id)
    if (cart.length) localStorage.setItem("cart", JSON.stringify(cart))
    else localStorage.removeItem("cart");

    showCartPage()
    changeQuantity()
}
const removeCartAll = () => {
        localStorage.removeItem("cart");
        showCartPage()
        changeQuantity()
    }
    // const updateCart = () => {}
    // removeCartAll()
    // console.log(JSON.parse(localStorage.getItem('cart')));

const showCheckOut = () => {
    let storage = localStorage.getItem('cart')
    if (storage) {
        let tr = ""
        let subtotal = 0
        cart = JSON.parse(storage)
        cart.forEach(item => {
            tr += `
                <li class="fw-normal">${item.product.name} x ${item.quantity} <span>$${item.product.reduced_price*item.quantity}.00</span></li>
                `
            subtotal += item.product.reduced_price * item.quantity
        });
        $("#li-thead").after(tr)
        $("#subtotal,#cart-total").html(`$${subtotal}.00`)
    }
}
const checkOrder = () => {
    if (!$("#fir").val()) $("#error_fir").html("Is Empty")
        // if (!$("#last").val()) $("#error_last").html("Is Empty")
    if (!$("#street").val()) $("#error_street-first").html("Is Empty")
    if (!$("#phone").val()) $("#error_phone").html("Is Empty")
    if ($("#fir").val() && $("#street-first") && $("#phone").val()) {
        let vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
        if (!vnf_regex.test($("#phone").val())) $("#error_phone").html("ErrorPhone !")
        else checkout()
    }
}
const checkout = async() => {
    const data = {
        name: $("#fir").val(),
        phone: $("#phone").val(),
        street: $("#street").val(),
        created_at: moment().format('LLL'),
        status: "open"
    }
    const urlProducts = url + 'Orders'
    const body = {
        method: 'post',
        url: urlProducts,
        responseType: 'json',
        data
    }
    const res = await axiosAPI(body)
    const res_data = res.data
        // console.log(res_data);
    await processOrderDetail(res_data.id)
}
const processOrderDetail = async(orderId) => {
    let storage = localStorage.getItem('cart')
    if (storage) {
        cart = JSON.parse(storage)
    }
    let orderDetails = []
    cart.forEach((item, i) => {
        let orderDetail = {
            order_id: orderId,
            product_id: item.product.id,
            quantity: item.quantity,
            unit_price: item.product.reduced_price
        }
        orderDetails.push(orderDetail)
    });
    let promises = orderDetails.map(item => {
        return postOrderDetail(item)
    })
    await Promise.all(promises)
    await removeCartAll()
    await (window.location.href = "file:///D:/My%20Program/FPT%20Polytechnic/Program%20learning/JavaScript-2%20(WEB2061)/ASM%20-%20Final/site/index.html")

}
const postOrderDetail = async(data) => {
        const urlProducts = url + 'Orders_details'
        const body = {
            method: 'post',
            url: urlProducts,
            responseType: 'json',
            data
        }
        const res = await axiosAPI(body)
    }
    // LOGIN
const login = () => {
    const username = $("#username").val().trim()
    const pass = $("#pass").val().trim()
    if (username == "") $("#username_error").html("Don't leave it blank")
    if (pass == "") $("#pass_error").html("Don't leave it blank")
    if (username != "" && pass != "") {
        if (username == "admin" && pass == "admin") {
            localStorage.setItem("account", "admin")
            window.location = "./index.html"
            $("#login").addClass("d-none")
            $("#logout").removeClass("d-none")
        } else {
            $("#username_error").html("Wrong account or password")
            $("#pass_error").html("Wrong account or password")
        }
    }

}
const logout = () => {
    localStorage.removeItem("account")
    $("#login").removeClass("d-none")
    $("#logout").addClass("d-none")
}
if (localStorage.getItem("account")) {
    const account = localStorage.getItem("account")
    $("#login").addClass("d-none")
    $("#logout").removeClass("d-none")
    console.log(account);
}

//Comments
const getComments = async() => {
    const urlProducts = url + 'Comments'
    const body = {
        method: 'get',
        url: urlProducts,
        responseType: 'json'
    }
    return await axiosAPI(body)
}
const showComments = async(id_product) => {
    const res = await getComments()
    const data = res.data
    const comments = data.filter(x => x.id_product == id_product)
    let innerComment = ""
    comments.forEach(e => {
        innerComment += `
        <div class="co-item">
            <div class="avatar-pic">
                <img src="img/product-single/avt.jpg" alt="">
            </div>
            <div class="avatar-text">
                <div class="at-rating">
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star-o"></i>
                </div>
                <h5>${e.name} <span>${e.datetime}</span></h5>
                <div class="at-reply">${e.content}</div>
            </div>
        </div>
        `
    });
    $("#comments").html(innerComment)
    $(".countComments").html(comments.length)
    $("#Name_GuestCmt").val("")
    $("#Content_GuestCmt").val("")
}
const addComment = async(nameGuest, cmtGuest, id_product) => {
    const urlProducts = url + 'Comments'
    const data = {
        name: nameGuest,
        content: cmtGuest,
        datetime: moment().format('lll'),
        id_product: id_product
    }
    const body = {
        method: 'post',
        url: urlProducts,
        responseType: 'json',
        data
    }
    await axiosAPI(body)
    await showComments(id_product)

}
changeQuantity()