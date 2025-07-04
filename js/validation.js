const Validation = class {

  validationOptions = {
    rules: {
      studentName: "required",
      professorName: "required",
      period: "required",
      date: "required",
      time: "required",
      relevanceAndOriginality: {rangeField: true},
      contentQuality: {rangeField: true},
      presentation: {rangeField: true},
      signatureType: "required",
      signatureCanvas: {signatureCanvas: true},
      signatureField: {signatureField: true},
    },
    messages: {
      studentName: "Preencha este campo.",
      professorName: "Preencha este campo.",
      period: "Selecione um dos valores.",
      date: "Preencha este campo.",
      time: "Preencha este campo.",
      relevanceAndOriginality: "Selecione um valor.",
      contentQuality: "Selecione um valor.",
      presentation: "Selecione um valor.",
      signatureType: "Selecione um dos valores.",
      signatureCanvas: "Desenhe a sua assinatura.",
      signatureField: "Selecione um arquivo.",
    }
  }

  initialize = () => {
    $.validator.setDefaults({
      ignore: [],
      errorClass: 'invalid',
      errorPlacement: (error, element) => {
        $(`#${element.attr("name")}Error`).text(error.text())
      },
      success: () => {
        //TODO: discover why is necessary
      }
    });

    $.validator.addMethod("rangeField", (value, element) => {
      const elementName = $(element).attr("name")
      return $(`#${elementName}Value`).text().length
    })

    $.validator.addMethod("signatureCanvas", () => {
      const type = $('input[name=signatureType]:checked').val()
      if (!type) {
        return true
      }
      switch (type) {
        case "DRAW": {
          return !signature.isBlank()
        }
        case "SELECT": {
          return true;
        }
      }
    })

    $.validator.addMethod("signatureField", () => {
      const type = $('input[name=signatureType]:checked').val()
      if (!type) {
        return true
      }
      switch (type) {
        case "DRAW": {
          return true
        }
        case "SELECT": {
          return $('#signatureField').prop("files").length;
        }
      }
    })

    $('#evaluationForm').validate(validation.validationOptions)
  }
}
