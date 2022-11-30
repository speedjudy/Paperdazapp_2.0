   


//THESE FILE IS NOT IN USE ANY MORE





    export const  formatStyleTop = (x: string, String: string) => {
        let sliceString = String.substring(
          String.indexOf(x) + x.length + 1,
          String.indexOf('px')
        )
        return Number(sliceString.trim())
      }

      let formatStyleLeft = (x: string, String: string) => {
        let sliceString = String.substring(
          String.indexOf(x) + x.length + 1,
          String.lastIndexOf('px')
        )
        return Number(sliceString.trim())
      }
   
     export const  appendEditElement = (
        parent: any,
        subParent: any,
        attr: any,
        tools: any,
        elem: any
      ) => {
        ;(parent.data as any).push({
          page_number: subParent.indexOf(elem),
          y: formatStyleTop('top', attr),
          x: formatStyleLeft('left', attr),
          svgPath: tools,
          type: "Annotation",
        })
      }
   
   
     export const  appendEditText = (
        parent: any,
        subParent: any,
        attr: string,
        tools: any,
        elem: any,
        fontsize: string
      ) => {
        ;(parent.data as any).push({
          page_number: subParent.indexOf(elem),
          y: formatStyleTop('top', attr),
          x: formatStyleLeft('left', attr),
          type: 'DrawText',
          text: tools,
          fontSize: formatStyleTop('font-size', fontsize) 
        })
      }


     export const  appendEditTextInput = (
        parent: any,
        subParent: any,
        attr: string,
        tools: any,
        elem: any,
        fontsize: string
      ) => {
        ;(parent.data as any).push({
          page_number: subParent.indexOf(elem),
          y: formatStyleTop('top', attr),
          x: formatStyleLeft('left', attr),
          type: 'DrawText',
          text: tools,
          fontSize: formatStyleTop('font-size', fontsize) 
        })
      }
  

   export const scrapPdfData = (downloadLink: string) : object =>{
    
    let pdfScrappedData = {
        pdf_url: (downloadLink || ''),
        data: [],
      }

      let pdfPages = document.querySelectorAll('.pdf-single-page-outer')
      let totalArray = Array.from(pdfPages)

      totalArray.forEach((element) => {
        if (element.children.length > 1) {
          
          //--< formed array from the children element >--
          Array.from(element.children).forEach((item) => {
            if (item.classList.contains('tool-wrapper')) {

              // --< START - array from the container containing the added element >--
              Array.from(item.children[1].children).forEach((tools: any) => {


        //--<START- check the element of the tool >--
        switch (tools.tagName) {
          case 'svg':
              appendEditElement(
              pdfScrappedData,
              totalArray,
              (item as any).getAttribute('style'),
              tools.children[0].getAttribute('d'),
              element
            )
            break

              case 'DIV':
                  switch (tools.children[0].tagName) {
                    case 'INPUT':
                  //   appendEditTextInput(
                //     pdfScrappedData,
                //     totalArray,
                //     (item as any).getAttribute('style'),
                //     tools.children[0].value,
                //     element,(tools.children[0] as any).getAttribute('style'),
                  //   )
                        break;
                     case 'svg':
                        appendEditElement(
                        pdfScrappedData,
                        totalArray,
                        (item as any).getAttribute('style'),
                        tools.children[0].children[0].getAttribute('d'),
                        element
                        )
                        break;
                     case "P":
                        appendEditText(
                        pdfScrappedData,
                        totalArray,
                        (item as any).getAttribute('style'),
                        tools.children[0].textContent,
                        element,
                        (tools.children[0] as any).getAttribute('style'),
                      )
                      break; }
                    
                    break;

                  default:
                    console.log('it is default' + tools.tagName)
                    break
                }
               

              })   //--<END - check the element of the tool >--
              
            }  // --< END -  array from the container containig the added element >--

          })
        }
      })


         return pdfScrappedData
   }