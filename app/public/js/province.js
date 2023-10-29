const provinceSelect = document.getElementById("provinceSelect");
fetch('https://provinces.open-api.vn/api/')
    .then(response => response.json())
    .then(data => {
        data.forEach(function (province) {
            const option = document.createElement("option");
            option.value = province.name;
            option.textContent = province.name;
            provinceSelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Lỗi khi tải danh sách tỉnh/thành phố từ API:', error);
    });