const productsDOM = document.querySelector('.todays-picks__nft-card')
const cartItems = document.querySelector('.cart-items-badge')
const cartTotal = document.querySelector('#total-price__price')

// Swiper
const swiper = new Swiper(".swiper", {
  slidesPerView: 3,
  spaceBetween: 30,
  slidesPerGroup: 1,
  loop: false,
  loopFillGroupWithBlank: true,

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

let cart = []

// Get product data from product.json
class Product {
  async getProduct() {
    try {
      const result = await fetch('products.json')
      const data = await result.json()
      
      let products = data.items

      // Extract data
      products = products.map((item) => {
        const { title, price, creator } = item.fields
        const { id } = item.sys
        const image = item.fields.image.fields.file.url
        const profile = item.fields.profile.fields.file.url
        return { title, price, creator, id, image, profile }
      })

      return products
    } catch(err) {
      console.log('Error')
    }
  }
}

// Present data in DOM
class View {
  // Show product data in DOM
  displayProducts(products) {
    let result = ''
    products.forEach((item) => {
      result += `
      <div class="nft-card">
      <div class="nft-card__image">
        <div class="image-box">
          <img src=${item.image} loading="lazy" alt=${item.title} title=${item.title}/>
          
          <button class="place-bid cart-btn btn-l-buy" data-id=${item.id}>
            <i class="fa-solid fa-bag-shopping"></i>

            <span class="place-bid__text">Add to cart</span>
          </button>
  
          <button class="likes" data-id=${item.id}>
            <i class="fa-solid fa-heart"></i>
            100
          </button>
        </div>
      </div>

      <h4>${item.title}</h4>

      <div class="nft-card__profile">
        <div class="profile__info">
          <a href="#" class="profile-image-box-s">
            <img src=${item.profile} loading="lazy" loading="lazy" alt="Profile Photo" title="Profile">
          </a>
          
          <div class="info">
            <span class="info__role">Creator</span>
            <a href="#" class="info__name">${item.creator}</a>
          </div>
        </div>

        <span class="badge-blue">BSC</span>
      </div>

      <hr/>

      <div class="last-container">
        <div class="nft-card__price">
          <span class="price-header">Current Bid</span>
          <div class="price">
            <span class="price__eth">${item.price} ETH</span>
            <span class="price__fiat">= $12.246</span>
          </div>
        </div>

        <span class="view-history">
          <i class="fa-solid fa-clock-rotate-left"></i>
          View History
        </span>
      </div>
    </div>
      `
    })

    productsDOM.innerHTML = result
  }

  // Add to cart buttons(Place bid)
  getCartButtons() {
    const buttons = [...document.querySelectorAll('.cart-btn')]

    buttons.forEach((item) => {
      let id = item.dataset.id

      item.addEventListener('click', (e) =>{
        let cartItem = { ...Storage.getProducts(id), amount: 1 }

        cart = [...cart, cartItem]
        console.log(cart)
        Storage.saveCart(cart)

        this.setCartVlues(cart)
      })
    })
  }

  // Set cart values
  setCartVlues(cart) {
    let totalPrice = 0
    let totalItems = 0

    cart.map((item) => {
      totalPrice = totalPrice + item.price * item.amount
      totalItems = totalItems + item.amount
    })

    cartTotal.innerHTML = totalPrice
    cartItems.innerHTML = totalItems

    console.log(cartTotal, cartItems)
  }
}

// Data storage management 
class Storage {
  // Save products in localStorage
  static saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products))
  }
  
  // Find product in localStorage
  static getProducts(id) {
    let products = JSON.parse(localStorage.getItem('products'))

    return products.find(item => item.id === id)
  }

  // Save cart data in localStorage
  static saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart))
  }
}

// Create object when document loaded
document.addEventListener('DOMContentLoaded', () => {
  const view = new View()
  const product = new Product()

  product.getProduct()
    .then(data => {
      view.displayProducts(data)
      Storage.saveProducts(data)
    })
    .then(() => {
      view.getCartButtons()
    })
})

// Dark-Light mode toggle
const themeToggle = () => {
  const element = document.body
  element.classList.toggle('light-theme')
}

// Search Box
const searchBox = document.querySelector('#search-box-container')
const searchInput = document.querySelector('#search-box')
const searchBtn = document.querySelector('#search-btn')

// Open/Close Search Box
searchBtn.addEventListener('click', () => {
  if (searchInput.style.visibility === 'hidden') {
    searchBox.style.visibility = 'visible'
    searchInput.style.visibility = 'visible'
    searchInput.style.transform = 'translateY(0%)'
  } else {
    searchBox.style.visibility = 'hidden'
    searchInput.style.visibility = 'hidden'
    searchInput.style.transform = 'translateY(-100%)'
  }
})

// Sopping Cart Menu
const overlay = document.querySelector('#overlay')
const cartMenu = document.querySelector('#cart-menu')
const cartBtnOpen = document.querySelector('#cart-btn-open')
const cartBtnClose = document.querySelector('#cart-btn-close')

// Open Button
cartBtnOpen.addEventListener('click', () => {
  overlay.style.visibility = 'visible';
  cartMenu.style.visibility = 'visible';
  cartMenu.style.transform = 'translateX(0%)';
})

// Close Button
cartBtnClose.addEventListener('click', () => {
  overlay.style.visibility = 'hidden';
  cartMenu.style.visibility = 'hidden';
  cartMenu.style.transform = 'translateX(100%)';
})

// Sign in Modal
const signInModal = document.querySelector('#signin-modal')
const signInModalCloseBtn = document.querySelector('#signin-modal__close-btn')
const signInModalBtn = document.querySelector('#signin-modal__btn')

// Sign in modal button
signInModalBtn.addEventListener('click', () => {
  signInModal.style.display = 'flex'
})

// Open modal with 3s delay
const openSignInModal = () => {
  setTimeout(() => {
    signInModal.style.display = 'flex'
  }, 3000)
}

openSignInModal()

// Modal Close button
signInModalCloseBtn.addEventListener('click', () => {
  signInModal.style.display = 'none'
})

// Select Option
var x, i, j, l, ll, selElmnt, a, b, c;
x = document.getElementsByClassName("custom-select");

l = x.length;
for (i = 0; i < l; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  ll = selElmnt.length;

  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);

  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < ll; j++) {
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function(e) { 
      var y, i, k, s, h, sl, yl;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        sl = s.length;
        h = this.parentNode.previousSibling;
        for (i = 0; i < sl; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            yl = y.length;
            for (k = 0; k < yl; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
    });
}

function closeAllSelect(elmnt) {
  var x, y, i, xl, yl, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}

document.addEventListener("click", closeAllSelect)

// Dropzone
let myDropzone = document.querySelector('#my-dropzone')

Dropzone.options.myDropzone = {
  // Configuration options go here
};

// create a Dropzone upload
myDropzone = new Dropzone("div#myId", { url: "/file/post"})

