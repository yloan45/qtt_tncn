// delete user cá nhân
document.addEventListener('DOMContentLoaded', function() {
    var deleteLinks = document.querySelectorAll('.delete-link');
    deleteLinks.forEach(function(link) {
      link.addEventListener('click', function(event) {
        event.preventDefault();
        var userId = link.getAttribute('data-id');
        Swal.fire({
          title: 'Xác nhận xóa',
          text: 'Bạn có chắc chắn muốn xóa?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Đồng ý',
          cancelButtonText: 'Hủy bỏ'
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = '/deletecn/' + userId;
          }
        });
      });
    });
  });

  // import cá nhân
  document.getElementById('importBtn').addEventListener('click', function() {
    document.getElementById('fileInput').click();
  });

  document.getElementById('fileInput').addEventListener('change', function() {
    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0];

    if (file) {
      Swal.fire({
        title: 'Xác nhận',
        text: 'Bạn có chắc chắn muốn upload file đã chọn?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ'
      }).then((result) => {
        if (result.isConfirmed) {
          var formData = new FormData();
          formData.append('file', file);

          fetch('/import-canhan', {
              method: 'POST',
              body: formData
            })
            .then(response => response.json())
            .then(data => {
              Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: 'Import thành công!',
              });
            })
            .catch(error => {
              console.error('Error during import:', error);
              Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: 'Import thành công!',
              });
            });
        }
      });
    }
  });

  // duyệt tài khoản đăng ký thuế lần đầu
  document.addEventListener('DOMContentLoaded', function () {
    var create = document.querySelectorAll('.edit-link'); 
    create.forEach(function (link) {
      link.addEventListener('click', async function (event) {
        event.preventDefault();
        try {
          var userId = link.getAttribute('data-id');
          const response = await fetch('/create-user/' + userId, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({}),
            });

            const result = await response.json();

            if (result.success == true) {
              Swal.fire({
                icon: 'success',
                title: 'Duyệt thành công!',
                text: 'Tài khoản đã được tạo thành công.',
              });
            } else if(result.success == false){
              Swal.fire({
                icon: 'error',
                title: 'Duyệt không thành công.',
                text: 'Người dùng đã tồn tại!',
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Duyệt thất bại!',
                text: 'Đã xảy ra lỗi trong quá trình tạo tài khoản.',
              });
            }
        } catch (error) {
          throw error;
        }
      });
    });
  });

  // update
  document.addEventListener('DOMContentLoaded', function () {
    var editLinks = document.querySelectorAll('.edit-link');
  
    editLinks.forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        var userId = link.getAttribute('data-id');
        // Thực hiện chuyển hướng đến trang chỉnh sửa
        window.location.href = '/update/' + userId;
      });
    });
  });



  