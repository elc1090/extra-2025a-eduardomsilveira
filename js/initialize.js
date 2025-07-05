const studentSignature = new Signature('#studentSignatureCanvas');
const professorSignature = new Signature('#professorSignatureCanvas');

const generatePDF = new GeneratePDF()
const validation = new Validation()

function showCanvas(canvasId, selectId) {
    console.log("Calling showCanvas with", canvasId, selectId);
    document.getElementById(canvasId).style.display = 'block';
    document.getElementById(selectId).style.display = 'none';
}

function showSelect(canvasId, selectId) {
    console.log("Calling showSelect with", canvasId, selectId);
    document.getElementById(canvasId).style.display = 'none';
    document.getElementById(selectId).style.display = 'block';
}

function initializeCanvasCallback(signatureCanvas) {
    return () => {
        const canvas = document.getElementById(signatureCanvas);
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
    };
}

document.addEventListener('DOMContentLoaded', initializeCanvasCallback('studentSignatureCanvas'));
document.addEventListener('DOMContentLoaded', initializeCanvasCallback('professorSignatureCanvas'));

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

    initializeFields()
    studentSignature.initialize('#studentSignatureCanvasWrapper', '#studentSignatureSelect', 'studentSignatureType', '#studentSignatureField', '#studentSignaturePreview')
    professorSignature.initialize('#professorSignatureCanvasWrapper', '#professorSignatureSelect', 'professorSignatureType', '#professorSignatureField', '#professorSignaturePreview')
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
