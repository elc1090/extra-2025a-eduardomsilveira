const signature = new Signature()
const generatePDF = new GeneratePDF()
const validation = new Validation()



document.addEventListener('DOMContentLoaded', (event) => {
  const canvas = document.getElementById('signatureCanvas');
  const ctx = canvas.getContext('2d');

  let drawing = false;

  function startPosition(e) {
    drawing = true;
    draw(e);
  }

  function endPosition() {
    drawing = false;
    ctx.beginPath();
  }

  function draw(e) {
    if (!drawing) return;
    e.preventDefault(); // Prevent scrolling

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX ? e.clientX - rect.left : e.touches[0].clientX - rect.left;
    const y = e.clientY ? e.clientY - rect.top : e.touches[0].clientY - rect.top;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  canvas.addEventListener('mousedown', startPosition);
  canvas.addEventListener('mouseup', endPosition);
  canvas.addEventListener('mousemove', draw);

  canvas.addEventListener('touchstart', startPosition);
  canvas.addEventListener('touchend', endPosition);
  canvas.addEventListener('touchmove', draw);

  function showCanvas() {
    document.getElementById('signatureCanvasWrapper').style.display = 'block';
    document.getElementById('signatureSelect').style.display = 'none';
  }

  function showSelect() {
    document.getElementById('signatureCanvasWrapper').style.display = 'none';
    document.getElementById('signatureSelect').style.display = 'block';
  }

  window.showCanvas = showCanvas;
  window.showSelect = showSelect;

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  window.clearCanvas = clearCanvas;
});






$(document).ready(function () {
  $('.datepicker').datepicker({
    format: "dd/mm/yyyy",
    defaultDate: new Date(),
    setDefaultDate: false,
    autoClose: true,
    onClose: function() {
      
      var inputElement = $(this);
      var datepickerInstance = inputElement.data('datepicker');
      
      
      if (datepickerInstance) {
        inputElement.val(datepickerInstance.toString()); 
        inputElement.trigger('change');
      }
    },  
    i18n: {
      cancel: "Cancelar",
      clear: "Limpar",
      done: "Ok",
      months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
      monthsShort: ["Jan", "Fev", "Mar", "Abr", "Maio", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
      weekdays: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
      weekdaysShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
      weekdaysAbbrev: ["D", "S", "T", "Q", "Q", "S", "S"]
    }
  })

  $('.timepicker').timepicker({
    twelveHour: false,
    autoClose: true,
    onClose: function() {
      
      var inputElement = $(this);
      var timepickerInstance = inputElement.data('timepicker');
      
      if (timepickerInstance) {
        inputElement.val(timepickerInstance.toString()); 
        inputElement.trigger('change');
      }
    }, 
    i18n: {
      cancel: "Cancelar",
      clear: "Limpar",
      done: "Ok"
    }
  })





  $('#presentationRubric1, #presentationRubric2, #presentationRubric3').change((e) => {
    const elementId = e.target.id
    const value = $(`#${elementId} + .thumb .value`).text()
    $(`#${elementId}Value`).text(value)
    calculateFinalValue()
    
  })



  $('input[type=radio][name=signatureType]').change(signature.handleSignatureTypeChange)

  initializeFields()
  signature.initialize()
  validation.initialize()
});

const initializeFields = () => {
  const params = new URLSearchParams(window.location.search)
  params.forEach((value, key) => {
    if (key === "period") {
      $(`input[name=${key}][value=${value}]`).prop('checked', true)
    } else {
      $(`input[name=${key}]`).val(value)
    }
  })
  M.updateTextFields()
}

const calculateFinalValue = () => {
  const presentationRubric1 = $(`#presentationRubric1Value`).text()
  const presentationRubric2 = $(`#presentationRubric2Value`).text()
  const presentationRubric3 = $(`#presentationRubric3Value`).text()


  const currentTimestamp = Date.now()

  
  // if (presentationRubric1 && presentationRubric2 && presentationRubric3 && contentRubric1 && contentRubric2 && contentRubric3 && contentRubric4) {
    const finalValue = Number(presentationRubric1) +
      Number(presentationRubric2) +
      Number(presentationRubric3) 
    $(`#finalValue`).text(finalValue.toFixed(1))
    
  // }
  // if (relevanceAndOriginality && contentQuality && presentation) {
  // const finalValue = Number(relevanceAndOriginality) + Number(contentQuality) + Number(presentation)


  // if (contentRubric4) {
  //   console.log(contentRubric4)
  // } else {
  //   console.log('false')
  // }
  
  // $(`#finalValue`).text(finalValue.toFixed(1))
  
  // }
}

const resetAllFields = () => {
  $(`#presentationRubric1`).text("")
  $(`#presentationRubric2`).text("")
  $(`#presentationRubric3`).text("")
  $(`#finalValue`).text("")

  signature.clearCanvas()
  signature.clearPreview()
  $('#signatureCanvasWrapper').hide()
  $('#signaturePreview').hide()
  $('#signatureSelect').hide()
}

const copyLink = () => {
  const data = generatePDF.getData()

  const link = `${window.location.href}?studentName=${encodeURIComponent(data.generalInformation.studentName)}`
    + `&professorName=${encodeURIComponent(data.generalInformation.professorName)}`
    + `&period=${data.generalInformation.period}`
    + `&date=${encodeURIComponent(data.generalInformation.date)}`
    + `&time=${encodeURIComponent(data.generalInformation.time)}`

  navigator.clipboard.writeText(link)

  M.toast({html: `<i class="material-icons">check</i><span>&nbsp;Copiado para área de transferência</span>`})
}
