// Product data structure
const products = [
    {
      id: 1,
      name: "Downshifter Sports Shoes",
      price: 50.00,
      rating: 3.5,
      image: "images/product-11.jpg",
      category: "featured"
    },
    {
      id: 2,
      name: "Lace-Up Running Shoes",
      price: 35.00,
      rating: 4.5,
      image: "images/product-2.jpg",
      category: "featured"
    },
    {
      id: 3,
      name: "Lace Fastening Shoes",
      price: 15.00,
      rating: 4.0,
      image: "images/product-3.jpg",
      category: "featured"
    },
    {
      id: 4,
      name: "Flat Lace-Fastening Shoes",
      price: 48.00,
      rating: 3.0,
      image: "images/product-10.jpg",
      category: "featured"
    },
    {
      id: 5,
      name: "Flat Heel Gray Shoes",
      price: 50.00,
      rating: 3.5,
      image: "images/product-5.jpg",
      category: "latest"
    },
    {
      id: 6,
      name: "Lace-Fastening Black Shoes",
      price: 21.00,
      rating: 4.5,
      image: "images/product-3.jpg",
      category: "latest"
    },
    {
      id: 7,
      name: "HRX Men's Cotton Socks",
      price: 9.00,
      rating: 4.0,
      image: "images/product-7.jpg",
      category: "latest"
    },
    {
      id: 8,
      name: "Lace-Up Running Shoes",
      price: 35.00,
      rating: 3.0,
      image: "images/product-2.jpg",
      category: "latest"
    },
    {
      id: 9,
      name: "HRX Cotton Socks",
      price: 10.00,
      rating: 3.5,
      image: "images/product-7.jpg",
      category: "latest"
    },
    {
      id: 10,
      name: "Flat Lace-Fastening Shoes",
      price: 48.00,
      rating: 4.5,
      image: "images/product-10.jpg",
      category: "latest"
    },
    {
      id: 11,
      name: "Loafers Men (Gray)",
      price: 15.00,
      rating: 3.0,
      image: "images/product-11.jpg",
      category: "latest"
    },
    {
      id: 12,
      name: "Lace-Fastening White Shoes",
      price: 21.00,
      rating: 3.0,
      image: "images/product-12.jpg",
      category: "latest"
    }
  ];
  
  /**
   * Generates star rating HTML based on numeric rating
   * @param {number} rating - Product rating from 0-5
   * @return {string} HTML string with appropriate star icons
   */
  function generateStarRating(rating) {
    let starsHTML = '';
    
    // Full stars
    for (let i = 1; i <= Math.floor(rating); i++) {
      starsHTML += '<i class="fa fa-star" aria-hidden="true"></i>';
    }
    
    // Half star
    if (rating % 1 >= 0.5) {
      starsHTML += '<i class="fa fa-star-half-o" aria-hidden="true"></i>';
    }
    
    // Empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 1; i <= emptyStars; i++) {
      starsHTML += '<i class="fa fa-star-o" aria-hidden="true"></i>';
    }
    
    return starsHTML;
  }
  
  /**
   * Renders a product card with proper semantic HTML and accessibility features
   * @param {Object} product - Product object containing details
   * @return {string} HTML string for product card
   */
  function renderProductCard(product) {
    return `
      <article class="product-card col-4">
        <a href="products-details.html?id=${product.id}" class="product-link">
          <img src="${product.image}" alt="${product.name}" class="product-image">
          <h3 class="product-title">${product.name}</h3>
        </a>
        <div class="rating" aria-label="Product rated ${product.rating} out of 5 stars">
          ${generateStarRating(product.rating)}
        </div>
        <p class="product-price">$${product.price.toFixed(2)}</p>
        <button class="add-to-cart-btn" data-product-id="${product.id}" aria-label="Add ${product.name} to cart">
          Add to Cart
        </button>
      </article>
    `;
  }
  
  /**
   * Populates product section with filtered products
   * @param {string} category - Category to filter products by
   * @param {string} containerId - ID of container to populate
   * @param {number} limit - Maximum number of products to display
   */
  function displayProductsByCategory(category, containerId, limit = 4) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const filteredProducts = products
      .filter(product => product.category === category)
      .slice(0, limit);
    
    const rowElement = document.createElement('div');
    rowElement.className = 'row products-grid';
    
    filteredProducts.forEach(product => {
      rowElement.innerHTML += renderProductCard(product);
    });
    
    container.appendChild(rowElement);
  }
  
  /**
   * Initialize product displays on page load
   */
  document.addEventListener('DOMContentLoaded', function() {
    // Display featured products
    displayProductsByCategory('featured', 'featured-products-container');
    
    // Display latest products (up to 8 items in 2 rows)
    displayProductsByCategory('latest', 'latest-products-container', 8);
    
    // Add event listeners for "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const productId = this.getAttribute('data-product-id');
        addToCart(productId);
      });
    });
  });
  
  /**
   * Add product to cart (placeholder function)
   * @param {string} productId - ID of product to add to cart
   */
  function addToCart(productId) {
    // Get existing cart from localStorage or initialize empty array
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already exists in cart
    const existingProduct = cart.find(item => item.id === parseInt(productId));
    
    if (existingProduct) {
      // Increment quantity if product already in cart
      existingProduct.quantity += 1;
    } else {
      // Add new product to cart
      const product = products.find(p => p.id === parseInt(productId));
      if (product) {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        });
      }
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Optional: Show confirmation message
    const productName = products.find(p => p.id === parseInt(productId)).name;
    showNotification(`${productName} added to cart!`);
  }
  
  /**
   * Display notification to user (placeholder function)
   * @param {string} message - Message to display
   */
  function showNotification(message) {
    // Check if notification container exists, create if not
    let notificationContainer = document.querySelector('.notification-container');
    if (!notificationContainer) {
      notificationContainer = document.createElement('div');
      notificationContainer.className = 'notification-container';
      document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => {
        notification.remove();
      }, 500);
    }, 2500);
  }