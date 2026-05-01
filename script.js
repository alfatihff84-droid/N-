// Default akun admin: username=admin, PIN=123456
if(!localStorage.getItem('adminUser')) localStorage.setItem('adminUser', 'admin');
if(!localStorage.getItem('adminPin')) localStorage.setItem('adminPin', '123456');
if(!localStorage.getItem('products')) {
  const defaultProducts = [
    {id: 1, nama: "Jeruk", harga: 50000, stok: 20, gambar: "https://picsum.photos/200", desc: "Bibit jeruk"}
  ];
  localStorage.setItem('products', JSON.stringify(defaultProducts));
}
if(!localStorage.getItem('laporan')) localStorage.setItem('laporan', JSON.stringify([]));

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function renderProducts() {
  const products = JSON.parse(localStorage.getItem('products'));
  const searchVal = document.getElementById('searchInput').value.toLowerCase();
  const filtered = products.filter(p => p.nama.toLowerCase().includes(searchVal));

  document.getElementById('productList').innerHTML = filtered.map(p => `
    <div class="product-card">
      <img src="${p.gambar}" alt="${p.nama}">
      <h3>${p.nama}</h3>
      <p>Rp ${p.harga.toLocaleString()}</p>
      <p class="stok-info ${p.stok <= 0? 'stok-habis' : ''}">Stok: ${p.stok > 0? p.stok : 'Habis'}</p>
      <button class="btn-add-cart" data-id="${p.id}" ${p.stok <= 0? 'disabled' : ''}>
        ${p.stok > 0? '+ Keranjang' : 'Stok Habis'}
      </button>
    </div>
  `).join('');

  // Pasang event ke semua tombol + Keranjang
  document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.id)));
  });
}

function addToCart(id) {
  const products = JSON.parse(localStorage.getItem('products'));
  const product = products.find(p => p.id === id);
  if(product.stok <= 0) return alert('Stok habis');

  const exist = cart.find(item => item.id === id);
  if(exist) {
    if(exist.qty >= product.stok) return alert('Stok tidak cukup');
    exist.qty++;
  } else {
    cart.push({...product, qty: 1});
  }
  updateCart();
}

function updateCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  document.getElementById('cartCount').innerText = cart.reduce((a,b) => a + b.qty, 0);
  document.getElementById('cartItems').innerHTML = cart.map(item => `
    <div class="cart-item">
      <span>${item.nama} x${item.qty}</span>
      <span>Rp ${(item.harga * item.qty).toLocaleString()}</span>
    </div>
  `).join('');
  document.getElementById('cartTotal').innerText = cart.reduce((a,b) => a + (b.harga * b.qty), 0).toLocaleString();
}

document.getElementById('searchInput').addEventListener('input', renderProducts);
document.getElementById('cartBtn').onclick = () => document.getElementById('cartModal').style.display = 'block';
document.querySelector('.close').onclick = () => document.getElementById('cartModal').style.display = 'none';

document.getElementById('checkoutBtn').onclick = () => {
  if(cart.length === 0) return alert('Keranjang kosong');

  let products = JSON.parse(localStorage.getItem('products'));
  cart.forEach(item => {
    const prod = products.find(p => p.id === item.id);
    if(prod) prod.stok -= item.qty;
  });
  localStorage.setItem('products', JSON.stringify(products));

  const total = cart.reduce((a,b) => a + (b.harga * b.qty), 0);
  const laporan = JSON.parse(localStorage.getItem('laporan'));
  laporan.push({
    tanggal: new Date().toLocaleString('id-ID'),
    total: total,
    items: cart.map(i => ({nama: i.nama, qty: i.qty, harga: i.harga}))
  });
  localStorage.setItem('laporan', JSON.stringify(laporan));

  // GANTI NOMOR WA KAMU DI SINI
  const pesan = `Halo N Florest, saya mau pesan:\n${cart.map(i => `- ${i.nama} x${i.qty}`).join('\n')}\nTotal: Rp ${total.toLocaleString()}`;
  window.open(`https://wa.me/6285773173631?text=${encodeURIComponent(pesan)}`);

