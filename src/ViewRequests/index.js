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
import { useUrlParams } from '../Utility.js';
import { nanoid } from 'nanoid';
import  Button from '@mui/material/Button';
// import ReqsTable from "./reqsTable.js";

const ReqsTable = loadable(
    () => import('./reqsTable.js'), 
    { 
      fallback: <p>Loading...</p>
    }
  );

const ViewRequest = () => {
    const [userReqList, setUserReqList] = useState([]);
    const userData = JSON.parse(localStorage.getItem("user"));
    const urlParamsData = useUrlParams();
    // const reqList = useSelector((state) => state.packBuilderData.reqHistory);
    console.log("USER_WHOLEDATA", userData.phone, urlParamsData.get('reqId'), typeof urlParamsData, urlParamsData?.reqId);

    useEffect(() => {
      const getReqs = async () => {
        console.log('view my reqs ', userData.phone)
        const unsubscribe = await onSnapshot(
          doc(db, "userRequests", userData.phone),
          async (snapshot) => {
            // ...
            if (!snapshot.exists()) return;
            let data = snapshot.data() || {};
            let { reqsList = [] } = data;
            if(reqsList || reqsList.length > 0) {
              console.log("snapshot reqs", data, reqsList, snapshot);
              let userReqIdList = reqsList.map((i) => {
                return getDoc(doc(db, "requests", i));
              });
              let response = await Promise.all(userReqIdList);
              let userReqsData = response.map(i => {
                let itemData = i.data();
                return {
                  ...itemData,
                  id: itemData.reqId
                }
              })
              console.log("snapshot response", userReqsData, response.map(i => i.data()), userReqIdList);
              let sortedRes = userReqsData.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
              setUserReqList(sortedRes);
            }
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

		if(userData.phone) getReqs();
	}, [])

    return (<>
      <Box sx={{"display": "flex", mb: 2}}>
        <Typography variant="h6" sx={{margin: 'auto'}}><b>Your Request History</b></Typography>
      </Box>
      { userReqList && (<ReqsTable reqsList={userReqList} />) }
        
    </>)
}

export default ViewRequest;