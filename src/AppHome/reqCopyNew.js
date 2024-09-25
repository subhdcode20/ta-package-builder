import React, { useEffect, useState } from 'react'
import AppHome from '.'
import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const ReqCopyNew = () => {
    const { reqId } = useParams();
    const [reqData, setReqData] = useState(null);

    useEffect(() => {
        const fetchReqData = async () => {
            try {
                const docRef = doc(db, 'requests', reqId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setReqData(docSnap.data());
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching document:', error);
            }
        };

        if (reqId) {
            fetchReqData(); // Call the function to fetch data when reqId is available
        }
    }, [reqId]);
    console.log("REQDATA COPYNEW:", reqData)
    // let checkFlow = (!reqData) ? false : true
    let checkFlow = true;
    return (
        <div>
            <AppHome requestData = {reqData} copyNew= {checkFlow}/>
        </div>
    )
}

export default ReqCopyNew
