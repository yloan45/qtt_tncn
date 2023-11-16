document.querySelectorAll('.edit-user').forEach(function(editLink) {
    editLink.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        const modal = document.getElementById("editModal");
        const modalTitle = modal.querySelector('.modal-title');
        const editUserId = modal.querySelector('#editUserId');
        const fullname = modal.querySelector('#fullname');
        const email = modal.querySelector('#email');
        const masothue = modal.querySelector('#masothue');
        const phuthuoc = modal.querySelector('#phuthuoc');
        const thunhapchiuthue = modal.querySelector('#thunhapchiuthue');
        const khautruthue = modal.querySelector('#khautruthue');
        const thuenop = modal.querySelector('#thuenop');
        const hoantrathue = modal.querySelector('#hoantrathue');
        const noilamviec = modal.querySelector('#noilamviec');
        const tokhaiIdInput = modal.querySelector('#tokhaiId');
        tokhaiIdInput.value = id; // Đặt giá trị của tokhaiId trong modal

        // Sử dụng Ajax hoặc Fetch API để lấy dữ liệu từ server theo userId
        fetch(`/tokhaithue/${id}`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    modalTitle.textContent = `Duyệt khai quyêt toán thuế thu nhập cá nhân mẫu 02/QTT-TNCN - Tờ khai số:${data.tokhaithue.id}`;
                    editUserId.value = data.tokhaithue.id;
                    fullname.value = data.tokhaithue.fullname;
                    email.value = data.canhan.email;
                    masothue.value = data.canhan.masothue;
                    phuthuoc.value = data.canhan.phuthuoc;
                    thunhapchiuthue.value = data.tokhaithue.ct22;
                    khautruthue.value = data.tokhaithue.ct36;
                    thuenop.value = data.tokhaithue.ct44;
                    hoantrathue.value = data.tokhaithue.ct46;
                
                }
            });
    });
});

function duyetToKhai() {
    const modal = document.getElementById("editModal");
    const tokhaiIdInput = modal.querySelector('#tokhaiId');
    const tokhaiId = tokhaiIdInput.value;
  
    fetch('/capnhattrangthai/' + tokhaiId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        alert(data.message);
        location.reload();
      })
      .catch(function(error) {
        console.error('Lỗi:', error);
      });
  }


  function tuchoiDuyet() {
    const modal = document.getElementById("editModal");
    const tokhaiIdInput = modal.querySelector('#tokhaiId');
    const tokhaiId = tokhaiIdInput.value;
  
    fetch('/duyet-to-khai/' + tokhaiId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        alert(data.message);
        location.reload();
      })
      .catch(function(error) {
        console.error('Lỗi:', error);
      });
  }

function checkTokhai() {
  const modal = document.getElementById("editModal");
  const tokhaiIdInput = modal.querySelector('#tokhaiId');
  const tokhaiId = tokhaiIdInput.value;

  // Xóa thông báo trước đó
  document.getElementById("alertMessage").innerHTML = '';

  fetch('/check-status/' + tokhaiId, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.message) {
        const alertDiv = document.getElementById("alertMessage");
        alertDiv.innerHTML = data.message;
        if (data.isSuccess  == true) {
          alertDiv.style.color = '#29c115';
        } else {
          alertDiv.style.color = 'red';
        }
        
      }
    })
    .catch(function(error) {
      console.error('Lỗi:', error);
    });
}


function clearAlertMessage() {
  document.getElementById("alertMessage").innerHTML = '';
}

document.getElementById('download-pdf').addEventListener('click', function() {
  var contentElement = document.getElementById('pdf-content');
  var clonedContent = contentElement.cloneNode(true);
  var buttons = clonedContent.querySelectorAll('button, a');
  buttons.forEach(function(button) {
    button.remove();
  });
  var formFields = clonedContent.querySelectorAll('input, select');
  formFields.forEach(function(field) {
    field.style.border = 'none';
  });
  var inputs = clonedContent.querySelectorAll('input');
  inputs.forEach(function(input) {
    var inputValue = input.value;
    var valueParagraph = document.createElement('p');
    valueParagraph.innerText = inputValue;
    input.replaceWith(valueParagraph);
  });

  var options = {
    margin: 10,
    filename: 'tokhai_qtt_tncn.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 1 },
    jsPDF: { unit: 'mm', format: 'a3', orientation: 'portrait' }
  };
  html2pdf().from(clonedContent).set(options).save();
});
