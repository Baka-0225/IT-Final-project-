// ================= LOGIN =================

function login() {
    const role = document.getElementById("role").value;
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();
    const error = document.getElementById("error");

    if (!role || !user) {
        error.innerText = "Please fill all required fields.";
        return;
    }

    if (role === "student") {
        localStorage.setItem("student", user);
        window.location.href = "student.html";
    }

    if (role === "admin") {
        if (user === "amir" && pass === "12345") {
            window.location.href = "admin.html";
        } else {
            error.innerText = "Invalid admin credentials.";
        }
    }
}

// ================= STUDENT =================

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let total = 0;

function addItem(name, price) {
    if (cart.length >= 4) {
        alert("Maximum 4 items allowed.");
        return;
    }

    cart.push({ name, price });
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

function displayCart() {
    const list = document.getElementById("cart");
    if (!list) return;

    list.innerHTML = "";
    total = 0;

    cart.forEach(item => {
        const li = document.createElement("li");
        li.innerText = `${item.name} - ${item.price} Birr`;
        list.appendChild(li);
        total += item.price;
    });

    document.getElementById("total").innerText = total;
}

function checkout() {
    const code = document.getElementById("code").value.trim();
    const msg = document.getElementById("msg");

    if (cart.length === 0) {
        msg.innerText = "Cart is empty.";
        return;
    }

    if (code !== "abc123") {
        msg.innerText = "Verification failed.";
        return;
    }

    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(...cart);
    localStorage.setItem("orders", JSON.stringify(orders));

    const delivered = JSON.parse(localStorage.getItem("delivered")) || [];
    delivered.push(...cart);
    localStorage.setItem("delivered", JSON.stringify(delivered));

    sendEmail(cart, total);

    cart = [];
    localStorage.removeItem("cart");
    displayCart();

    msg.style.color = "green";
    msg.innerText = "Order placed successfully!";
}

// ================= EMAIL =================

function sendEmail(cart, total) {
    const student = localStorage.getItem("student");
    const items = cart.map(i => i.name).join(", ");

    emailjs.send("service_qvu1tru", "template_rvt0uhh", {
        user_name: student,
        items: items,
        total_price: total
    })
    .then(() => console.log("Email sent"))
    .catch(() => console.log("Email failed"));
}

// ================= ADMIN =================

function loadAdminData() {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const delivered = JSON.parse(localStorage.getItem("delivered")) || [];

    const orderList = document.getElementById("orders");
    const deliveredList = document.getElementById("delivered");

    orderList.innerHTML = "";
    deliveredList.innerHTML = "";

    orders.forEach(item => {
        const li = document.createElement("li");
        li.innerText = item.name;
        orderList.appendChild(li);
    });

    delivered.forEach(item => {
        const li = document.createElement("li");
        li.innerText = item.name;
        deliveredList.appendChild(li);
    });
}

displayCart();
