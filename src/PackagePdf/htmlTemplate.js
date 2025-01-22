import React, { useState } from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font, PDFViewer } from '@react-pdf/renderer';
import { fromUnixTime, format } from 'date-fns';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { tr } from 'date-fns/locale';
import RefreshIcon from '@mui/icons-material/Refresh';
import { usePDF } from '@react-pdf/renderer';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSelector } from 'react-redux';

// import { templatesMap } from "../PdfTemplates/templateList.js";
import { DEFAULT_TEMPLATE_NAME } from '../Constants.js';
import ChangePdfDestImg from '../Commons/changePdfDestImg.js';

// Font.register({
//   family: 'Roboto',
//   fonts: [
//     {
//       src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf',
//     },
//     {
//       src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc9.ttf',
//       fontWeight: 'bold',
//     },
//   ],
// });

// const formatDate = (timestamp) => {
//   try {
//     console.log("time format  ", timestamp);
//     if (!timestamp) return 'N/A';
//     return format(new Date(timestamp || ''), 'dd-MMM-yyyy');
//   } catch (error) {
//     console.log("time format error ", error);
//   }

// };

// const HtmlPdfView = ({
//   reqData: {
//     req = {},
//   },
//   dayWiseData: {
//     hotels = [],
//     itiDesc = []
//   },
//   userData: {
//     phone,
//     logoB64Str,
//     email,
//     name,
//   },
//   userProfileData: {
//     themeData: {
//       primaryColor = "#b352d1",
//       secondaryColor = "#000000bf",
//       textPrimary = "#212121",
//       textSecondary = "#000000"
//     } = {},
//     headerImage,
//   },
//   totalPackPrice = ''
// }) => {
//   console.log("HOTELS_DETAILS", JSON.stringify(hotels));
//   console.log("pdf template render ", req, logoB64Str, hotels);
//   console.log("HEADERimg_check:", headerImage);
//   return (
//     <Document>
//       <Page style={styles.page} wrap={false}>
//         <View>
//         {headerImage && (
//             <Image
//               style={styles.headerImage}
//               src={headerImage}
//               resizeMode="cover"
//             />
//           )}

//           <View style={styles.body}>
//             {
//               logoB64Str && (<Image
//                 style={[styles.logo]}
//                 src={logoB64Str}
//                 resizeMode="contain"
//               />)
//             }
//             {/* <Image
//               style={[styles.logo]}
//               src={logoB64Str || 'https://png.pngtree.com/template/20191030/ourmid/pngtree-travel-logo-airplane-design-airplane-tickets-travel-agencies-image_325199.jpg'}
//               resizeMode="contain"
//               // debug
//             /> */}
//             <Text style={styles.title}>Travel Itinerary for {req?.destination || 'N/A'}</Text>

//             <View style={styles.infoBox}>
//               <View style={styles.infoRow}>
//                 <Text style={styles.label}>Lead Pax: </Text>
//                 <Text style={styles.value}>{req?.trackingId || 'N/A'}</Text>
//               </View>
//               <View style={styles.infoRow}>
//                 <Text style={styles.label}>Destination: </Text>
//                 <Text style={styles.value}>{req?.destination || 'N/A'}</Text>
//               </View>
//               <View style={styles.infoRow}>
//                 <Text style={styles.label}>Travel Date: </Text>
//                 <Text style={styles.value}>{formatDate(req?.startDate) || 'N/A'}</Text>
//               </View>
//               <View style={styles.infoRow}>
//                 <Text style={styles.label}>Guest: </Text>
//                 <Text style={styles.value}>{req?.totalAdultPax} Adults {req?.totalChildPax ? `| ${req?.totalChildPax} Children` : ''}</Text>
//               </View>
//             </View>

//             <View style={styles.hr} />

//             <View style={styles.sectionHeaderContainer}>
//               <Image style={styles.sectionIcon} src="/contactTitle.png" />
//               <View style={styles.sectionHeader}>
//                 <Text style={styles.sectionTitle}>  Emergency Contact</Text>
//               </View>
//             </View>
//             <View style={styles.emergencyContainer}>
//               <Text style={styles.emergencyText}>Agent Name: {name || 'N/A'}</Text>
//               <Text style={styles.emergencyText}>Phone: {phone || 'N/A'}</Text>
//             </View>

//             <View style={styles.hr} />
//           </View>
//         </View>
//       </Page>
//       <Page style={[styles.page, styles.page2]}>
//         {hotels.map((hotelsCurrDay, currDayIndex) => (
//           <View key={currDayIndex} style={styles.daySection}>
//             <View style={styles.dayHeader}>
//               <Text style={styles.dayTitle}>Day {currDayIndex + 1}</Text>
//             </View>
//             <View style={styles.sectionHeaderContainer}>
//               <Image style={styles.sectionIcon} src="/hotelTitle.png" />
//               <View style={styles.sectionHeader}>
//                 <Text style={styles.sectionTitle}>Hotels</Text>
//               </View>
//             </View>

//             {hotelsCurrDay.hotels.map((hotel, hotelIndex) => {
//               const { location, hotelName, selectedRooms = [] } = hotel;
//               console.log("pdf html hotel data", location, selectedRooms)
//               return (
//                 <View>

//                   <View key={hotelIndex}  style={styles.hotelContainer}>
//                     <View style={styles.hotelDetailsOuter}>
                        
//                       <View  style={styles.hotelDetails}>
//                         <Text style={styles.hotelName}>{hotelName}</Text>
//                         {selectedRooms.map((currRoom, roomIndex) => {
//                           const {
//                             roomName,
//                             selectedOccupancy: { adults = 0, child = 0, childAges = [] } = {},
//                             mp,
//                           } = currRoom;

//                           let mealPlan = '';
//                           if (mp === 'mapai') {
//                             mealPlan = 'Breakfast and (Lunch or Dinner)';
//                           } else if (mp === 'cpai') {
//                             mealPlan = 'Breakfast ONLY';
//                           } else if (mp === 'apai') {
//                             mealPlan = 'All meals (Breakfast, Lunch, and Dinner)';
//                           } else {
//                             mealPlan = 'No meal plan specified';
//                           }

//                           return (
//                             <View wrap={false} key={roomIndex} style={styles.roomDetails}>
//                               <Text style={styles.roomType}>{roomName}</Text>
//                               <Text style={styles.roomOccupancy}>
//                                 {adults} Adult{adults > 1 && 's'} {child ? `, ${child} Children` : ''}
//                               </Text>
//                               {childAges.some((child) => child.extraBed === 'true') && (
//                                 <Text style={styles.extraBedText}>With Extra Bed</Text>
//                               )}
//                               <Text style={styles.mealPlan}>Meal Plan: {mealPlan}</Text>
//                             </View>
//                           );
//                         })}


//                       </View>

//                       <Image
//                         style={styles.hotelImage}
//                         src="/hotelIcon.png"
//                         resizeMode="cover"
//                       />
//                     </View>
//                   </View>
//                   {itiDesc[currDayIndex]?.text && (
//                     <View wrap={false} style={styles.itiDescContainer}>
//                       <Text style={styles.itiDescTitle}>Itinerary Description for Day-{currDayIndex + 1}</Text>
//                       {itiDesc[currDayIndex].text.map((point, pointIndex) => (
//                         <Text key={pointIndex} style={styles.itiDescText}>{`${pointIndex + 1}. ${point}`}</Text>
//                       ))}
//                     </View>
//                   )}
//                 </View>
//               );
//             })}

//           </View>
//         ))}
//         <View style={styles.sectionHeaderContainer}>
//           <Image style={styles.sectionIcon} src="/transferTitle.png" />
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Transfer</Text>
//           </View>
//         </View>
//         <View style={styles.transferContainer}>
//           <Text style={styles.transferText}>
//             {`All tours and transfers are on private basis. A comfortable and clean ${req?.cabType || 'Vehichle'} will pick you up from ${req?.pickUp}.`}
//           </Text>
//         </View>
//         <View style={styles.hr} />
//         <View style={styles.sectionHeaderContainer}>
//           <Image style={styles.sectionIcon} src="/exclusionTitle.png" />
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Exclusions</Text>
//           </View>
//         </View>
//         <View style={styles.exclusionContainer}>
//           <Text style={styles.bullet}>• All personal expenses like tips, laundry, telephone calls/fax, alcoholic beverages, camera/video camera fees at monuments, medical expenses, airport departure tax, etc.</Text>
//           <Text style={styles.bullet}>• Anything not mentioned under Package Inclusions</Text>
//           <Text style={styles.bullet}>• Cost incidental to any change in the itinerary/stay due to flight cancellation due to bad weather, ill health, and roadblocks, and/or any factors beyond control.</Text>
//           <Text style={styles.bullet}>• Return flight/train fare</Text>
//           {/* <Text style={styles.bullet}>• AC will work from 9 pm to 6 am on the houseboat and houseboat check-out time is 9 am. If needed to use AC service at other times, INR 2000 to be paid directly at the Houseboat (For Deluxe Houseboat)</Text> */}
//           <Text style={styles.bullet}>• Domestic/International hotel check-in is at 1400 hrs and checkout is at 1200 hrs. Early check-in and late checkout are subject to availability and consent of the hotel.</Text>
//         </View>

//         <View style={styles.priceSection}>
//           <Text style={styles.priceTitle}>Total Package Price</Text>
//           <Text style={styles.totalPrice}>{`INR ${totalPackPrice || 'N/A'}`}</Text>
//         </View>

//         <View style={styles.footerContainer}>
//           {
//             logoB64Str && (<Image style={styles.footerLogo} src={logoB64Str} resizeMode="contain" />)
//           }
//           {/* <Image style={styles.footerLogo} src={logoB64Str} resizeMode="contain" /> */}
//           <View style={styles.footerDetails}>
//             <Text style={styles.footerText}>{req?.address}</Text>
//             <Text style={styles.footerText}>Email: {email}</Text>
//             <Text style={styles.footerText}>Phone: {phone}</Text>
//           </View>
//         </View>

//         <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
//       </Page>
//     </Document>
//   )
// };

// const styles = StyleSheet.create({
//   page: {
//     fontFamily: 'Roboto',
//     fontSize: 12,
//     backgroundColor: '#ffffff',  //'#f5f5f5',
//   },
//   page2: {
//     padding: '8px',
//   },
//   headerImage: {
//     width: '100%',
//     height: 200,
//     objectFit: 'cover',
//     marginBottom: 1,
//   },
//   logo: {
//     width: 100,
//     height: 'auto',
//     alignSelf: "center",
//   },
//   image: {
//     marginVertical: 15,
//     marginHorizontal: 100,
//     width: 100,
//     alignSelf: 'center',
//   },
//   body: {
//     paddingBottom: 65,
//     paddingHorizontal: 20,
//     backgroundColor: '#ffffff',
//     paddingTop: 15,
//   },
//   title: {
//     fontSize: 25,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 20,
//     marginTop: 5,
//   },
//   itiTextContainer: {
//     marginVertical: 5,
//     padding: 8,
//     backgroundColor: '#ffffff',
//     borderRadius: 3,
//   },
//   infoBox: {
//     marginVertical: 10,
//     padding: 15,
//     width: '100%',
//     backgroundColor: '#0D3B66',
//     color: '#ffffff',
//     borderRadius: 5,
//     marginBottom: 30,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     marginVertical: 3,
//   },
//   label: {
//     fontSize: 15,
//     fontWeight: 'bold',
//     marginRight: 5,
//     color: '#ffffff',
//   },
//   value: {
//     fontSize: 15,
//     color: '#ffffff',
//     flex: 1,
//   },
//   hr: {
//     borderBottomWidth: 1,
//     borderBottomColor: '#dddddd',
//     marginVertical: 15,
//     width: '100%',
//   },
//   sectionHeaderContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 30,
//     marginTop: 20,
//   },
//   sectionHeader: {
//     flex: 1,
//     backgroundColor: '#b352d1',
//     padding: 10,
//     borderRadius: 5,
//     marginLeft: 10,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#ffffff',
//   },
//   sectionIcon: {
//     width: 25,
//     height: 25,
//   },
//   daySection: {
//     marginBottom: 20,
//     pageBreakInside: 'avoid',
//   },
//   dayHeader: {
//     // backgroundColor: '#B8E0D2',
//     padding: 3,
//     borderRadius: 3,
//     marginVertical: 8,
//     alignSelf: 'flex-start',
//   },
//   dayTitle: {
//     fontSize: 15,
//     fontWeight: 'bold',
//     color: '#333333',
//   },
//   emergencyContainer: {
//     marginLeft: 10,
//     padding: 10,
//     backgroundColor: '#e8f4f8',
//     borderRadius: 5,
//   },
//   emergencyText: {
//     fontSize: 15,
//     color: '#333333',
//     lineHeight: 1.5,
//   },
//   hotelContainer: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginBottom: 15,
//     padding: 10,
//     borderRadius: 5,
//     borderWidth: 1,
//   },
//   hotelImage: {
//     width: 80,
//     height: 80,
//     marginLeft: 30,
//     marginRight:15,
//     marginTop: 20,
//     borderRadius: 5,
//     resizeMode: 'cover',
//   },
//   hotelDetails: {
//     flex: 1,
//     flexDirection: 'column',
//   },
//   hotelDetailsOuter: {
//     flex: 1,
//     flexDirection: 'row',
//   },
//   hotelName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 5,
//     color: '#0D3B66',
//   },
//   roomDetails: {
//     marginVertical: 5,
//     padding: 8,
//     backgroundColor: '#f9f9f9',
//     borderRadius: 3,
//     pageBreakInside: 'avoid',
//   },
//   roomType: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginBottom: 2,
//     color: '#333333',
//   },
//   roomOccupancy: {
//     fontSize: 12,
//     color: '#555555',
//   },
//   mealPlan: {
//     fontSize: 12,
//     color: '#555555',
//   },
//   exclusionContainer: {
//     marginLeft: 10,
//   },
//   bullet: {
//     fontSize: 12,
//     marginVertical: 1,
//     lineHeight: 1.5,
//     color: '#555555',
//   },
//   priceSection: {
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//     padding: 15,
//     // backgroundColor: '#e0e0e0',
//     borderWidth: 1,
//     borderRadius: 5,
//   },
//   priceTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333333',
//     // marginBottom: 5,
//     // margin: 'auto'
//   },
//   totalPrice: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#0D3B66',
//     textAlign: 'center',
//   },
//   transferContainer: {
//     marginLeft: 10,
//     padding: 10,
//     backgroundColor: '#e8f4f8',
//     borderRadius: 5,
//   },
//   transferText: {
//     fontSize: 12,
//     color: '#333333',
//     lineHeight: 1.5,
//   },
//   exclusionSection: {
//     marginTop: 10,
//   },
//   itiDescContainer: {
//     marginVertical: 10,
//     padding: 10,
//     backgroundColor: 'white',
//     borderRadius: 5,
//   },
//   itiDescTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   itiDescText: {
//     fontSize: 14,
//     marginBottom: 3,
//   },
//   footerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 15,
//     marginTop: 30,
//     borderTopWidth: 1,
//     // borderTopColor: '#dddddd',
//     // backgroundColor: '#f0f0f0',
//   },
//   footerLogo: {
//     width: 80,
//     height: 80,
//     objectFit: 'contain',
//     resizeMode: 'contain',
//   },
//   footerDetails: {
//     flexDirection: 'column',
//     justifyContent: 'center',
//     flex: 1,
//     marginLeft: 20,
//   },
//   footerText: {
//     fontSize: 10,
//     color: '#333333',
//     marginBottom: 4,
//   },
//   pageNumber: {
//     position: 'absolute',
//     fontSize: 10,
//     bottom: 5,
//     left: 0,
//     right: 0,
//     textAlign: 'center',
//     color: 'grey',
//   },
// });

const RenderPreview = (props) => {
  console.log("RenderPreview ", props);
  const {
    reqData: {
      req = {}
    },
    userData: {
      templateName = DEFAULT_TEMPLATE_NAME  
    } = {},
    setHeaderImage,
    templatesMap = {}
  } = props;
  const [reloadPdfView, setReloadPdfView] = useState(true);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const firebaseIdToken = useSelector((state) => state.packBuilderData.fbIdToken) || null;
  const [selectedTemplate, setSelectedTemplate] = useState(templateName);
  
  let TemplateView = templatesMap[selectedTemplate.toLowerCase()]?.viewComponent;
  // const [instance, updateInstance] = usePDF({ document: TemplateView });
  console.log("user template ", templateName, selectedTemplate, props);
  // let TemplateView = templatesMap[templateName.toLowerCase()]?.viewComponent;
  // if(process.env.NODE_ENV == 'development' && !reloadPdfView) TemplateView = null;

  const handleRefresh = () => {
    setReloadPdfView(false);
    setTimeout(() => setReloadPdfView(true), 1000);
  }

  const changeTemplate = () => {
    let templateNameArr = Object.keys(templatesMap);
    let newTemplate = templateNameArr[ Math.floor(Math.random() * templateNameArr.length) ] || '';
    if(newTemplate) setSelectedTemplate(newTemplate)
  }

  return (<div style={{ width: '100%', height: 'auto' }}>
    <Box display="flex" justifyContent="space-between">
      <Typography variant="h6" textAlign={'center'}>Pdf Preview</Typography>&nbsp;
      <Box display={'flex'}>
        {/* {process.env.NODE_ENV == 'development' && <Button variant="text" size="small" onClick={handleRefresh}><RefreshIcon fontSize='small' />Refresh PDF</Button>} */}
        <Button variant="text" size="small" onClick={changeTemplate}><RefreshIcon fontSize='small' />Change Template</Button>
        &nbsp;
        <ChangePdfDestImg destination={req?.destination} firebaseIdToken={firebaseIdToken} setHeaderImage={setHeaderImage} />
      </Box>
    </Box>
    {/* &nbsp; */}
    {/* <a href={instance.url} download="af-test.pdf">
      Download
    </a> */}
    {
      reloadPdfView && (<PDFViewer width={'100%'} height={'800'}>
        {/* <HtmlPdfView {...props} /> */}
        <TemplateView {...props} />
      </PDFViewer>)
    }
  </div>)
};

export default RenderPreview;