const loginSection = document.getElementById('loginSection');
const adminPanel = document.getElementById('adminPanel');
let gambarBase64 = '';
let editGambarBase64 = '';

document.getElementById('loginBtn').onclick = () => {
  const username = document.getElementById('usernameInput').value;
  const pin = document.getElementById('pinInput').value;
  if(username === localStorage.getItem('adminUser') && pin === localStorage.getItem('adminPin')) {
    loginSection.classList.add('hidden');
    adminPanel.classList.remove('hidden');
    renderAdminProducts();
    renderLaporan();
  } else {
    document.getElementById('loginError').innerText = 'Username atau PIN salah!';
  }
};

document.getElementById('logoutBtn').onclick = () => location.reload();

// Upload gambar produk baru
document.getElementById('gambarFile').onchange = (e) => {
  const file = e.target.files[0];
  if(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      gambarBase64 = e.target.result;
      const preview = document.getElementById('previewImg');
      preview.src = gambarBase64;
      preview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  }
};

// Upload gambar edit produk
document.getElementById('editGambarFile').onchange = (e) => {
  const file = e.target.files[0];
  if(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      editGambarBase64 = e.target.result;
      document.getElementById('editPreviewImg').src = editGambarBase64;
    };
    reader.readAsDataURL(file);
  }
};

function renderAdminProducts() {
  const products = JSON.parse(localStorage.getItem('products'));
  document.getElementById('adminProductList').innerHTML = products.map(p => `
    <div class="admin-product-row">
      <div class="admin-product-info">
        <strong>${p.nama}</strong><br>
        Rp ${p.harga.toLocaleString()} | Stok: ${p.stok}
      </div>
      <div class="admin-actions">
        <button class="btn-edit" onclick="bukaEdit(${p.id})">Edit</button>
        <button class="btn-hapus" onclick="hapusProduk(${p.id})">Hapus</button>
      </div>
    </div>
  `).join('');
}

document.getElementById('tambahBtn').onclick = () => {
  const nama = document.getElementById('namaProduk').value;
  const harga = parseInt(document.getElementById('hargaProduk').value);
  const stok = parseInt(document.getElementById('stokProduk').value);
  const desc = document.getElementById('descProduk').value;

  if(!nama ||!harga ||!stok ||!gambarBase64) return alert('Lengkapi semua data + upload gambar');

  const products = JSON.parse(localStorage.getItem('products'));
  products.push({id: Date.now(), nama, harga, stok, desc, gambar: gambarBase64});
  localStorage.setItem('products', JSON.stringify(products));

  // Reset form
  document.getElementById('namaProduk').value = '';
  document.getElementById('hargaProduk').value = '';
  document.getElementById('stokProduk').value = '';
  document.getElementById('descProduk').value = '';
  document.getElementById('gambarFile').value = '';
  document.getElementById('previewImg').classList.add('hidden');
  gambarBase64 = '';

  renderAdminProducts();
};

function hapusProduk(id) {
  if(!confirm('Yakin hapus produk ini?')) return;
  let products = JSON.parse(localStorage.getItem('products'));
  products = products.filter(p => p.id!== id);
  localStorage.setItem('products', JSON.stringify(products));
  renderAdminProducts();
}

// Buka modal edit
function bukaEdit(id) {
  const products = JSON.parse(localStorage.getItem('products'));
  const p = products.find(prod => prod.id === id);
  document.getElementById('editId').value = p.id;
  document.getElementById('editNama').value = p.nama;
  document.getElementById('editHarga').value = p.harga;
  document.getElementById('editStok').value = p.stok;
  document.getElementById('editDesc').value = p.desc;
  document.getElementById('editPreviewImg').src = p.gambar;
  editGambarBase64 = p.gambar;
  document.getElementById('editModal').style.display = 'block';
}

document.getElementById('closeEdit').onclick = () => {
  document.getElementById('editModal').style.display = 'none';
};

// Simpan hasil edit
document.getElementById('simpanEditBtn').onclick = () => {
  const id = parseInt(document.getElementById('editId').value);
  let products = JSON.parse(localStorage.getItem('products'));
  const index = products.findIndex(p => p.id === id);

  products[index] = {
    id: id,
    nama: document.getElementById('editNama').value,
    harga: parseInt(document.getElementById('editHarga').value),
    stok: parseInt(document.getElementById('editStok').value),
    desc: document.getElementById('editDesc').value,
    gambar: editGambarBase64
  };

  localStorage.setItem('products', JSON.stringify(products));
  document.getElementById('editModal').style.display = 'none';
  renderAdminProducts();
  alert('Produk berhasil diupdate');
};

// Render laporan penjualan
function renderLaporan() {
  const laporan = JSON.parse(localStorage.getItem('laporan'));
  const totalOmzet = laporan.reduce((a,b) => a + b.total, 0);

  document.getElementById('totalOmzet').innerText = `Rp ${totalOmzet.toLocaleString()}`;
  document.getElementById('totalTransaksi').innerText = laporan.length;

  document.getElementById('listPenjualan').innerHTML = laporan.slice().reverse().map(trx => `
    <div class="penjualan-item">
      <strong>Rp ${trx.total.toLocaleString()}</strong>
      <span>${trx.tanggal} - ${trx.items.map(i => `${i.nama} x${i.qty}`).join(', ')}</span>
    </div>
  `).join('');
}

document.getElementById('resetLaporanBtn').onclick = () => {
  if(confirm('Yakin reset semua data penjualan?')) {
    localStorage.setItem('laporan', JSON.stringify([]));
    renderLaporan();
  }
};

document.getElementById('gantiAkunBtn').onclick = () => {
  const userBaru = document.getElementById('usernameBaru').value;
  const pinLama = document.getElementById('pinLama').value;
  const pinBaru = document.getElementById('pinBaru').value;

  if(pinLama!== localStorage.getItem('adminPin')) return alert('PIN lama salah');
  if(pinBaru.length!== 6) return alert('PIN harus 6 digit');
  if(!userBaru) return alert('Username tidak boleh kosong');

  localStorage.setItem('adminUser', userBaru);
  localStorage.setItem('adminPin', pinBaru);
  alert('Akun admin berhasil diupdate');
};