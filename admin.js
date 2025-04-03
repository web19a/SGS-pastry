// Admin Authentication System
function checkAdminAuth() {
    if (sessionStorage.getItem('adminLoggedIn')) {
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        renderAdminProducts();
        renderAdminFeedbacks();
        renderAdminOrders();
    }
}

// Login Handling
document.getElementById('adminLoginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (!localStorage.getItem('admin')) {
        localStorage.setItem('admin', JSON.stringify({
            username: 'admin',
            password: 'admin123'
        }));
    }
    
    const storedAdmin = JSON.parse(localStorage.getItem('admin'));

    if (username === storedAdmin.username && password === storedAdmin.password) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        checkAdminAuth();
        showNotification('Admin login successful!');
    } else {
        showNotification('Invalid admin credentials', true);
    }
});

// Logout Function
function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    window.location.reload();
}

// Product Management
document.getElementById('addProductForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const [name, desc, price, image] = e.target.elements;
    
    if (!name.value.trim() || !price.value || !image.value.trim()) {
        showNotification('Please fill all required fields!', true);
        return;
    }

    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.push({
        id: Date.now().toString(),
        name: name.value.trim(),
        description: desc.value.trim(),
        price: parseFloat(price.value),
        image: image.value.trim()
    });
    
    localStorage.setItem('products', JSON.stringify(products));
    e.target.reset();
    renderAdminProducts();
    showNotification('Product added successfully!');
});

function deleteProduct(productId) {
    const products = JSON.parse(localStorage.getItem('products'))
                    .filter(p => p.id !== productId);
    localStorage.setItem('products', JSON.stringify(products));
    renderAdminProducts();
    showNotification('Product deleted successfully!');
}

function renderAdminProducts() {
    const adminProductsGrid = document.getElementById('adminProductsGrid');
    adminProductsGrid.innerHTML = '';
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product-card';
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>$${product.price.toFixed(2)}</p>
            <button onclick="deleteProduct('${product.id}')">Delete</button>
        `;
        adminProductsGrid.appendChild(productDiv);
    });
}

// Order Management
function completeOrder(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders'));
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex > -1) {
        orders[orderIndex].status = 'Completed';
        orders[orderIndex].completedDate = new Date().toLocaleString();
        localStorage.setItem('orders', JSON.stringify(orders));
        renderAdminOrders();
        showNotification('Order marked as completed!');
    }
}

function renderAdminOrders() {
    const adminOrdersList = document.getElementById('adminOrdersList');
    const completedOrdersList = document.getElementById('completedOrdersList');
    
    adminOrdersList.innerHTML = '';
    completedOrdersList.innerHTML = '';
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const activeOrders = orders.filter(o => o.status !== 'Completed');
    const completedOrders = orders.filter(o => o.status === 'Completed');

    // Active Orders
    activeOrders.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'order-card';
        orderDiv.innerHTML = `
            <div class="order-header">
                <h3>${order.productName} (x${order.quantity})</h3>
                <span class="order-status ${order.status.toLowerCase()}">${order.status}</span>
            </div>
            <div class="order-details">
                <p><strong>Customer:</strong> ${order.fullName}</p>
                <p><strong>Email:</strong> ${order.email}</p>
                <p><strong>Order Date:</strong> ${order.date}</p>
            </div>
            <button class="complete-btn" onclick="completeOrder('${order.id}')">
                Mark Complete
            </button>
        `;
        adminOrdersList.appendChild(orderDiv);
    });

    // Completed Orders
    completedOrders.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'order-card completed';
        orderDiv.innerHTML = `
            <div class="order-header">
                <h3>${order.productName} (x${order.quantity})</h3>
                <span class="order-status completed">Completed</span>
            </div>
            <div class="order-details">
                <p><strong>Customer:</strong> ${order.fullName}</p>
                <p><strong>Email:</strong> ${order.email}</p>
                <p><strong>Order Date:</strong> ${order.date}</p>
                <p><strong>Completed Date:</strong> ${order.completedDate}</p>
            </div>
        `;
        completedOrdersList.appendChild(orderDiv);
    });

    if (activeOrders.length === 0) {
        adminOrdersList.innerHTML = `
            <div class="empty-state">
                <h3>No Active Orders</h3>
                <p>All orders are completed!</p>
            </div>
        `;
    }
}

// Feedback Management
function renderAdminFeedbacks() {
    const adminFeedbacksList = document.getElementById('adminFeedbacksList');
    adminFeedbacksList.innerHTML = '';
    const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    
    feedbacks.forEach(feedback => {
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'product-card';
        feedbackDiv.innerHTML = `
            <h4>${feedback.fullName}</h4>
            <p>${feedback.email}</p>
            <p class="feedback-text">${feedback.text}</p>
            <small class="feedback-date">${feedback.date}</small>
        `;
        adminFeedbacksList.appendChild(feedbackDiv);
    });
}

// Section Handling
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
    
    switch(sectionId) {
        case 'viewFeedbacks': renderAdminFeedbacks(); break;
        case 'viewOrders': renderAdminOrders(); break;
        case 'manageProducts': renderAdminProducts(); break;
    }
}

// Notification System
function showNotification(message, isError = false) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.backgroundColor = isError ? '#ff4444' : '#ff7f50';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    checkAdminAuth();
    if (!localStorage.getItem('admin')) {
        localStorage.setItem('admin', JSON.stringify({
            username: 'admin',
            password: 'admin123'
        }));
    }
    if (document.getElementById('adminProductsGrid')) renderAdminProducts();
});