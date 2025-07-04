function convertToDate(dateString) {
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
}

function numeroParaMes(numero) {
    switch (numero) {
        case 1:
            return "Janeiro";
        case 2:
            return "Fevereiro";
        case 3:
            return "Março";
        case 4:
            return "Abril";
        case 5:
            return "Maio";
        case 6:
            return "Junho";
        case 7:
            return "Julho";
        case 8:
            return "Agosto";
        case 9:
            return "Setembro";
        case 10:
            return "Outubro";
        case 11:
            return "Novembro";
        case 12:
            return "Dezembro";
        default:
            return "Mês inválido";
    }
}

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
                        "\n\n\n"
                    ],
                    style: "header"
                },
                {
                    text: [
                        "ATA DE APRESENTAÇÃO DE TRABALHO DE CONCLUSÃO DE CURSO\n",
                        "\n\n\n"
                    ],
                    style: "title"
                },
                {
                    text: [
                        `Aos ${data.generalInformation.date.getDate()} dias do mês de ${numeroParaMes(data.generalInformation.date.getMonth())} de ${data.generalInformation.date.getFullYear()} às ${data.generalInformation.time}, na sala ${data.generalInformation.room}, realizou-se o Exame da Defesa do Trabalho de Conclusão de Curso intitulado: ${data.generalInformation.workTitle}, de autoria de ${data.generalInformation.studentName}, acadêmico (a) do Curso de Graduação em ${data.generalInformation.studentDegree} da UFSM. A Banca Examinadora esteve constituída por ${data.generalInformation.professorName}, professor(a) orientador(a) do Trabalho de Conclusão de Curso, e por ${data.generalInformation.reviewerName1} e  ${data.generalInformation.reviewerName2}, membros avaliadores. O(a) acadêmico(a) recebeu a nota final ${data.evaluation.score}. Foi concedido até a data de ${data.generalInformation.doomsday.getDate()} do mês de ${numeroParaMes(data.generalInformation.doomsday.getMonth())} de ${data.generalInformation.doomsday.getFullYear()} para o(a) acadêmico(a) realizar as alterações sugeridas pela Banca Examinadora e entregar o trabalho em sua redação definitiva. E para constar foi lavrada a presente Ata, que será assinada pelos membros da Banca Examinadora e pelo(a) acadêmico(a).`,
                        "\n\n"
                    ],
                    style: "normal"
                },
                {
                    text: [ // :|
                        `Santa Maria, RS ${data.generalInformation.currentDay.getDate()} de ${numeroParaMes(data.generalInformation.currentDay.getMonth() + 1)} de ${data.generalInformation.currentDay.getFullYear()}`
                    ],
                    style: "normal"
                },
                // { text: "\n\n", style: "normal" },
                // {
                //     image: data.signature,
                //     width: 150,
                //     style: "center"
                // },
                // {
                //     text: [
                //         "___________________________________\n",
                //         "Avaliador(a)"
                //     ],
                //     style: "center"
                // }
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
                studentDegree: $('#studentDegree').val(),
                workTitle: $('#workTitle').val(),
                professorName: $('#professorName').val(),
                reviewerName1: $('#reviewerName1').val(),
                reviewerName2: $('#reviewerName2').val(),
                period: $('input[name=period]:checked').val(),
                date: convertToDate($('#date').val()),
                time: $('#time').val(),
                room: $('#room').val(),
                doomsday: convertToDate($('#doomsday').val()),
                currentDay: new Date(),
            },
            evaluation: {
                score: Number($(`#scoreValue`).text()),
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
