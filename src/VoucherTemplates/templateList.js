import BasicPdfView from "./Default/index.js";
import MountainPdfView from "./mountain/index.js";
import SimplicityPdfView from "./simplicity/index.js";

export const defaultTemplate = {
    name: "Default",
    viewComponent: BasicPdfView,
    thumbnail: "/Kerala2.png",
    width: '30%'
}
    
export const templatesMap = {
    "mountain": {
        name: "Mountain",
        viewComponent: MountainPdfView,
        thumbnail: "https://firebasestorage.googleapis.com/v0/b/agentflow-d0eec.firebasestorage.app/o/utility%2FMountain-thumbnail-big.jpg?alt=media&token=f8e5faec-e105-468d-a916-6d75e421b3d3",  //"/mountain-thumbnail.jpg",
        exPdf: "",
        width: '30%'
    },
    "default": {
        name: "Green",
        viewComponent: BasicPdfView,
        thumbnail: "https://firebasestorage.googleapis.com/v0/b/agentflow-d0eec.firebasestorage.app/o/utility%2Fgreen-thumbnail-big.jpg?alt=media&token=3195c7db-dbd3-4ac2-970f-e401adc8da3c",  //"/green-thumbnail.jpg",
        exPdf: "",
        width: '30%'
    },
    "simplicity": {
        name: "Simplicity",
        viewComponent: SimplicityPdfView,
        thumbnail: "https://firebasestorage.googleapis.com/v0/b/agentflow-d0eec.firebasestorage.app/o/utility%2FSc-simplicty-thumbnail.jpg?alt=media&token=74a6798a-f487-453e-a2a3-049de02bfc0b",
        exPdf: "",
        width: '30%',
    },
}

// how to run react-pdf in a web worker(separate thread)
// https://dev.to/simonhessel/creating-pdf-files-without-slowing-down-your-app-a42