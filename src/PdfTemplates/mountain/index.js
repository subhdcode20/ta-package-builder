import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font, PDFViewer, Stop, Svg, Defs, LinearGradient, Rect } from '@react-pdf/renderer';
import { fromUnixTime, format } from 'date-fns';
import { tr } from 'date-fns/locale';


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

let headerImage = 'https://plus.unsplash.com/premium_photo-1661885251699-b242dd1e6e20?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bW91bnRhaW4lMjByb2FkfGVufDB8fDB8fHww'
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
    name,
  },
  userProfileData: {
    themeData = {},
    // headerImage,
    cancellationData = [],
    paymentPolicy = [],
    inclusions = [],
    exclusions = [],
    aboutDestText = ''
  },
  totalPackPrice = ''
}) => {
  console.log("HOTELS_DETAILS", JSON.stringify(hotels));
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
              src={headerImage}
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
        <Text style={styles.title}>Travel Itinerary for Mountain {req?.destination || 'N/A'}</Text>
        {/* </View> */}

        {
          logoB64Str && (<Image
            style={[styles.logo]}
            src={logoB64Str}
            resizeMode="contain"
          />)
        }
        <View style={styles.body}>

          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Lead Pax: </Text>
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
              <Text style={styles.label}>Guest: </Text>
              <Text style={styles.value}>{req?.totalAdultPax} Adults {req?.totalChildPax ? `| ${req?.totalChildPax} Children` : ''}</Text>
            </View>
          </View>
        </View>
      </Page>
      <Page style={styles.page} wrap={false}>
        <View style={{ flexDirection: 'row', height: '100%' }}>
          {/* Left Column - Image */}
          <View style={{ flex: 4 }}>
            <View style={styles.headerImagecontainer}>

              <Image
                source={{ uri: 'https://media.istockphoto.com/id/154232673/photo/blue-ridge-parkway-scenic-landscape-appalachian-mountains-ridges-sunset-layers.jpg?s=612x612&w=0&k=20&c=m2LZsnuJl6Un7oW4pHBH7s6Yr9-yB6pLkZ-8_vTj2M0=' }}
                style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
              />
              {Array.from({ length: 40 }, (_, index) => (
                <View
                  key={index}
                  style={[
                    styles.overlaySection,
                    {
                      bottom: `${index * 0.5}%`,
                      height: `.5%`,
                      opacity: 1 - index * 0.025,
                    },
                  ]}
                />
              ))}
            </View>
          </View>

          <View style={{ flex: 6, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#30746c' }}>
            <Text style={{ fontSize: 30, fontWeight: 'extrabold', letterSpacing: 3, marginBottom: 30, textAlign: 'left', color: '#84bfb9' }}>
              About {req?.destination}
            </Text>
            <Text style={{ fontSize: 15, textAlign: 'left', lineHeight: 1.2, letterSpacing: 1, fontWeight: 'extralight', color: 'white' }}>
              {aboutDestText}
            </Text>
          </View>
        </View>

      </Page>

      <Page style={[styles.page, styles.page2]} >
        <View style={styles.headerImagecontainer1}>

          <Image
            style={styles.backgroundImage}
            src='https://media.istockphoto.com/id/154232673/photo/blue-ridge-parkway-scenic-landscape-appalachian-mountains-ridges-sunset-layers.jpg?s=612x612&w=0&k=20&c=m2LZsnuJl6Un7oW4pHBH7s6Yr9-yB6pLkZ-8_vTj2M0='
            fixed
          />
          {Array.from({ length: 40 }, (_, index) => (
            <View
              key={index}
              style={[
                styles.overlaySection,
                {
                  bottom: `${index * 0.5}%`,
                  height: `.5%`,
                  opacity: 1 - index * 0.025,
                },
              ]}
            />
          ))}
        </View>

        {hotels.map((hotelsCurrDay, currDayIndex) => (
          <>
            <View style={styles.headerImagecontainer1}>

              <Image
                style={styles.backgroundImage}
                src='https://media.istockphoto.com/id/154232673/photo/blue-ridge-parkway-scenic-landscape-appalachian-mountains-ridges-sunset-layers.jpg?s=612x612&w=0&k=20&c=m2LZsnuJl6Un7oW4pHBH7s6Yr9-yB6pLkZ-8_vTj2M0='
                fixed
              />
              {Array.from({ length: 40 }, (_, index) => (
                <View
                  key={index}
                  style={[
                    styles.overlaySection,
                    {
                      bottom: `${index * 0.5}%`,
                      height: `.5%`,
                      opacity: 1 - index * 0.025,
                    },
                  ]}
                />
              ))}
            </View>
            <View key={currDayIndex} style={styles.daySection} wrap={false}>

              <View style={styles.boxContainer} wrap={true}>
                {/* Upper Half */}
                <View style={styles.upperBox} >
                  <Text style={styles.dayTitle}>Day {currDayIndex + 1}</Text>
                  {hotelsCurrDay.hotels.map((hotel, hotelIndex) => {
                    const { hotelName, location, selectedRooms = [] } = hotel;
                    return (
                      <View key={hotelIndex} style={styles.hotelDetailsContainer}>
                        <Text style={styles.hotelName}>Hotel: <Text style={styles.hotelName1}>{hotelName}Premium Hotel</Text></Text>
                        <Text style={styles.destinationName}>Destination: <Text style={styles.destinationName1}>{location}</Text></Text>
                        {selectedRooms.map((currRoom, roomIndex) => {
                          const {
                            roomName,
                            selectedOccupancy: { adults = 0, child = 0 } = {},
                            mp,
                          } = currRoom;

                          let mealPlan = '';
                          if (mp === 'mapai') {
                            mealPlan = 'Breakfast and (Lunch or Dinner)';
                          } else if (mp === 'cpai') {
                            mealPlan = 'Breakfast ONLY';
                          } else if (mp === 'apai') {
                            mealPlan = 'All meals (Breakfast, Lunch, and Dinner)';
                          } else {
                            mealPlan = 'No meal plan specified';
                          }

                          return (
                            <View key={roomIndex} style={styles.roomDetails}>
                              <Text style={styles.roomInfo}>Room: <Text style={styles.roomInfo1}>{roomName}Family Suite</Text> <Text style={styles.roomOccupancy}>
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
                  <View style={styles.lowerBox} wrap={true}>
                    <Text style={styles.itiDescTitle}>Itinerary Description for Day {currDayIndex + 1}</Text>
                    {itiDesc[currDayIndex].text.map((point, pointIndex) => (
                      <Text key={pointIndex} style={styles.itiDescText}>
                        {`${pointIndex + 1}. ${point}`}
                      </Text>
                    ))}
                  </View>
                )}

              </View>
            </View>
          </>
        ))}

        <View style={styles.boxContainer2} wrap={false} break>
          <Text style={styles.InfoTitle}>Flights</Text>
          <View style={styles.transferContainer}>
            <Text style={styles.transferText}>
              {`${flights?.arrival ? `Arrival Flight for the trip: ${flights?.arrival}.` : ''} ${flights?.departure ? `Departure Flight for the trip: ${flights?.departure}.` : ''}`}
              Arrival Flight for the trip: Delhi. Departure Flight for the trip: Mumbai
            </Text>
          </View>
          <Text style={styles.InfoTitle}>Transfer</Text>
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
            <Text style={styles.totalPrice}>{`INR ${totalPackPrice || 'N/A'}`}</Text>
          </View>

          <View style={styles.footerContainer} wrap={false}>
            <Text style={styles.footerTitle}>Bank Account Details</Text>
            <Text style={styles.footerDetailsText}>
              lorem ipsum bank account details 293728941293 dhsadja DKJHASKJD ICI Bank
            </Text>
            {logoB64Str && (
              <Image
                style={styles.footerLogo}
                src={logoB64Str}
                resizeMode="contain"
              />
            )}
            <View style={styles.footerContact}>
              <Text style={styles.footerText}>Email : {email}</Text>
              <Text style={styles.footerText}>Phone : {phone}</Text>
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
    headerImagecontainer1: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      zIndex: -1,
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
      opacity: 0.8
    },
    overlaySection: {
      position: 'absolute',
      width: '100%',
      backgroundColor: 'white',
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
    title: {
      position: 'absolute',
      width: "70%",
      top: '5%',
      left: '5%',
      color: 'brown',
      fontSize: 40,
      fontWeight: 'extralight',
      textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)',
    },
    infoBox: {
      width: '60%',
      backgroundColor: '#30746c',
      padding: 20,
      borderRadius: 0, // Removes curved edges
      alignSelf: 'flex-end', // Ensures alignment to the right
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
      borderWidth: 1,
      borderColor: '#ccc',
      overflow: 'hidden',
      width: "80%",
      alignSelf: "left",
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
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
      padding: 20,
      width: '100%',
    },
    dayTitle: {
      fontSize: 25,
      fontWeight: 'extrabold',
      color: 'brown',
      marginBottom: 15,
    },
    InfoTitle: {
      fontSize: 30, // Increased font size for emphasis
      fontWeight: 'extrabold', // Bold text
      color: '#30746c',
      marginBottom: 30,
      marginLeft: 7,
      marginTop: 10,
    },
    hotelDetailsContainer: {
      marginBottom: 15,
    },
    hotelName: {
      fontSize: 18, // Larger font size for hotel name
      opacity: 0.8,
      marginBottom: 5,
      textAlign: 'left',
    },
    destinationName: {
      fontSize: 16,
      opacity: 0.8,
      marginBottom: 20,
    },
    destinationName1: {
      fontSize: 16,
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
      marginBottom: 5,
    },
    roomInfo1: {
      fontWeight: "bold",
    },
    roomOccupancy: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center', // Center the text
      opacity: '0.8',
      marginBottom: 10,
    },
    destination: {
      fontSize: 14,
      textAlign: 'center', // Centered below Adults/Children
      marginBottom: 10,
    },
    mealPlan: {
      fontSize: 14,
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
      flexDirection: 'column', // Change to column to stack title and price
      justifyContent: 'center', // Center content vertically
      alignItems: 'center', // Center content horizontally
      marginTop: 20,
      padding: 15,
      backgroundColor: primaryColor, // Set background color
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
      marginBottom: 5, // Space between title and price
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
      marginBottom: 15,
      width: "60%"
    },
    footerLogo: {
      height: 70,
      marginBottom: 15,
    },
    footerContact: {
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: 10,
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
    }

  });
}


export default HtmlPdfView;