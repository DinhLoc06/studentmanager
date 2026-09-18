const tableBody = document.getElementById('studentTableBody');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

let allStudents = [];

const safeText = (value) => (value === null || value === undefined ? '' : value);

function renderStudents(students) {
  if (!tableBody) return;

  if (!students || students.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">Không tìm thấy sinh viên nào.</td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = students
    .map(
      (student) => `
        <tr>
          <td>${safeText(student.studentCode)}</td>
          <td>${safeText(student.fullName)}</td>
          <td>${safeText(student.email)}</td>
          <td>${safeText(student.phone)}</td>
          <td>${safeText(student.className)}</td>
          <td>
            <div class="action-cell">
              <button class="action-btn view" type="button" aria-label="Xem chi tiết">◉</button>
              <button class="action-btn edit" type="button" aria-label="Sửa">✎</button>
              <button class="action-btn delete" type="button" aria-label="Xóa">🗑</button>
            </div>
          </td>
        </tr>
      `
    )
    .join('');
}

function filterStudents(keyword) {
  const query = (keyword || '').trim().toLowerCase();

  if (!query) {
    renderStudents(allStudents);
    return;
  }

  const filtered = allStudents.filter((student) => {
    const text = [
      student.studentCode,
      student.fullName,
      student.email,
      student.phone,
      student.className
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return text.includes(query);
  });

  renderStudents(filtered);
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

loadStudents();
