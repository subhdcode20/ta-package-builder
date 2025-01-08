import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font, PDFViewer, Stop, Svg, Defs, LinearGradient, Rect } from '@react-pdf/renderer';
import { fromUnixTime, format } from 'date-fns';
import { tr } from 'date-fns/locale';
import BackgroundImageGradient from './imageGradient';
import { isEmptyObject } from '../../Utility.js';
import { MEAL_PLAN_LABEL } from '../../Constants.js';


Font.register({
  family: 'Edu QLD Beginner',
  fonts: [
    {
      src: '/fonts/AMOHz5iUuHLEMNXyohhc_Y56PR3A8dNLF_w3Ka4HKE4E3recgao.ttf',
    },
  ],
});
Font.register({
  family: 'Edu QLD Beginner Medium',
  fonts: [
    {
      src: '/fonts/AMOHz5iUuHLEMNXyohhc_Y56PR3A8dNLF_w3Ka4HKE423recgao.ttf',
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


// let headerImage = 'https://plus.unsplash.com/premium_photo-1661885251699-b242dd1e6e20?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bW91bnRhaW4lMjByb2FkfGVufDB8fDB8fHww'
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
  userData: {
    phone,
    logoB64Str,
    email,
    companyName,
    address,
    companyInfo = {},
    paymentDetails = {},
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
  console.log("HOTELS_DETAILS", hotels);
  console.log("pdf template render ", req, logoB64Str, hotels);
  console.log("HEADERimg_check default:", headerImage, cancellationData);
  console.log("CHECK_ABOUT:", aboutDestText);
  const styles = getThemedStyles(themeData) || null;
  if (!styles) return null;
  return (
    <Document>
      <Page style={styles.page} wrap={false}>
        <View style={styles.headerImagecontainer}>

          {headerImage && (
            <Image
              style={styles.headerImage}
              src={headerImage || _defaultHeaderImage}
              resizeMode="cover"
            />
          )}
          {Array.from({ length: 40 }, (_, index) => (
            <View
              key={index}
              style={[
                styles.overlaySection,
                {
                  top: `${index * 0.5}%`,
                  height: `.5%`,
                  opacity: 1 - index * 0.025,
                },
              ]}
            />
          ))}
        </View>
        {/* <View style={styles.headerText}> */}
        <Text style={styles.title}>Travel Itinerary for {req?.destination || 'N/A'}</Text>
        {/* </View> */}

        {
          logoB64Str && (<Image
            style={[styles.logo]}
            src={logoB64Str}
            resizeMode="contain"
          />)
        }
      </Page>
      <Page style={styles.page} wrap={false}>
        <View style={{ height: '100%', position: 'relative' }}>
          <View style={{ flex: 6, justifyContent: 'left', alignItems: 'left', paddingLeft: 30, paddingRight: 30, paddingTop: 100, paddingBottom: 40, }}>
            {/* <View style={styles.infoBox}> */}
            <Text style={styles.label}>Lead Passenger: </Text>
            <Text style={styles.value}>{req?.trackingId || 'N/A'}</Text>
            <Text style={styles.label}>Trip starting on: </Text>
            <Text style={styles.value}>{formatDate(req?.startDate) || 'N/A'}</Text>
            <Text style={styles.label}>Guests: </Text>
            <Text style={styles.value}>
              {req?.totalAdultPax} Adults {req?.totalChildPax ? `| ${req?.totalChildPax} Children` : ''}
            </Text>
            <Text style={styles.label}>Destination: </Text>
            <Text style={styles.value}>{req?.destination || 'N/A'}</Text>
            {/* </View> */}
            <Text
              style={{
                fontSize: 30,
                fontWeight: 'extrabold',
                letterSpacing: 3,
                marginBottom: 30,
                textAlign: 'left',
                color: 'darkred',
                marginTop: 10,
              }}
            >
              About {req?.destination}
            </Text>
            <Text
              style={{
                fontSize: 15,
                textAlign: 'left',
                lineHeight: 1,
                fontWeight: 'extralight',
              }}
            >
              {aboutDestText}
            </Text>
          </View>
        </View>
        {logoB64Str && (
          <Image style={styles.logoInContainer1} src={logoB64Str} resizeMode="contain" />
        )}
        <BackgroundImageGradient
          imageSrc={headerImage || _defaultHeaderImage}
        />
      </Page>

      <Page style={[styles.page, styles.page2]} >

        {itiDesc.map((itiCurrDay, currDayIndex) => {
          console.log("hotels mountain render", hotels, currDayIndex, itiDesc, currDayIndex < hotels.length)
          let hotelsCurrDay = currDayIndex < hotels.length ? hotels[currDayIndex].hotels : [];
          return (<>
            <View key={currDayIndex} style={styles.daySection} wrap={false}>

              <View style={styles.boxContainer} wrap={true}>
                {/* Upper Half */}
                <View style={styles.upperBox}>
                  <Text style={styles.dayTitle}>Day {currDayIndex + 1}</Text>
                  {hotelsCurrDay.map((hotel, hotelIndex) => {
                    const { hotelName, location, selectedRooms = [] } = hotel;
                    console.log("hotel pdf index ", hotelIndex)
                    return (
                      <View key={hotelIndex} style={styles.hotelDetailsContainer}>
                        <View style={styles.headerSection}>
                          <View style={styles.headerSectionInner1}>
                            <Text style={styles.hotelName}>Hotel:</Text>
                            <Text style={styles.hotelName1}>{hotelName}</Text>
                          </View>
                          <View style={styles.headerSectionInner1}>
                            <Text style={styles.destinationName}>Location:</Text>
                            <Text style={styles.destinationName1}>{location}</Text>
                          </View>
                        </View>

                        {selectedRooms.map((currRoom, roomIndex) => {
                          const {
                            roomName,
                            selectedOccupancy: { adults = 0, child = 0 } = {},
                            mp,
                          } = currRoom;

                          let mealPlan = MEAL_PLAN_LABEL[mp] || 'No meal plan specified';

                          return (
                            <View key={roomIndex} style={styles.roomDetails}>
                              <View style={styles.roomSection}>
                                <View style={styles.roomSection1}>
                                  <Text style={styles.roomInfo}>Room:</Text>
                                  <Text style={styles.roomInfo1}>{roomName} ({adults} Adult{adults > 1 && 's'} {child ? `| ${child} Children` : ''})</Text>
                                </View>
                                {/* <View style={styles.roomSection1}>
                                  <Text style={styles.roomInfo}>Guest:</Text>
                                  <Text style={styles.roomOccupancy}>
                                    
                                  </Text>
                                </View> */}
                                <View style={styles.roomSection1}>
                                  <Text style={styles.mealPlan}>Meal Plan:</Text>
                                  <Text style={styles.mealPlan}>{mealPlan}</Text>
                                </View>
                              </View>
                            </View>
                          );
                        })}
                      </View>

                    );
                  })}
                </View>

                {/* Lower Half */}
                {itiDesc[currDayIndex]?.text && (
                  <View style={styles.lowerBox} wrap={true}>
                    <Text style={styles.itiDescTitle}>
                      Itinerary for Day {currDayIndex + 1}
                    </Text>
                    {itiDesc[currDayIndex].text.map((point, pointIndex) => (
                      <Text key={pointIndex} style={styles.itiDescText}>
                        {`${pointIndex + 1}. ${point}`}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            </View>
            {logoB64Str && (
              <Image style={styles.logoInContainer} src={logoB64Str} resizeMode="contain" />
            )}
            <BackgroundImageGradient imageSrc={headerImage || _defaultHeaderImage} />
          </>)
        }
        )}

        <View style={styles.boxContainer2} wrap={false} break>
          {
            !isEmptyObject(flights) && (<>
              <Text style={styles.InfoTitle}>Flights</Text>
              <View style={styles.transferContainer}>
                <Text style={styles.transferText}>
                  {`${flights?.arr ? `Arrival Flight for the trip: ${flights?.arr}.` : ''} ${flights?.dep ? `Departure Flight for the trip: ${flights?.dep}.` : ''}`}
                </Text>
              </View>
            </>)
          }
          <Text style={styles.InfoTitle}>Transfer</Text>
          <View style={styles.transferContainer}>
            <Text style={styles.transferText}>
              {`Pick / Drop and all sightseeing transport is on private ${req?.cabType || 'Vehichle'}. We will welcome you at ${req?.pickUp}.`}
            </Text>
          </View>
        </View>
        {logoB64Str && (
          <Image style={styles.logoInContainer3} src={logoB64Str} resizeMode="contain" />
        )}
        <BackgroundImageGradient imageSrc={headerImage || _defaultHeaderImage} />


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
            </View>
          </>)
        }
        {logoB64Str && (
          <Image style={styles.logoInContainer3} src={logoB64Str} resizeMode="contain" />
        )}
        <BackgroundImageGradient imageSrc={headerImage || _defaultHeaderImage} />

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
            </View>
          </>)
        }
        {logoB64Str && (
          <Image style={styles.logoInContainer3} src={logoB64Str} resizeMode="contain" />
        )}
        <BackgroundImageGradient imageSrc={headerImage || _defaultHeaderImage} />

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
            </View>
          </>)
        }
        {logoB64Str && (
          <Image style={styles.logoInContainer3} src={logoB64Str} resizeMode="contain" />
        )}
        <BackgroundImageGradient imageSrc={headerImage || _defaultHeaderImage} />


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
            </View>
          </>)
        }
        {logoB64Str && (
          <Image style={styles.logoInContainer3} src={logoB64Str} resizeMode="contain" />
        )}
        <BackgroundImageGradient imageSrc={headerImage || _defaultHeaderImage} />

        <View wrap={false} break style={{paddingLeft:30}}>

          <View style={styles.priceSection} wrap={false}>
            <Text style={styles.priceTitle}>Total Package Price</Text>
            <Text style={styles.totalPrice}>{`Rs ${totalPackPrice || 'N/A'}`}</Text>
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
                {paymentDetails?.accNo}
              </Text>)
            }
            {
              paymentDetails?.ifscCode && (<Text style={styles.footerDetailsText}>
                {paymentDetails?.ifscCode}
              </Text>)
            }
            {
              paymentDetails?.upiId && (<Text style={styles.footerDetailsText}>
                UPI: {paymentDetails?.upiId}
              </Text>)
            }
            <View style={styles.footerContact}>
              {email && (<Text style={styles.footerText}>Email : {email}</Text>)}
              {phone && (<Text style={styles.footerText}>Phone : {phone}</Text>)}
              {address && (<Text style={styles.footerText}>Address : {address}</Text>)}
            </View>
            {logoB64Str && (
              <Image
                style={styles.footerLogo}
                src={logoB64Str}
                resizeMode="contain"
              />
            )}
          </View>
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
        <BackgroundImageGradient imageSrc={headerImage || _defaultHeaderImage} />

      </Page>
    </Document >
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
      fontFamily: 'Edu QLD Beginner',
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
    backgroundImagecontainer1: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      zIndex: -1,
      objectFit: 'cover',
      top: 0,
      left: 0,
    },
    headerImagecontainer: {
      position: 'relative',
      width: '100%',
      height: '100%',
    },
    headerImage: {
      width: '100%',
      height: "100%",
      objectFit: 'cover',
      opacity: 0.9
    },
    overlaySection: {
      position: 'absolute',
      width: '100%',
      backgroundColor: 'white',
    },
    contentContainer: {
      position: 'relative',
      width: '100%',
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
      top: 0,
      right: 1,
      height: 50,
      marginTop: 10,
    },
    logoInContainer1: {
      position: "absolute",
      bottom: 0,
      right: 1,
      height: 50,
      marginTop: 50,
    },
    logoInContainer3: {
      position: "absolute",
      top: 0,
      left: 1,
      height: 50,
      marginTop: 10,
      marginLeft:10,
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
    title: {
      position: 'absolute',
      width: "60%",
      top: '5%',
      left: '5%',
      color: 'black',
      fontSize: 45,
      fontWeight: 'bold',
    },
    infoBox: {
      padding: 20,
      flexDirection: 'column',
      marginBottom: 10,
    },
    label: {
      color: 'black',
      opacity: 0.7,
      fontSize: 16,
      marginBottom: 4,
    },
    value: {
      color: 'black',
      fontSize: 18,
      fontWeight: 'extralight',
      marginBottom: 8,
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
      backgroundColor: primaryColor,  //'#b352d1',
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
      overflow: 'hidden',
      width: "100%",
      alignSelf: "left",
      paddingLeft: 10,
      paddingRight: 10,
      marginBottom: 20,
    },
    boxContainer2: {
      overflow: 'hidden',
      alignSelf: "flex-start",
      shadowRadius: 4,
      elevation: 5,
      marginBottom: 20,
      padding: 20,
      paddingBottom: 50,
      marginTop: 20,
      paddingLeft: 30,
    },
    boxContainer3: {
      overflow: 'hidden',
      width: "80%",
      height: '80%',
      alignSelf: "flex-start",
      marginBottom: 20,
      padding: 20,
      paddingBottom: 50,
      marginTop: 30,
      paddingLeft: 30,
      paddingTop:50,
    },
    upperBox: {
      padding: 20,
      width: '100%',
    },
    dayTitle: {
      fontSize: 30,
      fontFamily: 'Edu QLD Beginner Medium',
      fontWeight: 'bold',
      color: '#A52A2A',
      marginBottom: 15,
    },
    InfoTitle: {
      fontSize: 30,
      fontWeight: 'extralight',
      color: 'darkred',
      marginBottom: 20,
      marginLeft: 7,
      marginTop: 60,
    },

    hotelDetailsContainer: {
      marginBottom: 10,
    },
    headerSection: {
      marginBottom: 10,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignSelf: 'flex-start',
    },
    headerSectionInner1: {
      width: '50%',
      marginRight: 3,
    },
    hotelName: {
      fontSize: 16,
      color: 'darkred',
      fontWeight: 'ultralight',
      opacity: 0.7,
    },
    hotelName1: {
      fontWeight: 'light',
      color: '#000',
      fontSize: 16,
      opacity: 0.8,
      width:'60%',
  
    },
    destinationName: {
      fontSize: 16,
      color: 'darkred',
      fontWeight: 'ultralight',
      opacity: 0.7,
    },
    destinationName1: {
      fontSize: 16,
      opacity: 0.8,
      fontWeight: 'light',
    },
    roomDetails: {
      marginBottom: 10,
    },
    roomSection: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignSelf: 'flex-start',
    },
    roomSection1: {
      flexDirection: 'column',
      width: '50%',
      marginRight: 3,
      flexWrap: 'wrap',
    },
    roomInfo: {
      fontSize: 14,
      color: 'darkred',
    },
    roomInfo1: {
      fontSize: 14,
      color: '#000',
      width:'60%',
    },
    roomOccupancy: {
      fontSize: 14,
      color: '#000',
    },
    mealPlan: {
      fontSize: 14,
      color: '#000',
      flexWrap: 'wrap',
      textAlign: 'left',
      width:'60%',
    },

    lowerBox: {
      paddingTop: 10,
    },
    itiDescTitle: {
      fontSize: 25,
      fontWeight: 'light',
      color: 'darkred',
      marginBottom: 15,
    },
    itiDescText: {
      fontSize: 16,
      fontWeight: 'hairline',
      marginBottom: 10,
      letterSpacing: 1,
      lineHeight: 1.5,
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
      fontSize: 20,
      marginVertical: 1,
      lineHeight: 1.5,
      color: '#555555',
      fontWeight: 'extralight',
      marginBottom: 8,
    },
    priceSection: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'left', 
      alignItems: 'left', 
      marginTop: 100,
      padding: 15,
      marginBottom: 30,
    },
    priceTitle: {
      fontSize: 20,
      color: 'black',
      textAlign: 'left',
      opacity: 0.8,
      marginBottom: 5, 
    },
    totalPrice: {
      fontSize: 27,
      fontFamily: 'Edu QLD Beginner Medium',
      color: 'darkred',
      textAlign: 'left',
    },
    transferContainer: {
      marginLeft: 10,
      padding: 10,
      borderRadius: 5,
    },
    transferText: {
      fontSize: 20,
      opacity: 0.8, 
      color: '#333333',
      lineHeight: 2,
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
      padding: 20,
      alignItems:'left',
      justifyContent: 'flex-start',
      alignSelf: "flex-start",
    },
    footerTitle: {
      fontSize: 22,
      fontWeight: 'light',
      color: 'darkred',
      marginBottom: 10,
      textAlign: 'left',
    },
    footerDetailsText: {
      fontSize: 14,
      textAlign: 'left',
      marginBottom: 5,
      width: "60%"
    },
    footerLogo: {
      height: 70,
      maxWidth:'auto',
      objectFit: 'contain',
      marginBottom: 15,
      alignSelf:"flex-start",
    },
    footerContact: {
      flexDirection: 'column',
      alignItems: 'left',
      marginTop: 20,
      marginBottom: 10,
    },
    footerText: {
      fontSize: 12,
      color: '#333333',
      fontWeight: 'light',
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
    }

  });
}


export default HtmlPdfView;