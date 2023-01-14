const formBuku = document.getElementById('formBuku');
const pencarian = document.getElementById('pencarian');
const belumDibaca = document.getElementById('Buku');
const sudahDibaca = document.getElementById('bukuSelesai');
const checklist = document.getElementById('selesai').checked;
const storage_Key = 'daftarBuku';

function tambahData() { //menambahkan data buku
    const id = +new Date();
    const judulBuku = document.getElementById('judulBuku').value;
    const penulisBuku = document.getElementById('penulisBuku').value;
    const tahunTerbit = document.getElementById('tahunTerbit').value;
    const tanggalPeminjaman = document.getElementById('tanggalPeminjaman').value;
    const checklist = document.getElementById('selesai').checked;

    const itemBuku = { id, judulBuku, penulisBuku, tahunTerbit, tanggalPeminjaman, checklist };
    return itemBuku;
}
function simpanDataLokal() { //menyimpan data yg disubmit ke localstorage
    localStorage.setItem(storage_Key, JSON.stringify(daftarBuku));
}
function ambilDataLokal() { //ngambil data dari localstorge/menampilkan data yg disubmit
    const data = localStorage.getItem(storage_Key);
    if (data !== null) {
        return JSON.parse(data);
    } else {
        return [];
    }
}
formBuku.parentElement.addEventListener('click', (event) => { //menampilkan list buku
    formBuku.classList.remove('none');
})
function ubahCheck(index) { //memindahkan buku antar rak (undo dan check button)
    if (daftarBuku[index].checklist) {
        daftarBuku[index].checklist = false;
    } else {
        daftarBuku[index].checklist = true;
    }
    loadPage(daftarBuku);
}
function hapusData(index) { //mengahapus data dan menamplikan pesan dialog hapus
    if (confirm(`Apakah anda yakin akan menghapus list buku ${daftarBuku[index].judulBuku}`)) {
        daftarBuku.splice(index, 1);
        loadPage(daftarBuku);
    }
}
function buatElemen(daftarBuku, index) { //membuat elemen baru yg menampilkan data baru dari localstorage sesuai raknya
    const container = document.createElement('div');
    container.classList.add('item', 'background-item');
    container.setAttribute('id', `daftarBuku-${daftarBuku.id}`);
    container.innerHTML = `
    <div class="inner">
        <h2>${daftarBuku.judulBuku}</h2>
        <p><b>Penulis: </b> ${daftarBuku.penulisBuku} </p>
        <p><b>Tahun Terbit:</b> ${daftarBuku.tahunTerbit}</p>
        <p><b>Dipinjam Pada:</b> ${daftarBuku.tanggalPeminjaman} </p> 
    </div>
    `;

    const checkButton = document.createElement('button');
    if (daftarBuku.checklist) {
        checkButton.classList.add('undo-button');
    } else {
        checkButton.classList.add('check-button');
    }
    checkButton.addEventListener('click', function() {
        ubahCheck(index);
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('trash-button');
    deleteButton.addEventListener('click', function() {
        hapusData(index);
    });

    container.append(checkButton, deleteButton);
    return container;
}
function loadPage(data) { //menampilkan halaman data dari localstorage
    belumDibaca.innerHTML = '';
    sudahDibaca.innerHTML = '';
    simpanDataLokal();
    for (let i = 0; i < data.length; i++) {
        const daftarBuku = data[i];
        if (daftarBuku.checklist) {
            sudahDibaca.append(buatElemen(daftarBuku, i));
        } else {
            belumDibaca.append(buatElemen(daftarBuku, i));
        }
    }
}
let daftarBuku = ambilDataLokal(); //menampilkan data buku dari loadpage
loadPage(daftarBuku);
formBuku.addEventListener('submit', (event) => {
    const listBuku = tambahData();
    daftarBuku.unshift(listBuku);
    loadPage(daftarBuku);
    event.preventDefault();
});
function tampilanPencarian() { //untuk menampilkan data yg dicari
    if (pencarian.cari.value.length == 0) {
        formBuku.classList.remove('none');
    } else {
        formBuku.classList.add('none');
    }
}
function pencarianBuku(value) { //hanya menampilkan buku yg dicari
    let hasil = [];
    for (const index in daftarBuku) {
        if (daftarBuku[index].judulBuku.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
            hasil.unshift(daftarBuku[index])
        } else if (daftarBuku[index].penulisBuku.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
            hasil.unshift(daftarBuku[index])
        } else if (daftarBuku[index].tahunTerbit.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
            hasil.unshift(daftarBuku[index])
        } else if (daftarBuku[index].tanggalPeminjaman.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
            hasil.unshift(daftarBuku[index])
        }
    }
    return hasil;
}
pencarian.cari.addEventListener('keyup', (event) => { //menampilkan data buku yg dicari
    tampilanPencarian();
    const hasilcari = pencarianBuku(pencarian.cari.value);
    loadPage(hasilcari);
    event.preventDefault();
});