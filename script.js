/* --- GLOBAL CONFIGURATION --- */
const CART_KEY = 'TREASURE_CART';
let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

/* --- 1. GENERAL UI LOGIC --- */

// Update Cart Count Icon (Visible on all pages)
function updateCartCount() {
    const countElement = document.getElementById('icon-cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (countElement) {
        countElement.innerText = totalItems;
    }
}

/* --- 2. SHOPPING LOGIC --- */

function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: parseFloat(price),
            image: image,
            quantity: 1
        });
    }

    saveAndRefresh();
    alert(`${name} has been added to your treasures!`);
}

function saveAndRefresh() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
    // Refresh table if on cart page
    if (document.getElementById('cart-items') || document.querySelector('.cart-table')) {
        displayCart();
    }
}

/* --- 3. CART PAGE LOGIC --- */

function displayCart() {
    const tableBody = document.getElementById('cart-items') || document.querySelector('.cart-table tbody');
    const totalElement = document.getElementById('cart-total') || document.querySelector('.total-amount');
    
    if (!tableBody) return; 

    tableBody.innerHTML = ''; 
    let total = 0;

    if (cart.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px;">Your cart is empty.</td></tr>';
    } else {
        cart.forEach((item, index) => {
            const subtotal = item.price * item.quantity;
            total += subtotal;

            tableBody.innerHTML += `
                <tr>
                    <td>
                        <div class="cart-product-detail">
                            <img src="${item.image}" alt="${item.name}">
                            <span>${item.name}</span>
                        </div>
                    </td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>
                        <input type="number" value="${item.quantity}" min="1" 
                               onchange="updateQuantity(${index}, this.value)" 
                               class="qty-input">
                    </td>
                    <td>$${subtotal.toFixed(2)}</td>
                    <td>
                        <button onclick="removeItem(${index})" style="color:red; background:none; border:none; cursor:pointer;">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    }

    if (totalElement) {
        totalElement.innerText = `$${total.toFixed(2)}`;
    }
}

function updateQuantity(index, newQty) {
    const qty = parseInt(newQty);
    if (qty > 0) {
        cart[index].quantity = qty;
        saveAndRefresh();
    }
}

function removeItem(index) {
    cart.splice(index, 1);
    saveAndRefresh();
}

/* --- 4. CHECKOUT LOGIC --- */

function displayCheckoutSummary() {
    const checkoutItemsContainer = document.getElementById('checkout-items-list');
    const checkoutTotalElement = document.getElementById('checkout-total');
    
    if (!checkoutItemsContainer) return; 

    checkoutItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        checkoutItemsContainer.innerHTML += `
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>${item.name} (x${item.quantity})</span>
                <span>$${itemTotal.toFixed(2)}</span>
            </div>
        `;
    });

    if (checkoutTotalElement) {
        checkoutTotalElement.innerText = `$${total.toFixed(2)}`;
    }
}

/* --- 5. INITIALIZATION & EVENT LISTENERS --- */

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // Auto-detect which page we are on
    if (document.getElementById('cart-items')) displayCart();
    if (document.getElementById('checkout-items-list')) displayCheckoutSummary();

    // Registration Logic
    const regForm = document.getElementById('registrationForm');
    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert(`Welcome! Your account has been created.`);
            window.location.href = "index1.html";
        });
    }

    // Checkout Form Submission
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (cart.length === 0) {
                alert("Your cart is empty!");
                return;
            }
            const name = document.getElementById('cust-name').value;
            alert(`Thank you, ${name}! Your order has been placed.`);
            localStorage.removeItem(CART_KEY); // Use the variable!
            window.location.href = 'index1.html';
        });
    }
});

// Listener for the "Proceed to Checkout" button on the Cart Page
document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('checkout-btn')) {
        // Use the 'cart' variable which is already loaded at the top
        if (cart.length === 0) {
            alert("Your treasures are missing! Add an item before checking out.");
        } else {
            window.location.href = 'checkout.html';
        }
    }
});