  // Lấy ra tất cả các trường input
  const inputFields = [
    "ct23", "ct26", "ct25", "ct37", "ct38", "ct29", "ct30", "ct31", "ct32", "ct33", "ct39", "ct40", "ct35", "ct43", "ct47", "ct48"
  ];

  // Cập nhật kết quả khi có thay đổi trong các trường input
  function updateResults() {
    // Lấy giá trị từ các trường input
    const values = {};
    inputFields.forEach(id => {
      values[id] = parseFloat(document.getElementById(id).value) || 0;
    });

    // Tính toán giá trị của các biểu thức
    const ct22 = values.ct23 + values.ct26;
    const ct28 = values.ct29 + values.ct30 + values.ct31 + values.ct32 + values.ct33;
    const ct34 = ct22 - values.ct25 - ct28;
    const ct36 = values.ct37 + values.ct38 + values.ct39 - values.ct40;
    const ct41 = values.ct35 - ct36 + values.ct43;
    const ct44 = values.ct35 - values.ct37 + values.ct38 + values.ct39 - values.ct40 + values.ct43;
    const ct45 = ct44;
    const ct46 = values.ct47 + values.ct48;
    const ct49 = ct45 - ct46;

    // Hiển thị kết quả
    document.getElementById("ct22").value = ct22;
    document.getElementById("ct28").value = ct28;
    document.getElementById("ct34").value = ct34;
    document.getElementById("ct36").value = ct36;
    document.getElementById("ct41").value = ct41;
    document.getElementById("ct44").value = ct44;
    document.getElementById("ct45").value = ct45;
    document.getElementById("ct46").value = ct46;
    document.getElementById("ct49").value = ct49;
  }

  // Gọi hàm để cập nhật kết quả khi có sự thay đổi trong các trường input
  inputFields.forEach(id => {
    document.getElementById(id).addEventListener("input", updateResults);
  });

  // Ban đầu tính toán kết quả
  updateResults();