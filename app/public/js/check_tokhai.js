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

/*
  function checkTokhai() {
    const modal = document.getElementById("editModal");
    const tokhaiIdInput = modal.querySelector('#tokhaiId');
    const tokhaiId = tokhaiIdInput.value;
  
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

  document.getElementById("alertMessage").innerHTML = '';
  fetch('/check-status/' + tokhaiId, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      }
  })
      .then(function (response) {
          return response.json();
      })
      .then(function (data) {
          // Hiển thị thông báo trong tờ khai
          const tokhaiMessage = document.getElementById("tokhaiMessage");
          tokhaiMessage.textContent = data.message;
          tokhaiMessage.style.display = 'block';

          if (data.isSuccess) {
              // Thành công, thực hiện các bước tiếp theo nếu cần
          } else {
              // Có lỗi, xử lý hoặc hiển thị thông báo lỗi tùy ý
          }
      })
      .catch(function (error) {
          console.error('Lỗi:', error);
      });
}

function checkTokhai() {
  const modal = document.getElementById("editModal");
  const tokhaiIdInput = modal.querySelector('#tokhaiId');
  const tokhaiId = tokhaiIdInput.value;

  // Xóa thông báo trước đó nếu có
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
      // Kiểm tra xem API có trả về thông báo và ID không
      if (data.message && data.divId) {
        // Hiển thị thông báo trong div mới
        document.getElementById(data.divId).innerHTML = data.message;
      } else {
        // Nếu không có ID, sử dụng div mặc định
        document.getElementById("alertMessage").innerHTML = data.message;
      }
    })
    .catch(function(error) {
      console.error('Lỗi:', error);
    });
}
*/


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
