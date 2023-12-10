
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
