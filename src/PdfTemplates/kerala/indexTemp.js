import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font, PDFViewer } from '@react-pdf/renderer';
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
    name
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
  console.log("HOTELS_DETAILS", JSON.stringify(hotels));
  console.log("pdf template render ", req, logoB64Str, hotels);
  console.log("HEADERimg_check:", headerImage, inclusions);
  const styles = getThemedStyles(themeData) || null;

  if(!styles) return null;

  return(
    <Document>
      <Page size={'A4'} style={styles.page} debug={false}>
        <View style={styles.bannerContainer}>
          <Image
            style={[styles.pageBackground, styles.headerImage]}
            src={"/kerala-template-bannerlow.png"}
            resizeMode="cover"
          />
        </View>
        <View style={styles.bannerBody}>
          {/* {
            logoB64Str && (<Image
              style={[styles.logo]}
              src={logoB64Str}
              resizeMode="contain"
            />)
          } */}
          <Text style={[styles.title, { letterSpacing: 1.5 }]}>{req?.noOfNights} Nights Serene {req?.destination || 'N/A'} Itinerary for - {req?.trackingId}</Text>
        </View>
        <View style={styles.body}>
          {
            logoB64Str && (<Image
              style={[styles.logo]}
              src={logoB64Str}
              resizeMode="contain"
            />)
          }
          <View style={{ margin: "auto" }}>
            <Text style={styles.footerText}>{req?.address}</Text>
            <Text style={styles.footerText}>Email: {email}</Text>
            <Text style={styles.footerText}>Phone: {phone}</Text>
          </View>
        </View>
        
        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Passengers: </Text>
            <Text style={styles.value}>{req?.trackingId || 'N/A'}{req?.totalAdultPax > 1 ? ` + ${req?.totalAdultPax} Person. ${req?.totalChildPax > 0 ? `${req?.totalChildPax} Children` : ''}` : ''}</Text>
          </View>
          // <View style={styles.infoRow}>
          //   <Text style={styles.label}>Destination: </Text>
          //   <Text style={styles.value}>{req?.destination || 'N/A'}</Text>
          // </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Trip Starting on: </Text>
            <Text style={styles.value}>{formatDate(req?.startDate) || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Trip Duration: </Text>
            <Text style={styles.value}>{Number(req?.noOfNights) + 1 || 'N/A'} Days</Text>
          </View>
          // <View style={styles.infoRow}>
          //   <Text style={styles.label}>Guest: </Text>
          //   <Text style={styles.value}>{req?.totalAdultPax} Adults {req?.totalChildPax ? `| ${req?.totalChildPax} Children` : ''}</Text>
          // </View>
        </View>
        
        <View style={{ alignSelf: 'center', textAlign: 'center', padding: 30, display: 'flex', height: '100%' }}>
          <Text style={[styles.label, { lineHeight: 2, fontSize: 30, margin: 'auto', letterSpacing: 3 }]}>About {req?.destination}</Text>
          <Text style={[styles.label, { lineHeight: 1.2, fontSize: 15, margin: 'auto', letterSpacing: 1.2 }]}>{aboutDestText}</Text>
        </View>
        {
          (itiDesc || []).map((day, index) => {
            return (<View wrap={false} style={styles.dayItiContainer}>
              <Text style={styles.dayItiTitle}>Day {index}</Text>
              <View style={styles.dayItiTextContainer}>
                {
                  (day?.text || []).map((item) => {
                    return (<Text style={styles.dayItiText}>• {item}</Text>)
                  })
                }
              </View>
            </View>)
          })
        }
        {
          (inclusions || []).length > 0 && (<View wrap={false} style={styles.dayItiContainer}>
            <Text break style={styles.dayItiTitle}>Inclusions</Text>
            {
              inclusions.map((inc) => {
                if(inc?.text) return (<View style={styles.dayItiTextContainer}>
                  <Text style={styles.dayItiText}>• {inc?.text}</Text>
                </View>)
              })
            }
          </View>)
        }
        {
          (exclusions || []).length > 0 && (<View wrap={false} style={styles.dayItiContainer}>
            <Text break style={styles.dayItiTitle}>Exclusions</Text>
            {
              exclusions.map((inc) => {
                if(inc?.text) return (<View style={styles.dayItiTextContainer}>
                  <Text style={styles.dayItiText}>• {inc?.text}</Text>
                </View>)
              })
            }
          </View>)
        }
        {
          (cancellationData || []).length > 0 && (<View wrap={false} style={styles.dayItiContainer}>
            <Text style={styles.dayItiTitle}>Cancellation Policy</Text>
            {
              cancellationData.map((inc) => {
                if(inc?.text) return (<View style={styles.dayItiTextContainer}>
                  <Text style={styles.dayItiText}>• {inc?.text}</Text>
                </View>)
              })
            }
          </View>)
        }
        {
          (paymentPolicy || []).length > 0 && (<View wrap={false} style={styles.dayItiContainer}>
            <Text style={styles.dayItiTitle}>Payment Policy</Text>
            {
              paymentPolicy.map((inc) => {
                if(inc?.text) return (<View style={styles.dayItiTextContainer}>
                  <Text style={styles.dayItiText}>• {inc?.text}</Text>
                </View>)
              })
            }
          </View>)
        }
      </Page>
    </Document>
  )

  return (
    <Document>
      <Page size={'A4'} style={styles.page} >
        <View>
          {headerImage && (
            <Image
              style={[styles.pageBackground, styles.headerImage]}
              src={headerImage}
              resizeMode="cover"
            />
          )}

          <View style={styles.body}>
            {
              logoB64Str && (<Image
                style={[styles.logo]}
                src={logoB64Str}
                resizeMode="contain"
              />)
            }
            {/* <Image
              style={[styles.logo]}
              src={logoB64Str || 'https://png.pngtree.com/template/20191030/ourmid/pngtree-travel-logo-airplane-design-airplane-tickets-travel-agencies-image_325199.jpg'}
              resizeMode="contain"
              // debug
            /> */}
            <Text style={styles.title}>Travel Itinerary for {req?.destination || 'N/A'}</Text>

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

            <View style={styles.hr} />

            <View style={styles.sectionHeaderContainer}>
              <Image style={styles.sectionIcon} src="/contactTitle.png" />
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>  Emergency Contact</Text>
              </View>
            </View>
            <View style={styles.emergencyContainer}>
              <Text style={styles.emergencyText}>Agent Name: {name || 'N/A'}</Text>
              <Text style={styles.emergencyText}>Phone: {phone || 'N/A'}</Text>
            </View>

            <View style={styles.hr} />
          </View>
        </View>
      
        {hotels.map((hotelsCurrDay, currDayIndex) => (
          <View key={currDayIndex} style={styles.daySection}>
            {/* <View style={styles.dayHeader}>
              <Text style={styles.dayTitle}>Day {currDayIndex + 1}</Text>
            </View> */}
            <View style={styles.sectionHeaderContainer}>
              {/* <Image style={styles.sectionIcon} src="/hotelTitle.png" /> */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Day {currDayIndex + 1}</Text>
              </View>
            </View>

            {hotelsCurrDay.hotels.map((hotel, hotelIndex) => {
              const { location, hotelName, selectedRooms = [] } = hotel;
              console.log("pdf html hotel data", location, selectedRooms)
              return (
                <View style={styles.dayContainer}>

                  <View key={hotelIndex}  style={styles.hotelContainer}>
                    <View style={styles.hotelDetailsOuter}>
                        
                      <View  style={styles.hotelDetails}>
                        <Text style={styles.hotelName}>Stay at {hotelName}</Text>
                        {selectedRooms.map((currRoom, roomIndex) => {
                          const {
                            roomName,
                            selectedOccupancy: { adults = 0, child = 0, childAges = [] } = {},
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
                            <View wrap={false} key={roomIndex} style={styles.roomDetails}>
                              <Text style={styles.roomType}>{roomName}</Text>
                              <Text style={styles.roomOccupancy}>
                                {adults} Adult{adults > 1 && 's'} {child ? `, ${child} Children` : ''}
                              </Text>
                              {childAges.some((child) => child.extraBed === 'true') && (
                                <Text style={styles.extraBedText}>With Extra Bed</Text>
                              )}
                              <Text style={styles.mealPlan}>{mealPlan}</Text>
                            </View>
                          );
                        })}


                      </View>

                      <Image
                        style={styles.hotelImage}
                        src="/hotelIcon.png"
                        resizeMode="cover"
                      />
                    </View>
                    
                  </View>
                  {itiDesc[currDayIndex]?.text && (
                    <View wrap={false} style={styles.itiDescContainer}>
                      {/* <Text style={styles.itiDescTitle}>Itinerary Description for Day-{currDayIndex + 1}</Text> */}
                      {itiDesc[currDayIndex].text.map((point, pointIndex) => (
                        <Text key={pointIndex} style={styles.itiDescText}>{`.${point}`}</Text>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}

          </View>
        ))}

        <View style={styles.sectionHeaderContainer}>
          <Image style={styles.sectionIcon} src="/transferTitle.png" />
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Flights</Text>
          </View>
        </View>
        <View style={styles.transferContainer}>
          <Text style={styles.transferText}>
            {`${flights?.arrival ? `Arrival Flight for the trip: ${flights?.arrival}.` : ''} ${flights?.departure ? `Departure Flight for the trip: ${flights?.departure}.` : ''}`}
          </Text>
        </View>

        <View style={styles.sectionHeaderContainer}>
          <Image style={styles.sectionIcon} src="/transferTitle.png" />
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transfer</Text>
          </View>
        </View>
        <View style={styles.transferContainer}>
          <Text style={styles.transferText}>
            {`All tours and transfers are on private basis. A comfortable and clean ${req?.cabType || 'Vehichle'} will pick you up from ${req?.pickUp}.`}
          </Text>
        </View>
        <View style={styles.hr} />
        {/* <View style={styles.sectionHeaderContainer}>
          <Image style={styles.sectionIcon} src="/exclusionTitle.png" />
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Exclusions</Text>
          </View>
        </View>
        <View style={styles.exclusionContainer}>
          <Text style={styles.bullet}>• All personal expenses like tips, laundry, telephone calls/fax, alcoholic beverages, camera/video camera fees at monuments, medical expenses, airport departure tax, etc.</Text>
          <Text style={styles.bullet}>• Anything not mentioned under Package Inclusions</Text>
          <Text style={styles.bullet}>• Cost incidental to any change in the itinerary/stay due to flight cancellation due to bad weather, ill health, and roadblocks, and/or any factors beyond control.</Text>
          <Text style={styles.bullet}>• Return flight/train fare</Text>
          <Text style={styles.bullet}>• AC will work from 9 pm to 6 am on the houseboat and houseboat check-out time is 9 am. If needed to use AC service at other times, INR 2000 to be paid directly at the Houseboat (For Deluxe Houseboat)</Text>
          <Text style={styles.bullet}>• Domestic/International hotel check-in is at 1400 hrs and checkout is at 1200 hrs. Early check-in and late checkout are subject to availability and consent of the hotel.</Text>
        </View> */}

        {
          inclusions && inclusions.length > 0 && (<>
            <View style={styles.sectionHeaderContainer}>
              <Image style={styles.sectionIcon} src="/exclusionTitle.png" />
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Inclusions</Text>
              </View>
            </View>
            <View style={styles.exclusionContainer}>
              {
                inclusions.map((item, index) => {
                  return (<Text style={styles.bullet}>• {item?.text}</Text>)
                })
              }
            </View>
          </>)
        }

        {
          exclusions && exclusions.length > 0 && (<>
            <View style={styles.sectionHeaderContainer}>
              <Image style={styles.sectionIcon} src="/exclusionTitle.png" />
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Exclusions</Text>
              </View>
            </View>
            <View style={styles.exclusionContainer}>
              {
                exclusions.map((item, index) => {
                  return (<Text style={styles.bullet}>• {item?.text}</Text>)
                })
              }
            </View>
          </>)
        }
        
        {
          cancellationData && cancellationData.length > 0 && (<>
            <View style={styles.sectionHeaderContainer}>
              <Image style={styles.sectionIcon} src="/exclusionTitle.png" />
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Cancellation Policy</Text>
              </View>
            </View>
            <View style={styles.exclusionContainer}>
              {
                cancellationData.map((item, index) => {
                  return (<Text style={styles.bullet}>• {item?.text}</Text>)
                })
              }
            </View>
          </>)
        }

        {
          paymentPolicy && paymentPolicy.length > 0 && (<>
            <View style={styles.sectionHeaderContainer}>
              <Image style={styles.sectionIcon} src="/exclusionTitle.png" />
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Payment Policy</Text>
              </View>
            </View>
            <View style={styles.exclusionContainer}>
              {
                paymentPolicy.map((item, index) => {
                  return (<Text style={styles.bullet}>• {item?.text}</Text>)
                })
              }
            </View>
          </>)
        }

        <View style={styles.priceSection}>
          <Text style={styles.priceTitle}>Total Package Price</Text>
          <Text style={styles.totalPrice}>{`INR ${totalPackPrice || 'N/A'}`}</Text>
        </View>

        <View style={styles.footerContainer}>
          {
            logoB64Str && (<Image style={styles.footerLogo} src={logoB64Str} resizeMode="contain" />)
          }
          {/* <Image style={styles.footerLogo} src={logoB64Str} resizeMode="contain" /> */}
          <View style={styles.footerDetails}>
            <Text style={styles.footerText}>{req?.address}</Text>
            <Text style={styles.footerText}>Email: {email}</Text>
            <Text style={styles.footerText}>Phone: {phone}</Text>
          </View>
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>
    </Document>
  )
};

const getThemedStyles = ({themeData = {}}) => {
    const {
        primaryColor = "#000000bf",
        secondaryColor = "#b352d1",
        textPrimary = "#212121",
        textSecondary = "#000000"
    } = themeData;
    const bannerHeight = 500;

    return StyleSheet.create({
      page: {
          fontFamily: 'Roboto',
          fontSize: 12,
          backgroundColor: '#2b9fbd1f'  //'#5baed1',  //'#f5f5f5',
      },
      pageBackground: {
        position: 'absolute',
        top: '0px',
        right: '0px',
        // minWidth: '100%',
        // minHeight: '100%',
        // display: 'block',
        height: '100%',
        width: '100%',
      },
      headerImage: {
        width: '100%',
        height: bannerHeight,
        objectFit: 'cover',
        marginBottom: 1,
        borderRadius: 10,
        borderBottom: '10px solid #ffffff'
      },
      logo: {
          width: 150,
          height: 'auto',
          alignSelf: "left",
      },
      image: {
          marginVertical: 15,
          marginHorizontal: 100,
          width: 100,
          alignSelf: 'center',
      },
      bannerBody: {
        paddingVertical: 20,
        paddingHorizontal: 30,
        // backgroundColor: '#5baed1',
        paddingTop: 25,
      },
      body: {
        marginTop: 300,
        paddingVertical: 20,
        paddingHorizontal: 30,
        // backgroundColor: '#5baed1',
        paddingTop: 15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      },
      title: {
        fontSize: 35,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000000',
        marginBottom: 20,
        marginTop: 5,
        // backgroundColor: '#ffffff'
      },  
      footerText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 4,
      },
      infoBox: {
        marginVertical: 10,
        marginHorizontal: 30,
        padding: 15,
        paddingHorizontal: 30,
        width: '100%',
        backgroundColor: '#80c2d0',  //secondaryColor,  //'#0D3B66',
        color: '#000000',
        alignSelf: 'center',
        textAlign: 'center',
        borderRadius: 10,
        border: '5px solid #ffffff'
      },
      infoRow: {
        flexDirection: 'row',
        marginVertical: 3,
      },
      label: {
        fontSize: 15,
        fontWeight: 'bold',
        marginRight: 5,
        color: '#000000',
      },
      value: {
        fontSize: 15,
        color: '#000000',
        flex: 1,
      },
      bannerContainer: {
      },
      dayItiContainer: {
        margin: 30,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly'
      },
      dayItiTitle: {
        fontSize: 25,
        lineHeight: 2,
        alignSelf: 'center'
      }
    });

    
    
    
    
    return StyleSheet.create({
        page: {
            fontFamily: 'Roboto',
            fontSize: 12,
            backgroundColor: '#2b9fbd1f'  //'#5baed1',  //'#f5f5f5',
        },
        page2: {
            padding: '8px',
            backgroundColor: '#5baed1'
        },
        headerImage: {
            width: '100%',
            height: '500',
            objectFit: 'cover',
            marginBottom: 1,
            borderBottom: '5px solid black'
        },
        logo: {
            width: 150,
            height: 'auto',
            alignSelf: "center",
        },
    image: {
        marginVertical: 15,
        marginHorizontal: 100,
        width: 100,
        alignSelf: 'center',
    },
    body: {
        paddingVertical: 20,
        paddingHorizontal: 30,
        // backgroundColor: '#5baed1',
        paddingTop: 15,
    },
    title: {
        fontSize: 35,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000000',
        marginBottom: 20,
        marginTop: 5,
        // backgroundColor: '#ffffff'
    },
    itiTextContainer: {
        marginVertical: 5,
        padding: 8,
        backgroundColor: '#ffffff',
        borderRadius: 3,
    },
    infoBox: {
        marginVertical: 10,
        padding: 15,
        width: '100%',
        backgroundColor: '#e0ebf0',  //secondaryColor,  //'#0D3B66',
        color: '#ffffff',
        borderRadius: 5,
        marginBottom: 30,
    },
    infoRow: {
        flexDirection: 'row',
        marginVertical: 3,
    },
    label: {
        fontSize: 15,
        fontWeight: 'bold',
        marginRight: 5,
        color: '#000000',
    },
    value: {
        fontSize: 15,
        color: '#000000',
        flex: 1,
    },
    hr: {
        borderBottomWidth: 1,
        borderBottomColor: '#dddddd',
        marginVertical: 15,
        width: '100%',
    },
    sectionHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
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
        marginBottom: 20,
        paddingHorizontal: 20,
        pageBreakInside: 'avoid',
    },
    dayHeader: {
        // backgroundColor: '#B8E0D2',
        padding: 3,
        borderRadius: 3,
        marginVertical: 8,
        alignSelf: 'flex-start',
    },
    dayTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333333',
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
    dayContainer: {
      backgroundColor: '#e0ebf0',
      borderRadius: 5,
    },
    hotelContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 1,
        padding: 10,
        borderRadius: 5,
        // borderWidth: 1,
        backgroundColor: '#e0ebf0'
    },
    hotelImage: {
        width: 80,
        height: 80,
        marginLeft: 30,
        marginRight:15,
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
    hotelName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#0D3B66',
    },
    roomDetails: {
        marginVertical: 2,
        padding: 8,
        // backgroundColor: '#f9f9f9',
        borderRadius: 3,
        pageBreakInside: 'avoid',
    },
    roomType: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 2,
        color: '#333333',
    },
    roomOccupancy: {
        fontSize: 12,
        color: '#555555',
    },
    mealPlan: {
        fontSize: 12,
        color: '#555555',
    },
    exclusionContainer: {
        marginLeft: 10,
    },
    bullet: {
        fontSize: 12,
        marginVertical: 1,
        lineHeight: 1.5,
        color: '#555555',
    },
    priceSection: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        padding: 15,
        // backgroundColor: '#e0e0e0',
        borderWidth: 1,
        borderRadius: 5,
    },
    priceTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        // marginBottom: 5,
        // margin: 'auto'
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0D3B66',
        textAlign: 'center',
    },
    transferContainer: {
        marginLeft: 10,
        padding: 10,
        backgroundColor: '#e8f4f8',
        borderRadius: 5,
    },
    transferText: {
        fontSize: 12,
        color: '#333333',
        lineHeight: 1.5,
    },
    exclusionSection: {
        marginTop: 10,
    },
    itiDescContainer: {
        marginVertical: 1,
        padding: 10,
        // backgroundColor: '#e0ebf0',
        borderRadius: 5,
    },
    itiDescTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    itiDescText: {
        fontSize: 14,
        marginBottom: 3,
    },
  footerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 15,
      marginTop: 30,
      borderTopWidth: 1,
      // borderTopColor: '#dddddd',
      // backgroundColor: '#f0f0f0',
    },
    footerLogo: {
        width: 80,
        height: 80,
        objectFit: 'contain',
        resizeMode: 'contain',
    },
    footerDetails: {
        flexDirection: 'column',
        justifyContent: 'center',
        flex: 1,
        marginLeft: 20,
    },
    footerText: {
        fontSize: 10,
        color: '#333333',
        marginBottom: 4,
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
    pageBackground: {
      position: 'absolute',
      top: '0px',
      right: '0px',
      // minWidth: '100%',
      // minHeight: '100%',
      // display: 'block',
      height: '100%',
      width: '100%',
    },  
    bannerContainer: {
      // height: '1000px'
    }
});
}


export default HtmlPdfView;