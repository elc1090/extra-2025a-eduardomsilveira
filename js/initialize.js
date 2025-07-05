const studentSignature = new Signature('#studentSignatureCanvas');
const professorSignature = new Signature('#professorSignatureCanvas');
const reviewer1Signature = new Signature('#reviewer1SignatureCanvas');
const reviewer2Signature = new Signature('#reviewer2SignatureCanvas');

const generatePDF = new GeneratePDF()
const validation = new Validation()

function showCanvas(canvasId, selectId) {
    document.getElementById(canvasId).style.display = 'block';
    document.getElementById(selectId).style.display = 'none';
}

function showSelect(canvasId, selectId) {
    document.getElementById(canvasId).style.display = 'none';
    document.getElementById(selectId).style.display = 'block';
}

$(document).ready(function() {
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

    $('#score').change((e) => {
        const elementId = e.target.id
        const value = $(`#${elementId} + .thumb .value`).text()
        $(`#${elementId}Value`).text(value)
        calculateFinalValue()

    })

    $('input[type=radio][name=studentSignatureType]').change(studentSignature.handleSignatureTypeChange)
    $('input[type=radio][name=professorSignatureType]').change(professorSignature.handleSignatureTypeChange)
    $('input[type=radio][name=reviewer1SignatureType]').change(reviewer1Signature.handleSignatureTypeChange)
    $('input[type=radio][name=reviewer2SignatureType]').change(reviewer2Signature.handleSignatureTypeChange)

    initializeFields()
    studentSignature.initialize('#studentSignatureCanvasWrapper', '#studentSignatureSelect', 'studentSignatureType', '#studentSignatureField', '#studentSignaturePreview')
    professorSignature.initialize('#professorSignatureCanvasWrapper', '#professorSignatureSelect', 'professorSignatureType', '#professorSignatureField', '#professorSignaturePreview')
    reviewer1Signature.initialize('#reviewer1SignatureCanvasWrapper', '#reviewer1SignatureSelect', 'reviewer1SignatureType', '#reviewer1SignatureField', '#reviewer1SignaturePreview')
    reviewer2Signature.initialize('#reviewer2SignatureCanvasWrapper', '#reviewer2SignatureSelect', 'reviewer2SignatureType', '#reviewer2SignatureField', '#reviewer2SignaturePreview')
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

const resetAllFields = () => {
    $(`#score`).text("")

    studentSignature.clearCanvas()
    studentSignature.clearPreview()
    $('#studentSignatureCanvasWrapper').hide()
    $('#studentSignaturePreview').hide()
    $('#studentSignatureSelect').hide()

    professorSignature.clearCanvas()
    professorSignature.clearPreview()
    $('#professorSignatureCanvasWrapper').hide()
    $('#professorSignaturePreview').hide()
    $('#professorSignatureSelect').hide()

    reviewer1Signature.clearCanvas()
    reviewer1Signature.clearPreview()
    $('#reviewer1SignatureCanvasWrapper').hide()
    $('#reviewer1SignaturePreview').hide()
    $('#reviewer1SignatureSelect').hide()

    reviewer2Signature.clearCanvas()
    reviewer2Signature.clearPreview()
    $('#reviewer2SignatureCanvasWrapper').hide()
    $('#reviewer2SignaturePreview').hide()
    $('#reviewer2SignatureSelect').hide()
}

const copyLink = () => {
    const data = generatePDF.getData()

    const link = `${window.location.href}?studentName=${encodeURIComponent(data.generalInformation.studentName)}`
        + `&professorName=${encodeURIComponent(data.generalInformation.professorName)}`
        + `&period=${data.generalInformation.period}`
        + `&date=${encodeURIComponent(data.generalInformation.date)}`
        + `&time=${encodeURIComponent(data.generalInformation.time)}`

    navigator.clipboard.writeText(link)

    M.toast({ html: `<i class="material-icons">check</i><span>&nbsp;Copiado para área de transferência</span>` })
}
