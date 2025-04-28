/**
 * E-commerce Website JavaScript
 * 
 * This file contains all the JS functionality needed for the e-commerce site including:
 * - Menu toggle functionality
 * - Product loading and display from API
 * - Product details page functionality
 * - Cart management
 * - Login/Register form handling
 * - Checkout process
 */

// ===================================
// GLOBAL INITIALIZATION
// ===================================
window.onload = function() {
    // Initialize the menu items
    initializeMenu();
    
    // Initialize product display if on products page
    initializeProducts();
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart functionality if on cart page
    if (document.querySelector('.cart-page')) {
        loadCartItems();
    }
    
    // Update cart icon count on any page
    updateCartIcon();
    
    // Add event listener to checkout button if it exists
    const checkoutButton = document.getElementById('proceed-to-checkout');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', proceedToCheckout);
    }
    
    // Initialize product gallery if on product details page
    initializeProductGallery();
    
    // Initialize checkout functionality
    initializeCheckout();
});

// ===================================
// MENU FUNCTIONALITY
// ===================================

/**
 * Initialize the responsive menu
 */
function initializeMenu() {
    var MenuItems = document.getElementById("MenuItems");
    if (MenuItems) {
        MenuItems.style.maxHeight = "0px";
    }
}

/**
 * Toggle the responsive menu open/closed
 */
function menutoggle() {
    var MenuItems = document.getElementById("MenuItems");
    if (MenuItems) {
        if (MenuItems.style.maxHeight == "0px") {
            MenuItems.style.maxHeight = "200px";
        } else {
            MenuItems.style.maxHeight = "0px";
        }
    }
}

// Make menutoggle function available globally
window.menutoggle = menutoggle;

// ===================================
// PRODUCTS LISTING FUNCTIONALITY
// ===================================

/**
 * Initialize products display on the products page
 */
function initializeProducts() {
    const productContainer = document.getElementById("products");
    if (productContainer) {
        console.log(productContainer); // Debug log
        fetchAndDisplayProducts(productContainer);
    }
}

/**
 * Fetch products from API and display them
 * @param {HTMLElement} productContainer - The container element for products
 */
async function fetchAndDisplayProducts(productContainer) {
    const APIProducts = "https://fakestoreapi.com/products";
    
    try {
        // Fetch data from the API
        const response = await fetch(APIProducts);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data_products = await response.json();
        displayProductsList(data_products, productContainer);
        console.log(data_products); // Debug log
    } catch (error) {
        console.error("Error fetching data from API:", error);
    }
}

/**
 * Display products list in the product container
 * @param {Array} data_products - Array of product objects
 * @param {HTMLElement} productContainer - Container to display products
 */
function displayProductsList(data_products, productContainer) {
    console.log(productContainer); // Debug log
    if (!productContainer) {
        console.error("Element with ID 'products' not found.");
        return;
    }

    productContainer.innerHTML = "";

    data_products.forEach((product) => {
        const productDiv = document.createElement("div");
        productDiv.className = "col-4 product row";

        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.title}" width="100">
            <h4>${product.title}</h4>
            <p>$${product.price}</p>     
        `;

        // Add click event to redirect to product details
        productDiv.addEventListener("click", () => {
            window.location.href = `products-details.html?id=${product.id}`;
        });

        productContainer.appendChild(productDiv);
    });
}

// ===================================
// PRODUCT DETAILS FUNCTIONALITY
// ===================================

// Extract product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

// Initialize product details page if product ID exists in URL
if (productId) {
    fetchProductDetails();
}

/**
 * Fetch single product details from API
 */
async function fetchProductDetails() {
    // API endpoint with the product ID
    const apiURL = `https://fakestoreapi.com/products/${productId}`;
    
    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const product = await response.json();
        displayProductDetails(product);
        
        // After displaying the main product, fetch related products
        fetchRelatedProducts(product.category);
    } catch (error) {
        console.error("Failed to load product:", error);
        displayProductError();
    }
}

/**
 * Display error message when product cannot be loaded
 */
function displayProductError() {
    const titleEl = document.getElementById("productTitle");
    const descEl = document.getElementById("productDescription");
    
    if (titleEl) titleEl.textContent = "Product not found";
    if (descEl) descEl.textContent = "Sorry, we couldn't find the product you're looking for.";
}

/**
 * Display product details on the product page
 * @param {Object} product - Product data object
 */
function displayProductDetails(product) {
    // Set page title
    document.title = `${product.title} `;
    
    const productImg = document.getElementById("productImg");
    if (productImg) {
        // Set main image
        productImg.src = product.image;
        productImg.alt = product.title;

        // Update category, title, price and description
        const categoryEl = document.getElementById("productCategory");
        const titleEl = document.getElementById("productTitle");
        const priceEl = document.getElementById("productPrice");
        const descEl = document.getElementById("productDescription");
        
        if (categoryEl) categoryEl.textContent = `Home / ${product.category}`;
        if (titleEl) titleEl.textContent = product.title;
        if (priceEl) priceEl.textContent = `$${product.price}`;
        if (descEl) descEl.textContent = product.description;

        // Update all small images with the same product image
        const smallImgs = document.querySelectorAll(".small-img");
        smallImgs.forEach((img) => {
            img.src = product.image;
            img.alt = product.title;
        });
        
        // Update the Add to Cart button to include product info
        const addToCartBtn = document.getElementById("addToCartBtn");
        if (addToCartBtn) {
            addToCartBtn.addEventListener("click", function() {
                const quantity = document.getElementById("productQuantity").value;
                addToCart(product, parseInt(quantity));
            });
        }
        
        // Adjust the size dropdown based on product type
        adjustSizeOptions(product.category);
    }
}

/**
 * Adjust size dropdown options based on product category
 * @param {string} category - Product category
 */
function adjustSizeOptions(category) {
    const sizeSelect = document.getElementById("productSize");
    if (!sizeSelect) return;
    
    // Clear existing options
    sizeSelect.innerHTML = "";
    
    // Add default option
    const defaultOption = document.createElement("option");
    defaultOption.textContent = "Select Size";
    defaultOption.selected = true;
    sizeSelect.appendChild(defaultOption);
    
    // Add appropriate size options based on category
    if (category.toLowerCase().includes("clothing")) {
        // Clothing sizes
        const clothingSizes = ["XS", "S", "M", "L", "XL", "XXL"];
        clothingSizes.forEach(size => {
            const option = document.createElement("option");
            option.textContent = size;
            sizeSelect.appendChild(option);
        });
    } else if (category.toLowerCase().includes("shoe") || category.toLowerCase().includes("footwear")) {
        // Shoe sizes
        const shoeSizes = ["6", "7", "8", "9", "10", "11", "12"];
        shoeSizes.forEach(size => {
            const option = document.createElement("option");
            option.textContent = size;
            sizeSelect.appendChild(option);
        });
    } else {
        // Other products - might not need sizes
        sizeSelect.style.display = "none";
    }
}

/**
 * Fetch related products based on category
 * @param {string} category - Product category to match
 */
async function fetchRelatedProducts(category) {
    const allProductsURL = "https://fakestoreapi.com/products";
    
    try {
        const response = await fetch(allProductsURL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const allProducts = await response.json();
        
        // Filter related products by same category, excluding current product
        let relatedProducts = allProducts.filter(product => 
            product.category === category && product.id.toString() !== productId
        );
        
        // If no products in same category, just get random products
        if (relatedProducts.length < 4) {
            // Get products to fill up to 4 items
            const otherProducts = allProducts.filter(product => 
                product.id.toString() !== productId && product.category !== category
            );
            
            // Randomly select products to fill the remaining slots
            const neededProducts = 4 - relatedProducts.length;
            const randomProducts = otherProducts
                .sort(() => 0.5 - Math.random()) // Shuffle array
                .slice(0, neededProducts);
            
            relatedProducts = [...relatedProducts, ...randomProducts];
        } else {
            // If we have more than 4 related products, just take the first 4
            relatedProducts = relatedProducts.slice(0, 4);
        }
        
        displayRelatedProducts(relatedProducts);
    } catch (error) {
        console.error("Failed to load related products:", error);
    }
}

/**
 * Display related products on the product details page
 * @param {Array} relatedProducts - Array of related product objects
 */
function displayRelatedProducts(relatedProducts) {
    const relatedProductsContainer = document.getElementById("relatedProducts");
    if (!relatedProductsContainer) return;
    
    relatedProductsContainer.innerHTML = "";
    
    relatedProducts.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.className = "col-4";
        
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h4>${product.title}</h4>
            <div class="rating">
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star-half-o"></i>
                <i class="fa fa-star-o"></i>
            </div>
            <p>$${product.price}</p>
        `;
        
        // Add click event to navigate to the product details
        productDiv.addEventListener("click", () => {
            window.location.href = `products-details.html?id=${product.id}`;
        });
        
        relatedProductsContainer.appendChild(productDiv);
    });
}

/**
 * Initialize product gallery functionality
 */
function initializeProductGallery() {
    var productImg = document.getElementById("productImg");
    var smallImg = document.getElementsByClassName("small-img");
    
    if (productImg && smallImg.length > 0) {
        for (let i = 0; i < smallImg.length; i++) {
            smallImg[i].onclick = function() {
                productImg.src = smallImg[i].src;
            }
        }
    }
}

// ===================================
// CART FUNCTIONALITY
// ===================================

/**
 * Add product to cart
 * @param {Object} product - Product to add
 * @param {number} quantity - Quantity to add
 */
function addToCart(product, quantity) {
    // Get existing cart from localStorage or initialize empty array
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
        // Update quantity if product already in cart
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Add new item to cart
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    // Save updated cart back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Update cart icon count
    updateCartIcon();
    
    // Show confirmation to user
    alert(`Added ${quantity} ${product.title} to cart!`);
}

/**
 * Load and display cart items on the cart page
 */
function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartTableBody = document.querySelector('.cart-page table tbody');
    
    if (!cartTableBody) return;
    
    // Clear existing rows except header
    while (cartTableBody.children.length > 1) {
        cartTableBody.removeChild(cartTableBody.lastChild);
    }
    
    if (cart.length === 0) {
        // If cart is empty, display message
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="3" style="text-align: center; padding: 20px;">
                Your cart is empty. <a href="products.html">Continue shopping</a>
            </td>
        `;
        cartTableBody.appendChild(emptyRow);
        
        // Update totals
        updateCartTotals(0, 0, 0);
        return;
    }
    
    // Add each item to the cart table
    let subtotal = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const row = document.createElement('tr');
        row.className = 'cart-item';
        row.dataset.id = item.id;
        row.dataset.name = item.title;
        row.dataset.price = item.price;
        row.dataset.image = item.image;
        
        row.innerHTML = `
            <td>
                <div class="cart-info">
                    <img src="${item.image}" alt="${item.title}">
                    <div>
                        <p>${item.title}</p>
                        <small>Price: $${item.price.toFixed(2)}</small><br>
                        <a href="#" class="remove-item" data-index="${index}">Remove</a>
                    </div>
                </div>
            </td>
            <td>
                <input type="number" value="${item.quantity}" min="1" class="item-quantity" data-index="${index}">
            </td>
            <td class="item-subtotal">$${itemTotal.toFixed(2)}</td>
        `;
        
        cartTableBody.appendChild(row);
    });
    
    // Add event listeners for quantity changes and remove buttons
    addCartEventListeners();
    
    // Calculate and update totals
    const tax = subtotal * 0.175; // 17.5% tax rate
    const total = subtotal + tax;
    updateCartTotals(subtotal, tax, total);
}

/**
 * Add event listeners to cart item elements
 */
function addCartEventListeners() {
    // Add event listeners to quantity inputs
    const quantityInputs = document.querySelectorAll('.item-quantity');
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            updateItemQuantity(this.dataset.index, parseInt(this.value));
        });
    });
    
    // Add event listeners to remove buttons
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            removeCartItem(this.dataset.index);
        });
    });
}

/**
 * Update cart item quantity
 * @param {number} index - Index of the item in cart array
 * @param {number} newQuantity - New quantity value
 */
function updateItemQuantity(index, newQuantity) {
    if (newQuantity < 1) newQuantity = 1;
    
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    if (index >= 0 && index < cart.length) {
        cart[index].quantity = newQuantity;
        localStorage.setItem("cart", JSON.stringify(cart));
        
        // Reload cart to reflect changes
        loadCartItems();
        // Update cart icon
        updateCartIcon();
    }
}

/**
 * Remove item from cart
 * @param {number} index - Index of the item in cart array
 */
function removeCartItem(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        
        // Reload cart to reflect changes
        loadCartItems();
        // Update cart icon
        updateCartIcon();
    }
}

/**
 * Update cart totals displayed on cart page
 * @param {number} subtotal - Cart subtotal
 * @param {number} tax - Tax amount
 * @param {number} total - Total amount
 */
function updateCartTotals(subtotal, tax, total) {
    const subtotalElement = document.querySelector('.total-price table tr:nth-child(1) td:nth-child(2)');
    const taxElement = document.querySelector('.total-price table tr:nth-child(2) td:nth-child(2)');
    const totalElement = document.querySelector('.total-price table tr:nth-child(3) td:nth-child(2)');
    
    if (subtotalElement) {
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        subtotalElement.id = 'cart-subtotal';
    }
    if (taxElement) {
        taxElement.textContent = `$${tax.toFixed(2)}`;
        taxElement.id = 'cart-tax';
    }
    if (totalElement) {
        totalElement.textContent = `$${total.toFixed(2)}`;
        totalElement.id = 'cart-total';
    }
}

/**
 * Update cart icon with number of items
 */
function updateCartIcon() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Check if we have a cart icon badge, if not create one
    let cartIcon = document.querySelector('a[href="cart.html"] img');
    let cartBadge = document.querySelector('.cart-badge');
    
    if (cartIcon && !cartBadge) {
        // Create a badge element
        const badge = document.createElement('span');
        badge.className = 'cart-badge';
        badge.style.position = 'absolute';
        badge.style.top = '0';
        badge.style.right = '0';
        badge.style.backgroundColor = 'red';
        badge.style.color = 'white';
        badge.style.borderRadius = '50%';
        badge.style.padding = '2px 6px';
        badge.style.fontSize = '12px';
        
        // Make cart icon container relative for absolute positioning of badge
        cartIcon.parentElement.style.position = 'relative';
        cartIcon.parentElement.appendChild(badge);
        cartBadge = badge;
    }
    
    // Update the badge count
    if (cartBadge) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

// ===================================
// CHECKOUT FUNCTIONALITY
// ===================================

/**
 * Proceed to checkout
 */
function proceedToCheckout() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    if (cart.length === 0) {
        alert("Your cart is empty. Please add items before proceeding to checkout.");
        return;
    }
    
    // Calculate totals
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    const tax = subtotal * 0.175; // 17.5% tax rate
    const total = subtotal + tax;
    
    // Store cart data in sessionStorage for checkout page
    sessionStorage.setItem('cartItems', JSON.stringify(cart));
    sessionStorage.setItem('cartSubtotal', `$${subtotal.toFixed(2)}`);
    sessionStorage.setItem('cartTax', `$${tax.toFixed(2)}`);
    sessionStorage.setItem('cartTotal', `$${total.toFixed(2)}`);
    
    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

/**
 * Initialize checkout functionality
 */
function initializeCheckout() {
    const placeOrderBtn = document.getElementById('place-order');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', function() {
            const inputs = document.querySelectorAll('#checkout input, #checkout select');
            const customerData = {};
            
            // Collect all form inputs
            inputs.forEach(input => {
                if (input.name || input.placeholder) {
                    const key = input.name || input.placeholder.replace(/\s+/g, '_').toLowerCase();
                    customerData[key] = input.value;
                }
            });
            
            // Save customer info to localStorage
            localStorage.setItem('customerInfo', JSON.stringify(customerData));
            
            // Show confirmation
            alert('Thank you! Your order has been placed.');
        });
    }
}

// ===================================
// LOGIN AND REGISTRATION FORM
// ===================================

/**
 * Switch to registration form
 */
function register() {
    var LoginForm = document.getElementById("LoginForm");
    var RegForm = document.getElementById("RegForm");
    var Indicator = document.getElementById("Indicator");
    
    if (RegForm && LoginForm && Indicator) {
        RegForm.style.transform = "translateX(0px)";
        LoginForm.style.transform = "translateX(0px)";
        Indicator.style.transform = "translateX(100px)";
    }
}

/**
 * Switch to login form
 */
function login() {
    var LoginForm = document.getElementById("LoginForm");
    var RegForm = document.getElementById("RegForm");
    var Indicator = document.getElementById("Indicator");
    
    if (RegForm && LoginForm && Indicator) {
        RegForm.style.transform = "translateX(300px)";
        LoginForm.style.transform = "translateX(300px)";
        Indicator.style.transform = "translateX(0px)";
    }
}

// Make these functions globally accessible
window.register = register;
window.login = login;