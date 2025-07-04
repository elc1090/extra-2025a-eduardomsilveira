const GeneratePDF = class {

  static {
    pdfMake.fonts = {
      Times: {
        normal: 'Times-Roman',
        bold: 'Times-Bold',
        italics: 'Times-Italic',
        bolditalics: 'Times-BoldItalic'
      }
    }
  }

  getDefinition = (data) => {
    return {
      pageMargins: 70,
      content: [
        {
          text: [
            "MINISTÉRIO DA EDUCAÇÃO\n",
            "UNIVERSIDADE FEDERAL DE SANTA MARIA\n",
            "CENTRO DE TECNOLOGIA\n",
            "CURSO DE CIÊNCIA DA COMPUTAÇÃO\n",
            "\n\n\n"
          ],
          style: "header"
        },
        {
          text: ["FICHA DE AVALIAÇÃO DE TRABALHO DE GRADUAÇÃO\n", 
                 "SESSÃO PÚBLICA DE ANDAMENTO\n","\n\n\n"],
          style: "title"
        },
        {
          text: [
            `${data.generalInformation.period}º Semestre\n`,            
            `Estudante: ${data.generalInformation.studentName}\n`,
            `Avaliador(a): ${data.generalInformation.professorName}\n`,
            `Data: ${data.generalInformation.date}\n`,
            `Horário: ${data.generalInformation.time}\n`,
            "\n\n"
          ],
          style: "normal"
        },
        {
          columns: [
            {width: "*", text: ""},
            {
              width: "auto",
              table: {
                headerRows: 1,
                body: [
                  [
                    {text: "Critério", style: "tableHeader", noWrap: true},
                    {text: "Nota", style: "tableHeader", noWrap: true}
                  ],
                  [
                    {text: "Conteúdo da apresentação", style: "tableBody"},
                    {text: data.evaluation.presentationRubric1, style: "tableBody"}
                  ],
                  [
                    {text: "Domínio dos recursos didáticos", style: "tableBody"},
                    {text: data.evaluation.presentationRubric2, style: "tableBody"}
                  ],
                  [
                    {text: "Utilização do tempo e poder de síntese", style: "tableBody"},
                    {text: data.evaluation.presentationRubric3, style: "tableBody"}
                  ],
                  [
                    {text: "Nota de andamento", style: "tableBody"},
                    {text: data.evaluation.finalValue, style: "tableBody"}
                  ]
                ],
                alignment: "center"
              }
            },
            {width: "*", text: ""},
          ]
        },
        {text: "\n\n", style: "normal"},
        {
          image: data.signature,
          width: 150,
          style: "center"
        },
        {
          text: [
            "___________________________________\n",
            "Avaliador(a)"
          ],
          style: "center"
        }
      ],
      styles: {
        header: {
          font: "Times",
          fontSize: 12,
          alignment: "center",
          lineHeight: 1.5
        },
        title: {
          font: "Times",
          fontSize: 14,
          bold: true,
          alignment: "center",
          lineHeight: 1.5
        },
        normal: {
          font: "Times",
          fontSize: 12,
          alignment: "justify",
          lineHeight: 1.5
        },
        tableHeader: {
          font: "Times",
          fontSize: 12,
          bold: true,
          margin: 5
        },
        tableBody: {
          font: "Times",
          fontSize: 12,
          margin: 5
        },
        center: {
          font: "Times",
          fontSize: 12,
          alignment: "center",
          lineHeight: 1.5
        }
      }
    }
  }

  getData = () => {
    return {
      generalInformation: {
        studentName: $('#studentName').val(),
        professorName: $('#professorName').val(),
        period: $('input[name=period]:checked').val(),
        date: $('#date').val(),
        time: $('#time').val()
      },
      evaluation: {
        presentationRubric1: Number($(`#presentationRubric1Value`).text()),
        presentationRubric2: Number($(`#presentationRubric2Value`).text()),
        presentationRubric3: Number($(`#presentationRubric3Value`).text()),
        contentRubric1: Number($(`#contentRubric1Value`).text()),
        contentRubric2: Number($(`#contentRubric2Value`).text()),
        contentRubric3: Number($(`#contentRubric3Value`).text()),
        contentRubric4: Number($(`#contentRubric4Value`).text()),        
        presentation: Number($(`#presentationValue`).text()),
        finalValue: Number($(`#finalValue`).text())
      },
      signature: signature.getSignatureImage()
    }


  }
  downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);    
  }



  // open = () => {
  //   if ($('#evaluationForm').valid()) {
  //     const data = this.getData()
  //     pdfMake.createPdf(this.getDefinition(data)).open();
  //   }
  // }

  open = async () => {
    if ($('#evaluationForm').valid()) {
      const data = this.getData();
      const pdfDocGenerator = pdfMake.createPdf(this.getDefinition(data));
  
      pdfDocGenerator.getBlob(async (blob) => {
        const file = new File([blob], 'ficha-avaliacao-tcc.pdf', { type: 'application/pdf' });
  
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: 'Ficha de Avaliação de Andamento de TCC',
              text: 'Segue o PDF gerado.',
              files: [file]
            });
          } catch (error) {
            console.warn("Sharing failed, falling back to download", error);
            this.downloadBlob(blob, file.name);
          }
        } else {
          this.downloadBlob(blob, file.name);
        }
      });
    }
  }
  

}
