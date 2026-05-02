// ========== 1. INISIALISASI & AMBIL DATA ==========
document.addEventListener('DOMContentLoaded', function() {
    // Cek halaman mana yang sedang dibuka
    if (document.getElementById('formTambahProduk')) {
        initAdminPage();
    }
    if (document.getElementById('daftarProdukDashboard')) {
        initDashboardPage();
    }
});

// Key localStorage kita samakan biar gak bentrok
const STORAGE_KEY = 'produkTokoDARK';

// Ambil data produk dari localStorage
function getProduk() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data? JSON.parse(data) : [];
}

// Simpan data produk ke localStorage
function simpanProduk(dataProduk) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataProduk));
    // Trik penting: kasih tau halaman lain kalau data berubah
    window.dispatchEvent(new Event('storage')); 
}

// ========== 2. HALAMAN ADMIN ==========
function initAdminPage() {
    const form = document.getElementById('formTambahProduk');
    const btnTambah = document.getElementById('btnTambahProduk');
    
    tampilkanProdukAdmin(); // Tampilkan produk saat pertama buka
    
    // Event saat klik "Tambah Produk"
    btnTambah.addEventListener('click', function(e) {
        e.preventDefault();
        
        const nama = document.getElementById('namaProduk').value;
        const harga = document.getElementById('harga').value;
        const stok = document.getElementById('stok').value;
        const deskripsi = document.getElementById('deskripsi').value;
        const fileInput = document.getElementById('gambarProduk');
        
        if (!nama ||!harga ||!stok) {
            alert('Nama, Harga, dan Stok wajib diisi!');
            return;
        }

        // Handle gambar - karena github.io gak bisa upload, kita pake base64
        const reader = new FileReader();
        reader.onload = function() {
            const gambarBase64 = fileInput.files[0]? reader.result : '';
            
            const produkBaru = {
                id: Date.now(), // ID unik pake timestamp
                nama: nama,
                harga: parseInt(harga),
                stok: parseInt(stok),
                deskripsi: deskripsi,
                gambar: gambarBase64
            };

            const semuaProduk = getProduk();
            semuaProduk.push(produkBaru);
            simpanProduk(semuaProduk); // Simpan & trigger update
            
            tampilkanProdukAdmin(); // Render ulang list di admin
            form.reset(); // Kosongin form
            alert('Produk berhasil ditambahkan!');
        };

        if (fileInput.files[0]) {
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            reader.onload(); // Jalanin tanpa gambar
        }
    });
}

// Tampilkan daftar produk di halaman Admin
function tampilkanProdukAdmin() {
    const listContainer = document.getElementById('daftarProduk');
    if (!listContainer) return;
    
    const semuaProduk = getProduk();
    listContainer.innerHTML = ''; // Kosongin dulu

    if (semuaProduk.length === 0) {
        listContainer.innerHTML = '<p>Belum ada produk.</p>';
        return;
    }

    semuaProduk.forEach(produk => {
        const item = `
            <div class="item-produk">
                <b>${produk.nama}</b>
                <p>Rp ${produk.harga.toLocaleString('id-ID')} | Stok: ${produk.stok}</p>
                <button class="btn-edit" onclick="editProduk(${produk.id})">Edit</button>
                <button class="btn-hapus" onclick="hapusProduk(${produk.id})">Hapus</button>
            </div>
            <hr>
        `;
        listContainer.innerHTML += item;
    });
}

// Fungsi Hapus
function hapusProduk(id) {
    if (confirm('Yakin mau hapus produk ini?')) {
        let semuaProduk = getProduk();
        semuaProduk = semuaProduk.filter(p => p.id!== id);
        simpanProduk(semuaProduk);
        tampilkanProdukAdmin();
    }
}

// Fungsi Edit - versi simple
function editProduk(id) {
    alert('Fitur edit belum dibuat. Hapus lalu tambah ulang aja dulu ya');
}

// ========== 3. HALAMAN DASHBOARD / UTAMA ==========
function initDashboardPage() {
    tampilkanProdukDashboard();
    
    // Trik: dengerin kalau ada perubahan di localStorage dari tab lain
    window.addEventListener('storage', function() {
        console.log('Data berubah, refresh dashboard...');
        tampilkanProdukDashboard();
    });
}

// Tampilkan produk di halaman utama
function tampilkanProdukDashboard() {
    const container = document.getElementById('daftarProdukDashboard');
    if (!container) return;

    const semuaProduk = getProduk();
    container.innerHTML = '';

    if (semuaProduk.length === 0) {
        container.innerHTML = '<p>Produk masih kosong.</p>';
        return;
    }

    semuaProduk.forEach(produk => {
        const card = `
            <div class="card-produk">
                <img src="${produk.gambar || 'https://via.placeholder.com/150'}" alt="${produk.nama}" style="width:100px; height:100px; object-fit:cover;">
                <h4>${produk.nama}</h4>
                <p>Rp ${produk.harga.toLocaleString('id-ID')}</p>
                <p>Stok: ${produk.stok}</p>
                <button onclick="tambahKeranjang(${produk.id})">+ Keranjang</button>
            </div>
        `;
        container.innerHTML += card;
    });
}

function tambahKeranjang(id) {
    alert('Fungsi keranjang belum dibuat. ID Produk: ' + id);
              }
