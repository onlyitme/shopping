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
const getProducts = async() => {
    const urlProducts = url + 'Products'
    const body = {
        method: 'get',
        url: urlProducts,
        responseType: 'json'
    }
    const res = await axiosAPI(body)
    showDataTable(res.data)
}
const showDataTable = (data) => {
    let tr
    data.map((x, i) => {
        tr += `<tr>
                    <td>${i}</td>
                    <td class="name-product">${x.name}</td>
                    <td>${x.id_category}</td>
                    <td class="text-primary">
                        <p class="text-muted"><s>$${x.price}</s></p>
                        <p>$${x.reduced_price}</p>
                    </td>
                    <td>${x.views}</td>
                    <td>${x.solds}</td>
                    <td>${x.inventory}</td>
                    <td>
                        <button class="btn btn-success btn-fab btn-fab-mini btn-round btn-img-product" data-toggle="modal" data-target="#img-product">
                            <i class="material-icons">image</i>
                            <img src="../../uploads/products/${x.image}" alt="" class="d-none">
                        </button>
                        <button onclick="window.location.href='./edit-product.html?id=${x.id}'" class="btn btn-info btn-fab btn-fab-mini btn-round ">
                            <i class="material-icons">edit</i>
                        </button>
                        <button onclick="showSwal('warning-message-and-confirmation',removeProduct,${x.id})" class="btn btn-danger btn-fab btn-fab-mini btn-round">
                            <i class="material-icons">delete</i>
                        </button>
                    </td>
                </tr>`
    })
    $("#tbodyTable").html(tr)
}

// Edit Page
const getProductById = async(id) => {
    const urlProducts = url + 'Products/' + id
    const body = {
        method: 'get',
        url: urlProducts,
        responseType: 'json'
    }
    return await axiosAPI(body)
}

const loadPageEdit = async(id) => {
    const res = await getProductById(id)
    if (res.status) {
        const product = res.data
        const categories = await getCategories()
        let selectHtml = `<select id="categories" class="selectpicker" data-size="7" data-style="btn btn-primary btn-round" title="Single Select">
                            <option disabled >Select Category </option>`
        categories.data.forEach(x => {
            if (product.id_category == x.id) selectHtml += ` <option value="${x.id}" selected>${x.name}</option>`
            else selectHtml += ` <option value="${x.id}">${x.name}</option>`
        });
        selectHtml += "</select>"
            // console.log(selectHtml);
        $("#add-select").html(selectHtml), $("#categories").selectpicker()
        $("#name_product").val(product.name).parent().addClass("is-filled")
        $("#quantity_product").val(product.inventory).parent().addClass("is-filled")
        $("#price_product").val(product.price).parent().addClass("is-filled")
        $("#sale-price_product").val(product.reduced_price).parent().addClass("is-filled")
        $("#old-img").attr("src", "../../uploads/products/" + product.image)
        if (product.describe) $("#dicribed-product").val(product.describe), $("#dicribed-product").parent().addClass("is-filled")
    }
}
const checkForm = async() => {
    const price_regex = /^\d+$/
    let price_product = $("#price_product").val().trim()
    let sale_price = $("#sale-price_product").val().trim()
    let quantity = $("#quantity_product").val().trim()
    if (!$("#name_product").val() || !price_product || !sale_price || !quantity || !$("#categories").val()) {
        alert("Please check the required fields")
    } else if (price_regex.test(price_product) && price_regex.test(price_product) && price_regex.test(quantity)) {
        if (window.id) await editProduct(id)
        else await addProduct()
    } else alert("Error Input Number")
}
const editProduct = async(id) => {
    const data = {
        "name": $("#name_product").val(),
        "price": $("#price_product").val(),
        "reduced_price": $("#sale-price_product").val(),
        "image": "",
        "variants": [{
                "grams": 200
            },
            {
                "weight": 0.2
            },
            {
                "weight_unit": "kg"
            },
            {
                "color": "pink"
            },
            {
                "size": [
                    "S",
                    "M",
                    "L",
                    "XL"
                ]
            }
        ],
        "describe": $("#dicribed-product").val(),
        "views": 123,
        "inventory": $("#quantity_product").val(),
        "solds": 123,
        "created_at": "1234567890",
        "edited_at": "",
        "show": true,
        "hot": false,
        "tags": "",
        "id_category": $("#categories").val()
    }
    const urlProducts = url + 'Products/' + id
    const body = {
        method: 'put',
        url: urlProducts,
        responseType: 'json',
        data
    }
    const res = await axiosAPI(body)
    res.then(window.location.href = "./products.html")
}

// Add Product
const loadPageAdd = async() => {
    const categories = await getCategories()
    let selectHtml = `<select id="categories" class="selectpicker" data-size="7" data-style="btn btn-primary btn-round" title="Single Select">
                        <option selected disabled >Select Category <span class="text-danger">*</span></option>`
    categories.data.forEach(x => {
        selectHtml += ` <option value="${x.id}">${x.name}</option>`
    });
    selectHtml += "</select>"
    $("#add-select").html(selectHtml), $("#categories").selectpicker()

}
const addProduct = async() => {
    const data = {
        "name": $("#name_product").val(),
        "price": $("#price_product").val(),
        "reduced_price": $("#sale-price_product").val(),
        "image": "",
        "variants": [{
                "grams": 200
            },
            {
                "weight": 0.2
            },
            {
                "weight_unit": "kg"
            },
            {
                "color": "pink"
            },
            {
                "size": [
                    "S",
                    "M",
                    "L",
                    "XL"
                ]
            }
        ],
        "describe": $("#dicribed-product").val(),
        "views": 123,
        "inventory": $("#quantity_product").val(),
        "solds": 123,
        "created_at": "1234567890",
        "edited_at": "",
        "show": true,
        "hot": false,
        "tags": "",
        "id_category": $("#categories").val()
    }
    const urlProducts = url + 'Products'
    const body = {
        method: 'post',
        url: urlProducts,
        responseType: 'json',
        data
    }
    const res = await axiosAPI(body)
    await showSwal("success-addproduct")
}

// Delete product
const removeProduct = async(id) => {
    const urlProducts = url + 'Products/' + id
    const body = {
        method: 'delete',
        url: urlProducts,
        responseType: 'json',
    }
    const res = await axiosAPI(body)
    getProducts()
}


///GET ORDER 
const getOrdersDetails = async() => {
    const urlProducts = url + 'Orders_details'
    const body = {
        method: 'get',
        url: urlProducts,
        responseType: 'json'
    }
    return await axiosAPI(body)
}
const getOrders = async() => {
    const urlProducts = url + 'Orders'
    const body = {
        method: 'get',
        url: urlProducts,
        responseType: 'json'
    }
    const res = await axiosAPI(body)
    const res_detail = await getOrdersDetails()
    showOrdersTable(res.data, res_detail.data)
}

const showOrdersTable = (orders, orders_details) => {

    // const res = await getProductById(id)
    let tr
    orders.forEach((x, i) => {
        let color_status = ""
        if (x.status == "open") color_status = "text-warning"
        else if (x.status == "confirmed") color_status = "text-info"
        else if (x.status == "conpleted") color_status = "text-success"
        else color_status = "text-muted"
        const products = orders_details.filter(y => y.order_id == x.id)
        console.log(products);
        const quantity_products = products.length
        let price = 0
        products.forEach(element => {
            price += element.unit_price * element.quantity
        });
        console.log(products);
        tr += `<tr>
                    <td>${i+1}</td>
                    <td class="name-product">${x.name}</td>
                    <td>${x.phone}</td>
                    <td>${x.street}</td>
                    <td class="text-center">${quantity_products}</td>
                    <td>$${price}.00</td>
                    <td>${x.created_at}</td>
                    <td class="${color_status}">${x.status}</td>
                    
                </tr>`
    })
    $("#tbodyTable").html(tr)
}


//showCategoriesTable
const showCategoriesTable = async() => {
    const res = await getCategories()
    const categories = res.data
        // console.log(categories);
    let tr = ""
    categories.map((x, i) => {
        tr += `<tr>
                    <td>${i}</td>
                    <td class="name-product">${x.name}</td>
                    
                    <td>
                        <button class="btn btn-info btn-fab btn-fab-mini btn-round" onclick="getCategory(${x.id})" data-toggle="modal" data-target="#ModalCategories">
                            <i class="material-icons">edit</i>
                        </button>
                        
                        <button onclick="showSwal('warning-message-and-confirmation',removeCategory,${x.id})" class="btn btn-danger btn-fab btn-fab-mini btn-round">
                            <i class="material-icons">delete</i>
                        </button>
                    </td>
                </tr>`
    })
    $("#tbodyTable").html(tr)
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
const getCategory = async(id) => {
    const res = await getCategoryById(id)
        // console.log(res);
    const category = res.data
    $("#ModalCategories_body").html(` <div class="form-group mt-5">
    <label class="bmd-label-floating">Name category <span class="text-danger" >* <i id="error_ctg"></i></span></label>
    <input type="text" class="form-control" id="name_edit_category" value="${category.name}">
</div>
<button class="btn btn-block btn-info mt-3" onclick="editCategory(${category.id}) " data-dismiss="modal">Save Category</button>`)
}
const editCategory = async(id) => {
    const data = {
        name: $("#name_edit_category").val()
    }
    const urlProducts = url + 'Categories/' + id
    const body = {
        method: 'put',
        url: urlProducts,
        responseType: 'json',
        data
    }
    const res = await axiosAPI(body)
    await showCategoriesTable()
}
const addCategory = async() => {
    const res = await getCategories()
    const list_res = res.data
    const list_name = list_res.map(x => x.name)
        // console.log(list_name);
    const name = $("#name_category").val().trim()
    if (!name) $("#error_ctg").html("Don't leave it blank")
    else if (list_name.includes(name)) $("#error_ctg").html("This name already exists")
    else {
        $("#error_ctg").html("")
        const urlProducts = url + 'Categories'
        const data = { "name": name }
        const body = {
            method: 'post',
            url: urlProducts,
            responseType: 'json',
            data
        }
        const res = await axiosAPI(body)
        showSwal("success-message")
        showCategoriesTable()
    }
}

const removeCategory = async(id) => {
    const urlProducts = url + 'Categories/' + id
    const body = {
        method: 'delete',
        url: urlProducts,
        responseType: 'json',
    }
    const res = await axiosAPI(body)
    showCategoriesTable()
}
const showSwal = (type, method, id) => {
    if (type == 'warning-message-and-confirmation') {
        swal({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            confirmButtonText: 'Yes, delete it!',
            buttonsStyling: false
        }).then(result => {
            if (result.value) {
                swal({
                    title: 'Deleted!',
                    text: 'Your imaginary file has been deleted.',
                    type: 'success',
                    confirmButtonClass: "btn btn-success",
                    buttonsStyling: false
                }).catch(swal.noop)
                method(id)
            } else {
                swal({
                    title: 'Cancelled',
                    text: 'Your imaginary file is safe :)',
                    type: 'error',
                    confirmButtonClass: "btn btn-info",
                    buttonsStyling: false
                }).catch(swal.noop)
            }

        })
    } else if (type == 'success-message') {
        swal({
            title: "Good job!",
            text: "You clicked the button!",
            buttonsStyling: false,
            confirmButtonClass: "btn btn-success",
            type: "success"
        }).catch(swal.noop)
    } else if (type == 'success-addproduct') {
        swal({
            title: "Good job!",
            text: "You clicked the button!",
            buttonsStyling: false,
            confirmButtonClass: "btn btn-success",
            type: "success"
        }).then(result1 => {
            if (result1.value) window.location.href = "./products.html"
        })
    }
}
const chartGG = async() => {
    const urlProducts = url + 'Orders'
    const body = {
        method: 'get',
        url: urlProducts,
        responseType: 'json'
    }
    const res = await axiosAPI(body)
    const orders = res.data
    let dataChart = []
    let monthChart = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    monthChart.forEach(element => {
        let a = orders.filter(x => x.created_at.match(element))
        dataChart.push(a.length)
    });
    console.log(dataChart);
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: monthChart,
            datasets: [{
                label: 'Orders in month',
                data: dataChart,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}