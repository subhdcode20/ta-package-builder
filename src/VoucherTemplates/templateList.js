import BasicPdfView from "./Basic/index.js";

export const defaultTemplate = {
    name: "Default",
    viewComponent: BasicPdfView,
    thumbnail: "/Kerala2.png",
    width: '30%'
}
    
export const templatesMap = {
    // "default": {
    //     name: "Default",
    //     viewComponent: DefaultTemplate,
    //     thumbnail: "/Kerala2.png",
    //     width: '30%'
    // },
    "basic": {
        name: "Basic",
        viewComponent: BasicPdfView,
        thumbnail: "https://firebasestorage.googleapis.com/v0/b/agentflow-d0eec.firebasestorage.app/o/utility%2Fgreen-thumbnail-big.jpg?alt=media&token=3195c7db-dbd3-4ac2-970f-e401adc8da3c",  //"/green-thumbnail.jpg",
        examplePdf: "",
        width: '30%'
    }
}

// how to run react-pdf in a web worker(separate thread)
// https://dev.to/simonhessel/creating-pdf-files-without-slowing-down-your-app-a42