document.getElementById('reload').addEventListener('click', function() {
  var captchaImage = document.getElementById('captchaImage');
  var newImageUrl = '/captcha?' + new Date().getTime();
  captchaImage.src = newImageUrl;
});

// tìm kiếm trong bảng(table)
const searchInput = document.getElementById('search-input');
const dataTable = document.getElementById('data-table');
searchInput.addEventListener('input', function() {
  const searchTerm = searchInput.value.toLowerCase();
  const rows = dataTable.querySelectorAll('tbody tr');

  rows.forEach(row => {
    const columns = row.querySelectorAll('td');
    let found = false;

    columns.forEach(column => {
      if (column.textContent.toLowerCase().includes(searchTerm)) {
        found = true;
      }
    });
    if (found) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
});

// set ngày tháng hiện tại
var currentDateElement = document.getElementById("currentDate");
var currentDate = new Date();
var day = currentDate.getDate();
var month = currentDate.getMonth() + 1;
var year = currentDate.getFullYear();
currentDateElement.innerHTML = "Ngày " + day + " tháng " + month + " năm " + year;


// hiệu ứng table
document.addEventListener('DOMContentLoaded', function() {
  const tableRows = document.querySelectorAll('.table-row');

  tableRows.forEach(row => {
    row.addEventListener('mouseover', function() {
      row.style.backgroundColor = '#c8d5ed';
    });

    row.addEventListener('mouseout', function() {
      row.style.backgroundColor = '';
    });
  });
});

