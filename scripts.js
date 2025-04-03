// Initialize Databases
function initializeDatabases() {
    if (!localStorage.getItem('products')) {
        const sampleProducts = [
            {
                id: '1',
                name: 'Croissant',
                description: 'Classic French buttery croissant',
                price: 3.99,
                image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
            },
            {
                id: '2',
                name: 'Chocolate Éclair',
                description: 'Choux pastry filled with vanilla cream and chocolate glaze',
                price: 4.50,
                image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
            },
            {
                id: '3',
                name: 'Macarons Box',
                description: 'Assorted French macarons (6 pieces)',
                price: 12.99,
                image: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80'
            }
        ];
        localStorage.setItem('products', JSON.stringify(sampleProducts));
    }
    
    if (!localStorage.getItem('orders')) localStorage.setItem('orders', JSON.stringify([]));
    if (!localStorage.getItem('feedbacks')) localStorage.setItem('feedbacks', JSON.stringify([]));
}

// Notification System
function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.backgroundColor = isError ? '#ff4444' : '#ff7f50';
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 2000);
}

// Welcome Section Handling
function hideWelcome() {
    const welcomeSection = document.getElementById('welcomeSection');
    welcomeSection.style.opacity = '0';
    setTimeout(() => {
        welcomeSection.classList.remove('active');
    }, 500);
}

// Section Navigation
function showSection(sectionId) {
    hideWelcome();
    
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if(link.getAttribute('onclick')?.includes(sectionId)) {
            link.classList.add('active');
        }
    });

    switch(sectionId) {
        case 'products': renderProducts(); break;
        case 'orders': renderOrders(); break;
        case 'feedbacks': renderFeedbacks(); break;
    }
}

// Product Rendering
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    const products = JSON.parse(localStorage.getItem('products'));
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>$${product.price.toFixed(2)}</p>
            <button onclick="orderProduct('${product.id}')">Order Now</button>
        `;
        productsGrid.appendChild(card);
    });
}

// Order Handling
let currentProductId = null;

function orderProduct(productId) {
    currentProductId = productId;
    document.getElementById('orderModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('orderModal').style.display = 'none';
}

document.getElementById('orderForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const product = JSON.parse(localStorage.getItem('products'))
        .find(p => p.id === currentProductId);

    const order = {
        id: Date.now().toString(),
        productId: currentProductId,
        productName: product.name,
        quantity: parseInt(formData.get('quantity')),
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        date: new Date().toLocaleString(),
        status: 'Pending'
    };

    const orders = JSON.parse(localStorage.getItem('orders'));
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    closeModal();
    renderOrders();
    showNotification(`Order placed for ${order.quantity}x ${product.name}!`);
});

// Order Rendering (User View - Only shows pending orders)
function renderOrders() {
    const ordersList = document.getElementById('ordersList');
    ordersList.innerHTML = '';
    const orders = JSON.parse(localStorage.getItem('orders'))
        .filter(order => order.status !== 'Completed');
    
    if (orders.length === 0) {
        ordersList.innerHTML = `
            <div class="empty-state">
                <h3>No Active Orders</h3>
                <p>All your orders have been completed!</p>
            </div>
        `;
        return;
    }

    orders.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'product-card';
        orderDiv.innerHTML = `
            <h3>${order.productName} (x${order.quantity})</h3>
            <p>Order Date: ${order.date}</p>
            <p>Status: <span class="status">${order.status}</span></p>
            <p>Customer: ${order.fullName}</p>
            <p>Email: ${order.email}</p>
        `;
        ordersList.appendChild(orderDiv);
    });
}

// Feedback Handling
document.getElementById('feedbackForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const feedbackText = formData.get('feedback').trim();
    const fullName = formData.get('fullName').trim();
    const email = formData.get('email').trim();

    if (!feedbackText || !fullName || !email) {
        showNotification('Please fill all required fields!', true);
        return;
    }

    const feedbacks = JSON.parse(localStorage.getItem('feedbacks'));
    feedbacks.push({
        id: Date.now().toString(),
        fullName,
        email,
        text: feedbackText,
        date: new Date().toLocaleString()
    });
    
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    e.target.reset();
    renderFeedbacks();
    showNotification('Thank you for your feedback!');
});

function renderFeedbacks() {
    const feedbacksList = document.getElementById('feedbacksList');
    feedbacksList.innerHTML = '';
    const feedbacks = JSON.parse(localStorage.getItem('feedbacks'));
    
    feedbacks.forEach(feedback => {
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'product-card';
        feedbackDiv.innerHTML = `
            <h4>${feedback.fullName}</h4>
            <p>${feedback.email}</p>
            <p class="feedback-text">${feedback.text}</p>
            <small class="feedback-date">${feedback.date}</small>
        `;
        feedbacksList.appendChild(feedbackDiv);
    });
}

// About Section
function renderAbout() {
    const aboutContent = document.getElementById('aboutContent');
    aboutContent.innerHTML = `
        <div class="about-section">
            <h2>About SGS Pastry</h2>
            <div class="about-grid">
                <div class="about-card">
                    <h3>🍰 Our Story</h3>
                    <p>Founded in 2023, SGS Pastry brings authentic French baking techniques to modern patisserie.</p>
                </div>
                <div class="about-card">
                    <h3>👩🍳 Our Team</h3>
                    <div class="team-members">
                        <div class="member">
                            <img src="https://randomuser.me/api/portraits/women/25.jpg" alt="Chef Marie">
                            <p>Chef Marie</p>
                        </div>
                        <div class="member">
                            <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="Baker Pierre">
                            <p>Baker Pierre</p>
                        </div>
                    </div>
                </div>
                <div class="about-card">
                    <h3>📍 Visit Us</h3>
                    <p>123 Pastry Street<br>Paris, France<br>Open daily 8AM - 8PM</p>
                </div>
            </div>
        </div>
    `;
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeDatabases();
    renderProducts();
    renderOrders();
    renderFeedbacks();
    renderAbout();
    
    if(!sessionStorage.getItem('welcomeShown')) {
        document.getElementById('welcomeSection').classList.add('active');
        sessionStorage.setItem('welcomeShown', 'true');
    }
});