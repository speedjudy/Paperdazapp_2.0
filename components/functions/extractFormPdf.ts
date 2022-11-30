import FileAction from '~/models/FileAction'
//@ts-ignore
import $ from 'jquery'

export const formatStyleTop = (x: string, String: string) => {
  let sliceString = String.substring(
    String.indexOf(x) + x.length + 1,
    String.indexOf('px')
  )
  return parseFloat(sliceString.trim())
}

let formatStyleLeft = (x: string, String: string) => {
  let sliceString = String.substring(
    String.indexOf(x) + x.length + 1,
    String.lastIndexOf('px')
  )
  return parseFloat(sliceString.trim())
}

export const appendEditText = ({
  parent,
  subParent,
  tools,
  elem,
  axisX,
  axisY,
  fontsize,
}: any) => {
  ; (parent.data as any).push({
    page_number: subParent.indexOf(elem),
    type: 'DrawText',
    text: tools,
    axisX: axisX[1] - axisX[0],
    axisY: axisY[1] > axisY[0] ? axisY[1] - axisY[0] : axisY[0] - axisY[1],
    size: formatStyleTop('font-size', fontsize),
  })
}

export const appendEditElement = ({
  parent,
  subParent,
  tools,
  option,
  elem,
  type,
  axisX,
  axisY,
  length,
  svgImagePath,
  svgWidth,
  svgHeight,
}: any) => {
  ; (parent.data as any).push({
    page_number: subParent.indexOf(elem),
    svgPath: tools,
    axisX: axisX[1] - axisX[0],
    axisY: axisY[1] > axisY[0] ? axisY[1] - axisY[0] : axisY[0] - axisY[1],
    type: type || 'Annotation',
    option: option,
    length,
    svgImagePath,
    svgWidth,
    svgHeight,
  })
}

export const appendUserActionElement = ({
  parent,
  subParent,
  elem,
  tool,
  axisX,
  axisY,
  axisX2,
  axisY2,
  uploaded,
}: any) => {
  //adding to the array for all annotation
  ; (parent.data as any).push({
    page_number: subParent.indexOf(elem),
    type: 'Image',
    uploaded,
    axisX: axisX[1] - axisX[0],
    axisY: axisY[1] > axisY[0] ? axisY[1] - axisY[0] : axisY[0] - axisY[1],
    axisX2: axisX2[1] - axisX2[0],
    axisY2: axisY2[1] - axisY2[0],
    base64: tool.children[0].src,
  })
}

export const appendEditImage = ({
  parent,
  subParent,
  tools,
  elem,
  axisX,
  axisY,
  height,
  axisX2,
  axisY2,
}: any) => {
  (parent.data as any).push({
    page_number: subParent.indexOf(elem),
    base64: tools,
    type: 'Image',
    axisX: axisX[1] - axisX[0],
    axisX2: axisX2[1] - axisX2[0],
    axisY2: axisY2[1] - axisY2[0],
    axisY: axisY[1] > axisY[0] ? axisY[1] - axisY[0] : axisY[0] - axisY[1],
    // height: parseFloat(height) * 0.73,
    uploaded: 'true'
  })
}

export const appendDefaultConfirmSign = ({
  parent,
  subParent,
  signaturePath,
  elem,
  option,
  type,
}: any) => {
  ; (parent.data as any).push({
    page_number: subParent.indexOf(elem),
    signaturePath,
    option,
    type: 'confirm',
  })
}

export const appendDefaultConfirmText = ({
  parent,
  subParent,
  text,
  elem,
  option,
  type,
}: any) => {
  ; (parent.data as any).push({
    page_number: subParent.indexOf(elem),
    text,
    option,
    type: 'confirm',
  })
}

export const ExtractFormPdf = ({
  downloadLink,
  file,
  pdfOffset_y,
  pdfOffset_x,
  signLabel,
}: any) => {
  let pdfScrappedData = {
    pdf_url: downloadLink || '',
    pdfWidth: null as number | null,
    pdfHeight: null as number | null,
    data: [],
  }
  let getToUserAction: any = []

  //<< -- code for external added conponent -->>
  let pdfPages = document.querySelectorAll('.pdf-single-page-outer')
  let canvasPdf = document.querySelectorAll('.pdf-page')
  let totalArray = Array.from(pdfPages)

  if (canvasPdf.length) {
    pdfScrappedData.pdfHeight =
      canvasPdf[0].children[0].tagName == 'CANVAS'
        ? canvasPdf[0].children[0].getBoundingClientRect().height
        : canvasPdf[0].children[1].getBoundingClientRect().height
    pdfScrappedData.pdfWidth =
      canvasPdf[0].children[0].tagName == 'CANVAS'
        ? canvasPdf[0].children[0].getBoundingClientRect().width
        : canvasPdf[0].children[1].getBoundingClientRect().width
  } else {
    pdfScrappedData.pdfHeight = 0;
    pdfScrappedData.pdfWidth = 0;
  }
  totalArray.forEach((element) => {
    if ((file || {}).fileAction == FileAction.CONFIRM) {
      appendDefaultConfirmSign({
        parent: pdfScrappedData,
        subParent: totalArray,
        signaturePath: file.signaturePath,
        elem: element,
        option: 'sign',
      })
      appendDefaultConfirmText({
        parent: pdfScrappedData,
        subParent: totalArray,
        text: String(file.text).trim(),
        elem: element,
        option: 'text',
      })
    }

    if (element.children.length > 1) {
      //--< formed array from the children element of the main container of holding the paperlink annotations>--
      Array.from(element.children).forEach((item) => {
        if (item.classList.contains('tool-wrapper')) {
          // --< START - array from the container containing the added element >--
          Array.from((item.children[1] || item.children[0]).children).forEach(
            (tools: any) => {
              //--< START- check the element of the tool >--
              switch (tools.tagName) {
                case 'svg':
                  appendEditElement({
                    parent: pdfScrappedData,
                    subParent: totalArray,
                    option: tools.children[0].getAttribute('options'),
                    elemScale: (tools as any).getAttribute('elemscale'),
                    elem: element,
                    type: tools.children[0].getAttribute('type'),
                    axisY: [
                      element.getBoundingClientRect().top,
                      item.getBoundingClientRect().top - pdfOffset_y,
                    ],

                    axisX: [
                      element.getBoundingClientRect().left,
                      item.getBoundingClientRect().left - pdfOffset_x,
                    ],
                    length: item.getBoundingClientRect().width,
                    svgImagePath: tools.children[0].getAttribute('svgToImage'),
                    svgWidth: tools.getBoundingClientRect().width,
                    svgHeight: tools.getBoundingClientRect().height,
                  })
                  break

                case 'BUTTON':
                  appendUserActionElement({
                    parent: pdfScrappedData,
                    subParent: totalArray,
                    uploaded: tools.getAttribute('uploaded'),
                    elem: element,
                    tool: tools,
                    axisY: [
                      element.getBoundingClientRect().top,
                      item.children[0].children[0].children[0].getBoundingClientRect()
                        .top - pdfOffset_y,
                    ],
                    axisX: [
                      element.getBoundingClientRect().left,
                      item.children[0].children[0].children[0].getBoundingClientRect()
                        .left - pdfOffset_x,
                    ],
                    axisX2: [
                      item.children[0].children[0].children[0].getBoundingClientRect()
                        .left,
                      item.children[0].children[0].children[0].getBoundingClientRect()
                        .right,
                    ],
                    axisY2: [
                      item.children[0].children[0].children[0].getBoundingClientRect()
                        .top,
                      item.children[0].children[0].children[0].getBoundingClientRect()
                        .bottom,
                    ],
                    type: tools.children[0].getAttribute('type'),
                  })
                  appendEditText({
                    // these action is only appended when the file action is SIGN
                    parent: pdfScrappedData,
                    subParent: totalArray,
                    axisY: [
                      element.getBoundingClientRect().top -
                      tools.children[0].getBoundingClientRect().height,
                      item.children[0].children[0].children[0].getBoundingClientRect()
                        .top - pdfOffset_y,
                    ],

                    axisX: [
                      element.getBoundingClientRect().left,
                      item.children[0].children[0].children[0].getBoundingClientRect()
                        .left - pdfOffset_x,
                    ],
                    attr: (item as any).getAttribute('style'),
                    tools: signLabel,
                    elem: element,
                    fontsize: '8',
                  })
                  break

                case 'DIV':
                  switch (tools.children[0]?.tagName) {
                    case 'svg':
                      //these gets all svg that is not DRAW and LINE as PNG
                      appendEditElement({
                        parent: pdfScrappedData,
                        subParent: totalArray,
                        elem: element,
                        axisY: [
                          element.getBoundingClientRect().top,
                          item.getBoundingClientRect().top - pdfOffset_y,
                        ],

                        axisX: [
                          element.getBoundingClientRect().left,
                          item.getBoundingClientRect().left - pdfOffset_x,
                        ],
                        svgWidth: tools.children[0].getBoundingClientRect()
                          .width,
                        svgHeight: tools.children[0].getBoundingClientRect()
                          .height,
                        svgImagePath: tools.children[0].children[0].getAttribute(
                          'svgToImage'
                        ),
                        type: 'DrawLine',
                      })
                      break
                    case 'P':
                      appendEditText({
                        parent: pdfScrappedData,
                        subParent: totalArray,
                        axisY: [
                          element.getBoundingClientRect().top,
                          item.getBoundingClientRect().top - pdfOffset_y,
                        ],

                        axisX: [
                          element.getBoundingClientRect().left,
                          item.getBoundingClientRect().left - pdfOffset_x,
                        ],
                        tools: tools.children[0].textContent,
                        elem: element,
                        fontsize: (tools.children[0] as any).getAttribute(
                          'style'
                        ),
                      })
                      break
                    case 'IMG':
                      appendEditImage({
                        parent: pdfScrappedData,
                        subParent: totalArray,
                        attr: (item as any).getAttribute('style'),
                        elemScale: (tools as any).getAttribute('elemscale'),
                        tools: tools.children[0].src,
                        elem: element,
                        axisY: [
                          element.getBoundingClientRect().top,
                          item.getBoundingClientRect().top - pdfOffset_y,
                        ],
                        axisY2: [
                          tools.children[0].getBoundingClientRect().top,
                          tools.children[0].getBoundingClientRect().bottom,
                        ],

                        axisX: [
                          element.getBoundingClientRect().left,
                          item.getBoundingClientRect().left - pdfOffset_x,
                        ],
                        axisX2: [
                          item.children[0].children[0].children[0].getBoundingClientRect()
                            .left,
                          item.children[0].children[0].children[0].getBoundingClientRect()
                            .right,
                        ],
                        height: tools.children[0].getBoundingClientRect()
                          .height,
                      })
                      appendEditText({
                        parent: pdfScrappedData,
                        subParent: totalArray,
                        axisY: [
                          element.getBoundingClientRect().top -
                          tools.children[0].getBoundingClientRect().height,
                          item.getBoundingClientRect().top - pdfOffset_y,
                        ],

                        axisX: [
                          element.getBoundingClientRect().left,
                          item.getBoundingClientRect().left - pdfOffset_x,
                        ],
                        tools: signLabel,
                        elem: element,
                        fontsize: '8',
                      })
                      break
                  }

                  break

                default:
                  console.log('it is default' + tools.tagName)
                  break
              }
            }
          ) //--<END - check the element of the tool >--
        } // --< END -  array from the container containig the added element >--
      })
    }
  })







  //<< -- code for form data component -->>
  let pdfPagesForm = document.querySelectorAll('.pdf-page')
  let totalArrayForm = Array.from(pdfPagesForm)
  totalArrayForm.forEach((element) => {
    Array.from(element.children).forEach((anotation) => {
      if (anotation.classList.contains('annotationLayer')) {
        // let inputs = document.querySelectorAll(".annotationLayer > input")
        let inputs = $('.annotationLayer').find(':input')
        Array.from(inputs).forEach((elementList: any) => {
          console.log(elementList.type)
          switch (elementList.type) {
            case 'text':
              ; (pdfScrappedData.data as any).push({
                type: 'PDFTextField',
                fieldName: elementList.name,
                value: elementList.value,
              })
              break
            case 'textarea':
              ; (pdfScrappedData.data as any).push({
                type: 'PDFTextField',
                fieldName: elementList.name,
                value: elementList.value,
              })
              break
            case 'date':
              ; (pdfScrappedData.data as any).push({
                type: 'PDFTextField',
                fieldName: elementList.name,
                value: elementList.value,
              })
              break
            case 'checkbox':
              ; (pdfScrappedData.data as any).push({
                type: 'PDFCheckBox',
                fieldName: elementList.name,
                isCheck: elementList.checked,
              })
              break
            case 'select-one':
              ; (pdfScrappedData.data as any).push({
                type: 'PDFDropdown',
                fieldName: elementList.name,
                value: elementList.value,
              })
              break
            case 'select':
              ; (pdfScrappedData.data as any).push({
                type: 'PDFDropdown',
                fieldName: elementList.name,
                value: elementList.value,
              })
              break
            case 'radio':
              ; (pdfScrappedData.data as any).push({
                type: 'PDFRadioGroup',
                fieldName: elementList.name,
                value: elementList.checked,
                checkedIndex: 0,
              })
              break

            default:
              break
          }
        })
      }
    })
  })

  return [pdfScrappedData, getToUserAction]
}
