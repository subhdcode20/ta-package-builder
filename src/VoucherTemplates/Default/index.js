import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font, PDFViewer, Link } from '@react-pdf/renderer';
import { fromUnixTime, format } from 'date-fns';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { tr } from 'date-fns/locale';
import { isEmptyObject } from '../../Utility.js';
import { MEAL_PLAN_LABEL } from '../../Constants.js';

Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf',
    },
    {
      src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc9.ttf',
      fontWeight: 'bold',
    },
  ],
});

const formatDate = (timestamp) => {
  try {
    console.log("time format  ", timestamp);
    if (!timestamp) return 'N/A';
    return format(new Date(timestamp || ''), 'dd-MMM-yyyy');
  } catch (error) {
    console.log("time format error ", error);
  }

};

let _defaultHeaderImage = 'https://media.istockphoto.com/id/154232673/photo/blue-ridge-parkway-scenic-landscape-appalachian-mountains-ridges-sunset-layers.jpg?s=612x612&w=0&k=20&c=m2LZsnuJl6Un7oW4pHBH7s6Yr9-yB6pLkZ-8_vTj2M0='
const HtmlPdfView = ({
  reqData: {
    req = {},
  },
  dayWiseData: {
    flights = {},
    hotels = [],
    itiDesc = []
  },
  voucherData: {
    bookingConfirmId = '',
    hotelConfirmIds = [],
    transferConfirmIds = [],
    ssConfirmIds = [],
    arrConfirmId = [],
    depConfirmId = []
    // flightsConfirmId = ''
  },
  userData: {
    phone,
    logoB64Str,
    email,
    companyName,
    address,
    companyInfo = {},
    paymentDetails = {},
    socialMediaDetails = {}
  },
  userProfileData: {
    themeData = {},
    headerImage,
    cancellationData = [],
    paymentPolicy = [],
    inclusions = [],
    exclusions = [],
    aboutDestText = ''
  },
  totalPackPrice = ''
}) => {
  console.log("Vouch HOTELS_DETAILS", JSON.stringify(hotels));
  console.log("Vouch pdf template render ", bookingConfirmId, hotelConfirmIds, transferConfirmIds, ssConfirmIds); //req, logoB64Str, hotels, 
  // console.log("Vouch HEADERimg_check default:", headerImage, _defaultHeaderImage, cancellationData);
  // console.log("Vouch CHECK_ABOUT:", headerImage); //aboutDestText
  const styles = getThemedStyles(themeData) || null;

  const confirmIdData = [
    {
      key: "bookingConfirmId",
      label: "Booking Confirmation",
      value: bookingConfirmId,
      type: 'string'
    },
    {
      key: "arrConfirmId",
      label: "Arrival Confirmation",
      value: arrConfirmId,
      type: 'string'
    },
    {
      key: "hotelConfirmId",
      label: "Hotel Confirmations",
      value: hotelConfirmIds,
      type: 'array'
    },
    {
      key: "transfersConfirmId",
      label: "Transfer Confirmations",
      value: transferConfirmIds,
      type: 'array'
    },
    {
      key: "ssConfirmId",
      label: "Sightseeing Confirmations",
      value: ssConfirmIds,
      type: 'array'
    },
    {
      key: "depConfirmId",
      label: "Departure Confirmation",
      value: depConfirmId,
      type: 'string'
    },
    // {
    //   key: "ssConfirmId",
    //   label: "Sightseeing Confirmations",
    //   value: ssConfirmId
    // }
  ]

  if (!styles) return null;
  return (
    <Document>
      <Page style={styles.page} wrap={false}>
        <View style={{height:'100%'}} >
          {/* {headerImage && (
            <Image
              style={styles.headerImage}
              src={headerImage}
              resizeMode="cover"
            />
          )} */}
          <Image
            style={styles.headerImage}
            src={headerImage || _defaultHeaderImage}
            resizeMode="cover"
          />

          {
            logoB64Str && (<Image
              style={[styles.logo]}
              src={logoB64Str}
              resizeMode="contain"
            />)
          }
          <View style={styles.body}>
            {/* <View style={styles.headerText}> */}
            <Text style={styles.title}>Travel Voucher</Text>
            {/* </View> */}

            <View style={styles.infoBox}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Lead Passenger: </Text>
                <Text style={styles.value}>{req?.trackingId || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Destination: </Text>
                <Text style={styles.value}>{req?.destination || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Travel Date: </Text>
                <Text style={styles.value}>{formatDate(req?.startDate) || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Guests: </Text>
                <Text style={styles.value}>{req?.totalAdultPax} Adults {req?.totalChildPax ? `| ${req?.totalChildPax} Children` : ''}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Confirmation Id: </Text>
                <Text style={styles.value}>{bookingConfirmId || '-'}</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>

      <Page style={[styles.page, styles.page2]} >
        {
          headerImage && (<Image
            style={styles.backgroundImage}
            src={headerImage || _defaultHeaderImage}
            fixed
          />)
        }
        {
          confirmIdData.map(( data, confirmIdIndex) => {
            // let hotelsCurrDay = currDayIndex < hotels.length ? hotels[currDayIndex].hotels : [];
            if(!data?.value || (Array.isArray(data?.value) && data?.value.length == 0)) return null;
            return (<View key={confirmIdIndex} style={styles.daySection} wrap={false}>
              <View style={styles.boxContainer}>
                {/* Upper Half */}
                <View style={styles.upperBox}>
                  <Text style={styles.dayTitle}>{data?.label}</Text>
                </View>

                {/* Lower Half */}
                {data?.value && data?.type == 'string' && (
                  <View style={styles.lowerBox}>
                    <Text style={styles.itiDescText}>{data?.value}</Text>
                    {/* {itiDesc[currDayIndex].text.map((point, pointIndex) => (
                      <Text key={pointIndex} style={styles.itiDescText}>
                        {`${pointIndex + 1}. ${point}`}
                      </Text>
                    ))} */}
                  </View>
                )}
                {data?.value && data?.type == 'array' && (
                  <View style={styles.lowerBox}>
                    {(data?.value || []).map((point, pointIndex) => (
                      <Text key={pointIndex} style={styles.itiDescText}>
                        {`${pointIndex + 1}. ${point?.text}`}
                      </Text>
                    ))}
                  </View>
                )}
                {logoB64Str && (
                  <Image style={styles.logoInContainer} src={logoB64Str} resizeMode="contain" />
                )}
              </View>
            </View>)
          })
        }
      </Page>

      <Page style={styles.page} wrap={false}>
        <View style={{height: '100%'}}>
          {/* Left Column - Image */}
          {
            headerImage && (
              <Image
                source={{ uri: headerImage || _defaultHeaderImage }}
                // 'https://media.istockphoto.com/id/154232673/photo/blue-ridge-parkway-scenic-landscape-appalachian-mountains-ridges-sunset-layers.jpg?s=612x612&w=0&k=20&c=m2LZsnuJl6Un7oW4pHBH7s6Yr9-yB6pLkZ-8_vTj2M0='
                style={[{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }]}
              />
            )
          }

          <View style={{
            position: 'absolute',
            right: 0, 
            width: '60%',
            height: '100%', 
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: 20,
            backgroundColor: '#30746c',
          }}>
            <Text style={{fontSize: 30, fontWeight: 'extrabold', letterSpacing: 3, marginBottom: 30, textAlign: 'left', color: '#84bfb9'}}>
              About {req?.destination}
            </Text>
            <Text style={{fontSize: 15, textAlign: 'left', lineHeight: 1.2, letterSpacing: 1, fontWeight: 'extralight', color: 'white'}}>
              {aboutDestText}
            </Text>
          </View>
        </View>

      </Page>

      <Page style={[styles.page, styles.page2]} >
        {
          headerImage && (<Image
            style={styles.backgroundImage}
            src={headerImage || _defaultHeaderImage}
            fixed
          />)
        }
        {itiDesc.map((itiCurrDay, currDayIndex) => {
          let hotelsCurrDay = currDayIndex < hotels.length ? hotels[currDayIndex].hotels : [];
          return (<View key={currDayIndex} style={styles.daySection} wrap={false}>
            <View style={styles.boxContainer}>
              {/* Upper Half */}
              <View style={styles.upperBox}>
                <Text style={styles.dayTitle}>Day {currDayIndex + 1}</Text>
                {hotelsCurrDay.map((hotel, hotelIndex) => {
                  const { hotelName, location, selectedRooms = [] } = hotel;
                  return (
                    <View key={hotelIndex} style={styles.hotelDetailsContainer}>
                      <Text style={styles.hotelName}>Hotel: <Text style={styles.hotelName1}>{hotelName}</Text></Text>
                      <Text style={styles.destinationName}>Destination: <Text style={styles.destinationName1}>{location}</Text></Text>
                      {selectedRooms.map((currRoom, roomIndex) => {
                        const {
                          roomName,
                          selectedOccupancy: { adults = 0, child = 0 } = {},
                          mp,
                        } = currRoom;

                        let mealPlan = MEAL_PLAN_LABEL[mp] || 'No meal plan specified';

                        return (
                          <View key={roomIndex} style={styles.roomDetails}>
                            <Text style={styles.roomInfo}>Room: <Text style={styles.roomInfo1}>{roomName}</Text> <Text style={styles.roomOccupancy}>
                              ({adults} Adult{adults > 1 && 's'} {child ? `| ${child} Children` : ''})
                            </Text></Text>
                            <Text style={styles.mealPlan}>Meal Plan: {mealPlan}</Text>
                          </View>
                        );
                      })}
                    </View>
                  );
                })}
              </View>

              {/* Lower Half */}
              {itiDesc[currDayIndex]?.text && (
                <View style={styles.lowerBox}>
                  <Text style={styles.itiDescTitle}>Day {currDayIndex + 1} Itinerary</Text>
                  {itiDesc[currDayIndex].text.map((point, pointIndex) => (
                    <Text key={pointIndex} style={styles.itiDescText}>
                      {`${pointIndex + 1}. ${point}`}
                    </Text>
                  ))}
                </View>
              )}
              {logoB64Str && (
                <Image style={styles.logoInContainer} src={logoB64Str} resizeMode="contain" />
              )}
            </View>
          </View>)
        }
        )}

        <View style={styles.boxContainer2} wrap={false} break>
          {
            !isEmptyObject(flights) && (<>
              <Text style={styles.InfoTitle1}>Flights</Text>
              <View style={styles.transferContainer}>
                <Text style={styles.transferText}>
                  {`${flights?.arr ? `Arrival Flight: ${flights?.arr}.` : ''}`}
                </Text>
                <Text style={styles.transferText}>
                  {`${flights?.dep ? `Departure Flight: ${flights?.dep}.` : ''}`}
                </Text>
              </View>
            </>)
          }
          <Text style={styles.InfoTitle1}>Transfer</Text>
          <View style={styles.transferContainer}>
            <Text style={styles.transferText}>
              {`All tours and transfers are on private basis. A comfortable and clean ${req?.cabType || 'Vehichle'} will pick you up from ${req?.pickUp}.`}
            </Text>
          </View>
          {logoB64Str && (
            <Image style={styles.logoInContainer} src={logoB64Str} resizeMode="contain" />
          )}
        </View>

        {/* <View style={styles.boxContainer2} wrap={false}>
          <Text style={styles.InfoTitle}>Transfer</Text>
          <View style={styles.transferContainer}>
            <Text style={styles.transferText}>
              {`All tours and transfers are on private basis. A comfortable and clean ${req?.cabType || 'Vehichle'} will pick you up from ${req?.pickUp}.`}
            </Text>
          </View>
          {logoB64Str && (
            <Image style={styles.logoInContainer} src={logoB64Str} resizeMode="contain" />
          )}
        </View> */}

        {
          inclusions && inclusions.length > 0 && (<>
            <View style={styles.boxContainer3} wrap={false} break>
              <Text style={styles.InfoTitle}>Inclusions</Text>
              <View style={styles.exclusionContainer}>
                {
                  inclusions.map((item, index) => {
                    return (<Text style={styles.bullet}>• {item?.text}</Text>)
                  })
                }
              </View>
              {logoB64Str && (
                <Image style={styles.logoInContainer} src={logoB64Str} resizeMode="contain" />
              )}
            </View>
          </>)
        }

        {
          exclusions && exclusions.length > 0 && (<>
            <View style={styles.boxContainer3} wrap={false} break>
              <Text style={styles.InfoTitle}>Exclusions</Text>
              <View style={styles.exclusionContainer}>
                {
                  exclusions.map((item, index) => {
                    return (<Text style={styles.bullet}>• {item?.text}</Text>)
                  })
                }
              </View>
              {logoB64Str && (
                <Image style={styles.logoInContainer} src={logoB64Str} resizeMode="contain" />
              )}
            </View>
          </>)
        }

        {
          cancellationData && cancellationData.length > 0 && (<>
            <View style={styles.boxContainer3} wrap={false}>
              <Text style={styles.InfoTitle}>Cancellation Policy</Text>
              <View style={styles.exclusionContainer}>
                {
                  cancellationData.map((item, index) => {
                    return (<Text style={styles.bullet}>• {item?.text}</Text>)
                  })
                }
              </View>
              {logoB64Str && (
                <Image style={styles.logoInContainer} src={logoB64Str} resizeMode="contain" />
              )}
            </View>
          </>)
        }

        {
          paymentPolicy && paymentPolicy.length > 0 && (<>
            <View style={styles.boxContainer3} wrap={false} break>
              <Text style={styles.InfoTitle}>Payment Policy</Text>
              <View style={styles.exclusionContainer}>
                {
                  paymentPolicy.map((item, index) => {
                    return (<Text style={styles.bullet}>• {item?.text}</Text>)
                  })
                }
              </View>
              {logoB64Str && (
                <Image style={styles.logoInContainer} src={logoB64Str} resizeMode="contain" />
              )}
            </View>
          </>)
        }
        <View wrap={false} break>

          <View style={styles.priceSection} wrap={false}>
            <Text style={styles.priceTitle}>Total Package Price</Text>
            <Text style={styles.totalPrice}>{`Rs. ${totalPackPrice || 'N/A'}`}</Text>
          </View>

          <View style={styles.footerContainer} wrap={false}>
            <Text style={styles.footerTitle}>Bank Account Details</Text>
            {
              paymentDetails?.accName && (<Text style={styles.footerDetailsText}>
                Account Name: {paymentDetails?.accName}
              </Text>)
            }
            {
              paymentDetails?.accNo && (<Text style={styles.footerDetailsText}>
                Account No: {paymentDetails?.accNo}
              </Text>)
            }
            {
              paymentDetails?.ifscCode && (<Text style={styles.footerDetailsText}>
                IFSC: {paymentDetails?.ifscCode}
              </Text>)
            }
            {
              paymentDetails?.upiId && (<Text style={styles.footerDetailsText}>
                UPI: {paymentDetails?.upiId}
              </Text>)
            }
            {logoB64Str && (
              <Image
                style={styles.footerLogo}
                src={logoB64Str}
                resizeMode="contain"
              />
            )}
            <View style={styles.footerContact}>
              {email && (<Text style={styles.footerText}>Email : {email}</Text>)}
              {phone && (<Text style={styles.footerText}>Phone : {phone}</Text>)}
              {address && (<Text style={styles.footerText}>Address : {address}</Text>)}
            </View>
            <View style={styles.socialContainer}>
              {
                socialMediaDetails?.whatsapp && (<Link src={socialMediaDetails?.whatsapp}>
                    <Image
                        style={styles.socialIcon}
                        src={"/wa-icon-png.png"}
                        resizeMode="contain"
                    />
                </Link>)
              }
              {
                socialMediaDetails?.instagram && (<Link src={socialMediaDetails?.instagram}>
                    <Image
                        style={styles.socialIcon}
                        src={"/insta-icon.png"}
                        resizeMode="contain"
                    />
                </Link>)
              }
              {
                socialMediaDetails?.website && (<Link src={socialMediaDetails?.website}>
                    <Image
                        style={styles.socialIcon}
                        src={"/website-icon.png"}
                        resizeMode="contain"
                    />
                </Link>)
              }
              {
                socialMediaDetails?.linkedin && (<Link src={socialMediaDetails?.linkedin}>
                    <Image
                        style={styles.socialIcon}
                        src={"/linkedin-icon.png"}
                        resizeMode="contain"
                    />
                </Link>)
              }
            </View>
          </View>
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>
    </Document>
  )
};

const getThemedStyles = ({ themeData = {} }) => {
  const {
    primaryColor = "#30746c",
    secondaryColor = "#b352d1",
    textPrimary = "#212121",
    textSecondary = "#000000"
  } = themeData;

  return StyleSheet.create({
    page: {
      fontFamily: 'Roboto',
      fontSize: 12,
      position: 'relative',
    },
    backgroundImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      zIndex: -1,
      opacity: 0.4,
    },
    page2: {
      position: 'relative',
    },
    headerImage: {
      width: '100%',
      height: "80%",
      objectFit: 'cover',
      marginBottom: 1,
    },
    logo: {
      width: 100,
      height: 'auto',
      position: 'absolute',
      top: 0,
      right: 0,
    },
    logoInContainer: {
      position: "absolute",
      bottom: 0,
      right: 1,
      height: 40,
      marginTop: 50,
    },
    image: {
      marginVertical: 15,
      marginHorizontal: 100,
      width: 100,
      alignSelf: 'center',
    },
    body: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 30,
    },
    // headerText: {
    //   flexWrap: "wrap", 
    //   overflow: "hidden",
    //   textAlign: "center",
    // },
    title: {
      width: "30%",
      flexWrap: "wrap",
      fontSize: 23,
      fontWeight: 'bold',
      color: '#000',
      marginRight: 20,
      opacity: 0.8,
      textAlign: "left", 
      marginBottom: 30,
    },
    infoBox: {
      width: '60%',
      backgroundColor: '#30746c',
      padding: 20,
      borderRadius: 0,
      alignSelf: 'flex-end',
      position: 'absolute',
      bottom: 40,
      right: 30,
      flexDirection: 'column',
      marginBottom: 10,
    },
    label: {
      flex: 1,
      color: 'white',
      opacity: 0.8,
      fontSize: 16,
      marginBottom: 5,
    },
    value: {
      flex: 2,
      color: 'white',
      fontSize: 18,
      marginBottom: 15,
    },
    hr: {
      borderBottomWidth: 1,
      borderBottomColor: '#dddddd',
      marginVertical: 15,
      width: '100%',
    },
    labelAbout: {
      flex: 1,
      opacity: 0.8,
      fontSize: 14,
    },
    sectionHeaderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 30,
      marginTop: 20,
    },
    sectionHeader: {
      flex: 1,
      backgroundColor: primaryColor, 
      padding: 10,
      borderRadius: 5,
      marginLeft: 10,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#ffffff',
    },
    sectionIcon: {
      width: 25,
      height: 25,
    },

    daySection: {
      // marginVertical: 20,
      padding: 20,
    },
    boxContainer: {
      marginTop: 20,
      zIndex: 1,
      borderWidth: 1,
      borderColor: '#ccc',
      overflow: 'hidden',
      width: "80%",
      alignSelf: "center",
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      backgroundColor: "#fff",
      marginBottom: 20,
    },
    boxContainer2: {
      borderWidth: 1,
      borderColor: '#ccc',
      overflow: 'hidden',
      width: "80%",
      height: '60%',
      alignSelf: "center",
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      backgroundColor: "#fff",
      marginBottom: 20,
      padding: 20,
      paddingBottom: 50,
      marginTop: 20,
    },
    boxContainer3: {
      borderWidth: 1,
      borderColor: '#ccc',
      overflow: 'hidden',
      width: "80%",
      height: '80%',
      alignSelf: "center",
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      backgroundColor: "#fff",
      marginBottom: 20,
      padding: 20,
      paddingBottom: 50,
      marginTop: 20,
    },
    upperBox: {
      backgroundColor: '#30746c',
      padding: 20,
      width: '100%',
    },
    dayTitle: {
      fontSize: 25,
      fontWeight: 'extrabold',
      color: '#84bfb9',
      marginBottom: 15,
    },
    InfoTitle: {
      fontSize: 30, 
      fontWeight: 'extrabold', 
      color: '#30746c',
      marginBottom: 30,
      marginLeft: 7,
      marginTop: 10,
    },
    InfoTitle1: {
      fontSize: 30, 
      fontWeight: 'extrabold',
      color: '#30746c',
      marginBottom: 10,
      marginLeft: 7,
      marginTop:20,
    },
    hotelDetailsContainer: {
      marginBottom: 15,
    },
    hotelName: {
      fontSize: 18, 
      color: '#fff',
      opacity: 0.8,
      marginBottom: 5,
      textAlign: 'left',
    },
    destinationName: {
      fontSize: 16,
      color: '#fff',
      opacity: 0.8,
      marginBottom: 20,
    },
    destinationName1: {
      fontSize: 16,
      color: '#fff',
      opacity: 0.8,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    hotelName1: {
      fontSize: 18,
      opacity: 1,
      fontWeight: 'bold',
    },
    roomDetails: {
      marginBottom: 20,
    },
    roomInfo: {
      fontSize: 16,
      color: '#fff',
      marginBottom: 5,
    },
    roomInfo1: {
      fontWeight: "bold",
    },
    roomOccupancy: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#fff',
      opacity: '0.8',
      marginBottom: 10,
    },
    destination: {
      fontSize: 14,
      color: '#fff',
      textAlign: 'center', 
      marginBottom: 10,
    },
    mealPlan: {
      fontSize: 14,
      color: '#fff',
    },

    itiDescTitle: {
      fontSize: 25,
      fontWeight: 'extrabold',
      color: '#30746c',
      marginBottom: 13,
    },
    lowerBox: {
      backgroundColor: '#fff',
      padding: 30,
      width: '100%',
    },
    itiDescText: {
      fontSize: 16,
      // fontWeight: 'ultralight',
      color: '#000',
      lineHeight: 1.5,
      opacity: 0.6,
      marginBottom: 8,
    },

    dayHeader: {
      // backgroundColor: '#B8E0D2',
      padding: 3,
      borderRadius: 3,
      marginVertical: 8,
      alignSelf: 'flex-start',
    },
    emergencyContainer: {
      marginLeft: 10,
      padding: 10,
      backgroundColor: '#e8f4f8',
      borderRadius: 5,
    },
    emergencyText: {
      fontSize: 15,
      color: '#333333',
      lineHeight: 1.5,
    },
    hotelContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 15,
      padding: 10,
      borderRadius: 5,
      borderWidth: 1,
    },
    hotelImage: {
      width: 80,
      height: 80,
      marginLeft: 30,
      marginRight: 15,
      marginTop: 20,
      borderRadius: 5,
      resizeMode: 'cover',
    },
    hotelDetails: {
      flex: 1,
      flexDirection: 'column',
    },
    hotelDetailsOuter: {
      flex: 1,
      flexDirection: 'row',
    },
    roomType: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 2,
      color: '#333333',
    },
    exclusionContainer: {
      marginLeft: 10,
    },
    bullet: {
      fontSize: 16,
      marginVertical: 1,
      lineHeight: 1.5,
      color: '#555555',
      fontWeight: 'extralight',
      marginBottom: 8,
    },
    priceSection: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      marginTop: 20,
      padding: 15,
      backgroundColor: primaryColor, 
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 30,
    },
    priceTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center',
      opacity: 0.8,
      marginBottom: 5, 
    },
    totalPrice: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center',
    },
    transferContainer: {
      marginLeft: 10,
      padding: 10,
      borderRadius: 5,
      marginBottom:10,
    },
    transferText: {
      fontSize: 18,
      opacity: 0.8,
      color: '#333333',
      lineHeight: 1.5,
    },
    exclusionSection: {
      marginTop: 10,
    },
    itiDescContainer: {
      marginVertical: 10,
      padding: 10,
      backgroundColor: 'white',
      borderRadius: 5,
    },
    footerContainer: {
      backgroundColor: '#FFFFFF',
      padding: 20,
      borderWidth: 1,
      borderColor: '#CCCCCC',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: "center",
      width: "80%",
    },
    footerTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#000000',
      marginBottom: 10,
      textAlign: 'center',
    },
    footerDetailsText: {
      fontSize: 12,
      color: '#333333',
      textAlign: 'center',
      marginBottom: 5,
      width: "60%"
    },
    footerLogo: {
      height: 70,
      marginBottom: 15,
    },
    footerContact: {
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: 20,
    },
    footerText: {
      fontSize: 12,
      color: '#333333',
      fontWeight: 'bold',
      marginBottom: 5,
    },
    pageNumber: {
      position: 'absolute',
      fontSize: 10,
      bottom: 5,
      left: 0,
      right: 0,
      textAlign: 'center',
      color: 'grey',
    },
    pageContainer: {
      margin: 20,
      padding: 10,
    },
    socialIcon: {
        height: 40,
        marginLeft: 10,
        marginRight: 10
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,   
    }

  });
}


export default HtmlPdfView;