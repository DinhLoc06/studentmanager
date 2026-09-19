const tableBody = document.getElementById('studentTableBody');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const addStudentBtn = document.getElementById('addStudentBtn');
const exportExcelBtn = document.getElementById('exportExcelBtn');
const exportPdfBtn = document.getElementById('exportPdfBtn');
const studentForm = document.getElementById('studentForm');
const studentModal = document.getElementById('studentModal');
const studentModalTitle = document.getElementById('studentModalTitle');
const studentCodeInput = document.getElementById('studentCode');
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const classNameInput = document.getElementById('className');

let allStudents = [];
let studentDataTable = null;
let editingStudentId = null;

const safeText = (value) => (value === null || value === undefined ? '' : value);

function getStudentPayload() {
  return {
    studentCode: studentCodeInput.value.trim(),
    fullName: fullNameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
    className: classNameInput.value.trim()
  };
}

function resetStudentForm() {
  studentForm.reset();
  editingStudentId = null;
  studentModalTitle.textContent = 'Thêm sinh viên';
}

function openStudentModal(student = null) {
  resetStudentForm();

  if (student) {
    editingStudentId = student.id;
    studentModalTitle.textContent = 'Cập nhật sinh viên';
    studentCodeInput.value = safeText(student.studentCode);
    fullNameInput.value = safeText(student.fullName);
    emailInput.value = safeText(student.email);
    phoneInput.value = safeText(student.phone);
    classNameInput.value = safeText(student.className);
  }

  if (window.bootstrap && window.bootstrap.Modal) {
    const modal = new bootstrap.Modal(studentModal);
    modal.show();
  }
}

async function saveStudent(event) {
  event.preventDefault();

  const payload = getStudentPayload();
  const isValid = Object.values(payload).every((value) => value && value.length > 0);

  if (!isValid) {
    alert('Vui lòng điền đầy đủ thông tin sinh viên.');
    return;
  }

  try {
    const url = editingStudentId ? `/api/students/${editingStudentId}` : '/api/students';
    const method = editingStudentId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const modalInstance = bootstrap.Modal.getInstance(studentModal);
    if (modalInstance) {
      modalInstance.hide();
    }

    resetStudentForm();
    await loadStudents();
  } catch (error) {
    console.error('Không thể lưu sinh viên:', error);
    alert('Không thể lưu sinh viên. Vui lòng thử lại.');
  }
}

async function deleteStudent(id) {
  const student = allStudents.find((item) => item.id === id);
  const name = student ? student.fullName : 'sinh viên này';

  if (!window.confirm(`Bạn có chắc muốn xóa ${name}?`)) {
    return;
  }

  try {
    const response = await fetch(`/api/students/${id}`, { method: 'DELETE' });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    await loadStudents();
  } catch (error) {
    console.error('Không thể xóa sinh viên:', error);
    alert('Không thể xóa sinh viên. Vui lòng thử lại.');
  }
}

function exportToExcel() {
  if (!window.XLSX) {
    alert('Không thể tải thư viện xuất Excel.');
    return;
  }

  const rows = allStudents.map((student) => ({
    'Mã sinh viên': safeText(student.studentCode),
    'Họ và tên': safeText(student.fullName),
    Email: safeText(student.email),
    'Số điện thoại': safeText(student.phone),
    Lớp: safeText(student.className)
  }));
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sinh vien');
  XLSX.writeFile(workbook, 'danh-sach-sinh-vien.xlsx');
}

function exportToPdf() {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert('Không thể tải thư viện xuất PDF.');
    return;
  }

  const document = new window.jspdf.jsPDF();
  document.setFontSize(16);
  document.text('DANH SACH SINH VIEN', 14, 16);
  document.setFontSize(10);
  document.text(`Ngay xuat: ${new Date().toLocaleDateString('vi-VN')}`, 14, 23);
  document.autoTable({
    startY: 30,
    head: [['Ma sinh vien', 'Ho va ten', 'Email', 'So dien thoai', 'Lop']],
    body: allStudents.map((student) => [
      safeText(student.studentCode),
      safeText(student.fullName),
      safeText(student.email),
      safeText(student.phone),
      safeText(student.className)
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [13, 110, 253] }
  });
  document.save('danh-sach-sinh-vien.pdf');
}

function initDataTable() {
  if (!window.jQuery || !$.fn.DataTable) return null;

  if ($.fn.DataTable.isDataTable('#studentTable')) {
    $('#studentTable').DataTable().destroy();
  }

  studentDataTable = $('#studentTable').DataTable({
    paging: true,
    searching: true,
    ordering: true,
    info: true,
    lengthChange: true,
    pageLength: 10,
    order: [[0, 'asc']],
    language: {
      search: '',
      searchPlaceholder: 'Tìm kiếm...',
      lengthMenu: '_MENU_ / trang',
      info: 'Hiển thị _START_ đến _END_ của _TOTAL_ mục',
      paginate: {
        previous: 'Trước',
        next: 'Sau'
      }
    }
  });

  return studentDataTable;
}

function renderStudents(students) {
  if (!tableBody) return;

  if (!students || students.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">Không tìm thấy sinh viên nào.</td>
      </tr>
    `;
    initDataTable();
    return;
  }

  tableBody.innerHTML = students
    .map(
      (student) => `
        <tr data-id="${safeText(student.id)}">
          <td>${safeText(student.studentCode)}</td>
          <td>${safeText(student.fullName)}</td>
          <td>${safeText(student.email)}</td>
          <td>${safeText(student.phone)}</td>
          <td>${safeText(student.className)}</td>
          <td>
            <div class="d-flex gap-2">
              <button class="table-action view" type="button" aria-label="Xem chi tiết" data-action="view" data-id="${safeText(student.id)}"><i class="bi bi-eye"></i></button>
              <button class="table-action edit" type="button" aria-label="Sửa" data-action="edit" data-id="${safeText(student.id)}"><i class="bi bi-pencil-square"></i></button>
              <button class="table-action delete" type="button" aria-label="Xóa" data-action="delete" data-id="${safeText(student.id)}"><i class="bi bi-trash"></i></button>
            </div>
          </td>
        </tr>
      `
    )
    .join('');

  initDataTable();
}

function handleTableAction(event) {
  const actionButton = event.target.closest('.table-action');
  if (!actionButton) return;

  const { action, id } = actionButton.dataset;
  if (!id) return;

  const student = allStudents.find((item) => item.id === id);
  if (!student) return;

  if (action === 'view') {
    alert(`Mã SV: ${student.studentCode}\nHọ tên: ${student.fullName}\nEmail: ${student.email}\nSố điện thoại: ${student.phone}\nLớp: ${student.className}`);
    return;
  }

  if (action === 'edit') {
    openStudentModal(student);
    return;
  }

  if (action === 'delete') {
    deleteStudent(id);
  }
}

function filterStudents(keyword) {
  const query = (keyword || '').trim();

  if (!studentDataTable) {
    renderStudents(allStudents);
    return;
  }

  studentDataTable.search(query).draw();
}

async function loadStudents() {
  try {
    const response = await fetch('/api/students');

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    allStudents = Array.isArray(data) ? data : [];
    renderStudents(allStudents);
  } catch (error) {
    console.error('Không thể tải dữ liệu sinh viên:', error);
    allStudents = [];
    renderStudents(allStudents);
  }
}

if (searchInput) {
  searchInput.addEventListener('input', (event) => {
    filterStudents(event.target.value);
  });
}

if (searchBtn) {
  searchBtn.addEventListener('click', () => {
    filterStudents(searchInput?.value || '');
  });
}

if (addStudentBtn) {
  addStudentBtn.addEventListener('click', () => openStudentModal());
}

if (exportExcelBtn) {
  exportExcelBtn.addEventListener('click', exportToExcel);
}

if (exportPdfBtn) {
  exportPdfBtn.addEventListener('click', exportToPdf);
}

if (studentForm) {
  studentForm.addEventListener('submit', saveStudent);
}

if (tableBody) {
  tableBody.addEventListener('click', handleTableAction);
}

loadStudents();
