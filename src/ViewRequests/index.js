import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    doc,
    getDoc,
    setDoc,
    onSnapshot,
} from "firebase/firestore";
import loadable from '@loadable/component';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { db, auth } from "../firebaseConfig";
import { isEmptyObject } from '../Utility.js';
import { nanoid } from 'nanoid';
// import ReqsTable from "./reqsTable.js";

const ReqsTable = loadable(
    () => import('./reqsTable.js'), 
    { 
      fallback: <p>OOps...</p>
    }
  );

const ViewRequest = () => {
    const [userReqList, setUserReqList] = useState([]);
    const userData = useSelector((state) => state.packBuilderData.userData) || {};
    // const reqList = useSelector((state) => state.packBuilderData.reqHistory);

    useEffect(() => {
		const getReqs = async () => {
			// let docSnap = await getDoc(doc(db, "userPackages", userData.phone));
            // if (docSnap.exists()) {
			// 	console.log("user hotels data ", docSnap.data());
			// 	setUserReqList(docSnap.data());
			// } else {
			// 	console.error(`User Req list not forund for ${userData.phone}`);
			// 	// TODO show page error
			// 	return null;
			// }

            // const q = query(doc(db, "userPackages", userData.phone));
        
              const unsubscribe = await onSnapshot(
                doc(db, "userPackages", userData.phone),
                async (snapshot) => {
                  // ...
                  if (!snapshot.exists()) return;
                  let data = snapshot.data();
                  console.log("snapshot", data, data.packagesList, snapshot);
                  let userReqIdList = data.packagesList.map((i) => {
                    return getDoc(doc(db, "requests", i));
                  });
                  let response = await Promise.all(userReqIdList);
                  console.log("snapshot response", response, response.map(i => i.data()), userReqIdList);
                  setUserReqList(response.map(i => {
                    return {
                        id: nanoid(5), 
                        ...i.data()
                    }
                }));
                //   setReqs(
                //     data.sort(
                //       (a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0),
                //     ),
                //   );
                //   checkExpiredReqs(data);
                },
                (error) => {
                  console.log("user req list error", error);
                },
              );
        
              return unsubscribe;


			// if (docSnap.exists()) {
			// 	console.log("booking user data ", docSnap.data());
			// 	// setBookingPartnerDetails(docSnap.data());
			// 	// setReqData(docSnap.data());
			// 	setTimeout(() => {
			// 		// dispatch(setPrevReqs({reqData: docSnap.data()}));
			// 	});
			// } else {
			// 	console.error(`Req details not forund for ${reqId}`);
			// 	// TODO show page error
			// 	return null;
			// }
		}

		getReqs();
	}, [])

    return (<>
      <Box sx={{"display": "flex", mb: 2}}>
        <Typography variant="h6" sx={{margin: 'auto'}}><b>Your Request History</b></Typography>
      </Box>
      { userReqList && (<ReqsTable reqsList={userReqList} />) }
    </>)
}

export default ViewRequest;