// 📁 src/main.js
import { db } from './firebase.js';
import {
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc
} from 'firebase/firestore';

const colRef = collection(db, 'progress');
let isAdmin = false;
let currentPage = 1;
const itemsPerPage = 10;
let progressData = [];

// 로그인
window.login = function () {
  const pw = document.getElementById('adminPassword').value;
  if (pw === '1234') {
    isAdmin = true;
    alert('관리자 로그인 성공!');
    renderTable();
  } else {
    alert('비밀번호가 틀렸습니다.');
  }
};

document.getElementById('adminPassword')?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') login();
});

// 데이터 불러오기
async function fetchProgressData() {
  const snapshot = await getDocs(colRef);
  progressData = snapshot.docs.map(doc => ({ fid: doc.id, ...doc.data() }));
  renderTable();
}

// 테이블 렌더링
window.renderTable = function () {
  const statusFilter = document.getElementById('statusFilter').value;
  const serviceFilter = document.getElementById('serviceFilter').value;
  const search = document.getElementById('searchInput').value.toLowerCase();

  let filtered = progressData.filter(item => {
    return (
      (statusFilter === '전체' || item.status === statusFilter) &&
      (serviceFilter === '전체' || item.service === serviceFilter) &&
      item.title.toLowerCase().includes(search)
    );
  });

  const tbody = document.getElementById('progressBody');
  tbody.innerHTML = '';

  const start = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(start, start + itemsPerPage);

  paginated.forEach((item, idx) => {
    const tr = document.createElement('tr');
    tr.dataset.fid = item.fid;
    tr.innerHTML = `
      <td>${(currentPage - 1) * itemsPerPage + idx + 1}</td>
      <td><span class="badge ${item.status === '진행중' ? 'badge-progress' : 'badge-done'}">${item.status}</span></td>
      <td>${item.service}</td>
      <td class="title"><a href="#" class="title-clickable" data-image="${item.image}">${item.title}</a></td>
      <td>${item.author}</td>
      <td>${item.date}</td>
      <td>${item.views}</td>
      <td>${isAdmin ? `<button class="btn btn-edit">수정</button><button class="btn btn-delete">삭제</button>` : ''}</td>
    `;
    tbody.appendChild(tr);
  });

  renderPagination(filtered.length);
};

window.renderPagination = function (totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  const prevBtn = document.createElement('button');
  prevBtn.textContent = '‹ 이전';
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  };
  pagination.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) btn.classList.add('active');
    btn.onclick = () => {
      currentPage = i;
      renderTable();
    };
    pagination.appendChild(btn);
  }

  const nextBtn = document.createElement('button');
  nextBtn.textContent = '다음 ›';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderTable();
    }
  };
  pagination.appendChild(nextBtn);
};

// 클릭 이벤트 (수정/삭제/모달)
document.addEventListener('click', async (e) => {
  if (e.target.classList.contains('btn-delete')) {
    const row = e.target.closest('tr');
    const fid = row.dataset.fid;
    if (confirm('삭제하시겠습니까?')) {
      await deleteDoc(doc(db, 'progress', fid));
      fetchProgressData();
    }
  }

  if (e.target.classList.contains('btn-edit')) {
    const row = e.target.closest('tr');
    const fid = row.dataset.fid;
    const titleCell = row.querySelector('.title');
    const newTitle = prompt('새 제목을 입력하세요:', titleCell.textContent);
    if (newTitle) {
      await updateDoc(doc(db, 'progress', fid), { title: newTitle });
      fetchProgressData();
    }
  }

  if (e.target.classList.contains('title-clickable')) {
    e.preventDefault();
    const imgSrc = e.target.getAttribute('data-image');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    modalImg.src = imgSrc;
    modal.style.display = 'block';
  }
});

document.getElementById('closeModal')?.addEventListener('click', () => {
  document.getElementById('imageModal').style.display = 'none';
});

window.addEventListener('click', (e) => {
  const modal = document.getElementById('imageModal');
  if (e.target === modal) modal.style.display = 'none';
});

window.onload = () => {
  fetchProgressData();
};
