import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';

import destImagesMap from '../PackagePdf/destPdfImagesMap.js';
import { selectPdfImgB64 } from '../Utility.js';

const ChangePdfDestImg = ({ destination = null, firebaseIdToken = null, setHeaderImage }) => {
    // const [currPdfImg, setCurrPdfImg] = useState(null);

    const getData = async () => {
        let dest = destination.toLowerCase();
        // if(destImagesMap[dest]) {
            let res = await selectPdfImgB64({ dest, firebaseIdToken });
            let {b64Data, err} = res
            console.log("change pdf image clicked ", b64Data, err)
            if(!err) setHeaderImage(b64Data);
        // }
    }

    console.log("change pdf render ", destination, firebaseIdToken)
    if(!destination || !firebaseIdToken) return null;
    return (
        <Button
            size="small"
            variant="text"
            onClick={getData}
        >Change Image</Button>
    )
}

export default ChangePdfDestImg;