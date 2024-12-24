import DefaultTemplate from '../PdfTemplates/default/index.js';
import KeralaTemplate from './kerala/index.js';
import GreenPdfView from "./green/index.js";
import MountainPdfView from  "./mountain/index.js";

export const defaultTemplate = {
    name: "Default",
    viewComponent: DefaultTemplate,
    thumbnail: "/Kerala2.png",
    width: '30%'
}
    
export const templatesMap = {
    "default": {
        name: "Default",
        viewComponent: DefaultTemplate,
        thumbnail: "/Kerala2.png",
        width: '30%'
    },
    "kerala": {
        name: "Kerala",
        viewComponent: KeralaTemplate,
        thumbnail: "/Kerala2.png",
        width: '30%'
    },
    "green": {
        name: "Green",
        viewComponent: GreenPdfView,
        thumbnail: "/Kerala2.png",
        width: '30%'
    },
    "mountain": {
        name: "Mountain",
        viewComponent: MountainPdfView,
        thumbnail: "/Kerala2.png",
        width: '30%'
    }
}

// how to run react-pdf in a web worker(separate thread)
// https://dev.to/simonhessel/creating-pdf-files-without-slowing-down-your-app-a42