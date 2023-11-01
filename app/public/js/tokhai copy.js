// Thêm trường input numMonths vào danh sách inputFields
const inputFields = [
  "ct23", "ct24", "ct26", "ct27", "ct25", "ct37", "ct38", "ct29", "ct30", "ct34",
  "ct31", "ct32", "ct33", "ct39", "ct40", "ct35", "ct42", "ct43", "ct47", "ct48",
  "numMonths"
];

// hàm updateResults tính giá trị của ct29 dựa trên numMonths
function updateResults() {
  const values = {};
  inputFields.forEach(id => {
    const inputValue = document.getElementById(id).value;
    const floatValue = parseFloat(inputValue.replace(/,/g, ''));
    if (!isNaN(floatValue)) {
      values[id] = floatValue;
      document.getElementById(id).value = floatValue.toLocaleString("en-US");
    } else {
      values[id] = 0;
      document.getElementById(id).value = "0";
    }
  });

  // Tính giá trị ct29 dựa trên numMonths
  values.ct29 = values.numMonths * 11000000;

  // Tính giá trị ct30 dựa trên số người phụ thuộc
  values.ct30 = values.ct27 * values.numMonths * 4400000;

  /*
    // quyết toán theo năm
    if (values.ct34 <= 60000000) {
      values.ct35 = 0.05 * ct34;
    } else if(values.ct34 > 60000000 && values.ct34 <= 120000000) {
      values.ct35 = 0.1 * ct34 - 250000;
    } else if(values.ct34 > 120000000 && values.ct34 <= 216000000) {
      values.ct35 = 0.15 * ct34 - 750000;
    } else if(values.ct34 > 216000000 && values.ct34 <= 384000000) {
      values.ct35 = 0.2 * ct34 - 1650000;
    } else if(values.ct34 > 384000000 && values.ct34 <= 624000000) {
      values.ct35 = 0.25 * ct34 - 3250000;
    } else if(values.ct34 > 384000000 && values.ct34 <= 960000000) {
      values.ct35 = 0.35 * ct34 - 5850000;
    } else if(values.ct34 > 960000000) {
      values.ct35 = 0.35  * ct34 - 9850000;
    } else {
      values.ct35 = 0;
    }
    if(ct44 < 0){
      document.getElementById("ct44").value = 0;
    } else {
      document.getElementById("ct45").value = 0;
    }
    
    */
/*
  if (values.ct34 <= 60000000) {
    values.ct35 = 0.05 * ct34;
  } else if(values.ct34 > 60000000 && values.ct34 <= 120000000) {
    values.ct35 = 0.1 * ct34 - 250000;
  } else if(values.ct34 > 120000000 && values.ct34 <= 216000000) {
    values.ct35 = 0.15 * ct34 - 750000;
  } else if(values.ct34 > 216000000 && values.ct34 <= 384000000) {
    values.ct35 = 0.2 * ct34 - 1650000;
  } else if(values.ct34 > 384000000 && values.ct34 <= 624000000) {
    values.ct35 = 0.25 * ct34 - 3250000;
  } else if(values.ct34 > 384000000 && values.ct34 <= 960000000) {
    values.ct35 = 0.30 * ct34 - 5850000;
  } else if(values.ct34 > 960000000) {
    values.ct35 = 0.35  * ct34 - 9850000;
  } else {
    values.ct35 = 0;
  }
*/

  const ct22 = values.ct23 + values.ct26;
  const ct28 = values.ct29 + values.ct30 + values.ct31 + values.ct32 + values.ct33;
  const ct34 = ct22 - values.ct25 - ct28;


  if (values.ct34 <= (5000000 * values.numMonths)) {
    values.ct35 = 0.05 * ct34;
  } else if(values.ct34 > 5000000 * values.numMonths && values.ct34 <= 10000000 * values.numMonths) {
    values.ct35 = 0.1 * ct34 - 250000;
  }
  else if(values.ct34 > 10000000 * values.numMonths && values.ct34 <= 18000000 * values.numMonths) {
    values.ct35 = 0.15 * ct34 - 750000;
  }
  else if(values.ct34 > (18000000 * values.numMonths) && values.ct34 <= (32000000 * values.numMonths)) {
    values.ct35 = 0.2 * ct34 - 1650000;
  }
  else if(values.ct34 > (32000000 * values.numMonths) && values.ct34 <= (52000000 * values.numMonths)) {
    values.ct35 = 0.25 * ct34 - 3250000;
  }
  else if(values.ct34 > (32000000 * values.numMonths) && values.ct34 <= (52000000 * values.numMonths)) {
    values.ct35 = 0.30 * ct34 - 5850000;
  }
  else if (values.ct34 > (80000000 * values.numMonths)) {
    values.ct35 = 0.35 * ct34 - 9850000;
  } 
  else{
    values.ct35 = 0;
  }

  const ct36 = values.ct37 + values.ct38 + values.ct39 - values.ct40;
  const ct41 = values.ct42 + values.ct43;
  const ct44 = values.ct35 - values.ct37 + values.ct38 + values.ct39 - values.ct40 + values.ct43;     // ct44 >= 0
  const ct45 = Math.abs(ct44);                                                                        // ct44 < 0
  const ct46 = values.ct47 + values.ct48;
  const ct49 = ct45 - ct46;

  // Hiển thị kết quả
  document.getElementById("ct22").value = ct22.toLocaleString("en-US");
  document.getElementById("ct28").value = ct28.toLocaleString("en-US");
  document.getElementById("ct29").value = values.ct29.toLocaleString("en-US");
  document.getElementById("ct30").value = values.ct30.toLocaleString("en-US");
  document.getElementById("ct34").value = ct34.toLocaleString("en-US");
  document.getElementById("ct35").value = values.ct35.toLocaleString("en-US");
  document.getElementById("ct36").value = ct36.toLocaleString("en-US");
  document.getElementById("ct41").value = ct41.toLocaleString("en-US");
  if (ct44 < 0) document.getElementById("ct44").value = 0
  else document.getElementById("ct44").value = ct44.toLocaleString("en-US");
  document.getElementById("ct45").value = ct45.toLocaleString("en-US");
  document.getElementById("ct46").value = ct46.toLocaleString("en-US");
  document.getElementById("ct49").value = ct49.toLocaleString("en-US");

}

inputFields.forEach(id => {
  document.getElementById(id).addEventListener("input", updateResults);
});

updateResults(); // Ban đầu tính toán kết quả
