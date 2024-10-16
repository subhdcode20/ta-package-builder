import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font, PDFViewer } from '@react-pdf/renderer';
import moment from 'moment';

// Registering the Roboto font
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

// Date formatting function
const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  return moment.unix(timestamp).format('DD-MM-YYYY');
};

// PDF Document component
const HtmlPdfView = ({
  pkgData: {
    req = {}
  },
  dayWiseData: {
    hotels = [],
    itiDesc = []
  },
  userData: {
    phone: userPhone, // Renaming to avoid conflict
    logoB64Str,
  },
  userDetails: {
    email,
    phone: detailsPhone, // Renaming to avoid conflict
  }
}) => (
  <Document>
    <Page style={styles.page}>
      <Image
        style={styles.headerImage}
        src="/kerala2.png"
        resizeMode="cover"
      />

      <View style={styles.body}>
        <Image
          style={{ width: '100%', height: 100, objectFit: 'cover' }}
          src="/kerala2.png"
        />
        <View style={styles.body}>
          <Image
            style={[styles.image, { position: 'absolute', top: -50 }]}
            src={logoB64Str}
          />
          <Text style={styles.title}>Travel Itinerary</Text>
          <Text style={styles.author}>
            {req?.noOfNights} Nights | {req?.adultPax} Adults {req?.childPax && ` | ${req?.childPax} Children`}
          </Text>

          {hotels.map((hotelsCurrDay, currDayIndex) => {
            const {
              location, hotelName, selectedRooms = []
            } = hotelsCurrDay.hotels[0] || {}; // Adding fallback to avoid undefined issues

            return (
              <View key={currDayIndex} style={styles.hotelContainer}>
                <Image
                  style={styles.hotelImage}
                  src="/hotelIcon.png"
                  resizeMode="cover"
                />
                <View style={styles.hotelDetails}>
                  <Text style={styles.hotelName}>{hotelName}</Text>

                  {selectedRooms.map((currRoom, roomIndex) => {
                    const {
                      roomName,
                      selectedOccupancy: { adults = 0, child = 0, childWithBed = 0, childWithoutBed = 0 } = {},
                      mp, // Meal Plan
                    } = currRoom;

                    // Mapping meal plan values
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
                        <Text style={styles.roomType}>{roomName}</Text>
                        <Text style={styles.roomOccupancy}>
                          {adults} Adults, {child} Child{childWithBed ? `, ${childWithBed} Child with Bed` : ''}{childWithoutBed ? `, ${childWithoutBed} Child without Bed` : ''}
                        </Text>
                        <Text style={styles.mealPlan}>Meal Plan: {mealPlan}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.sectionHeaderContainer}>
          <Image style={styles.sectionIcon} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgt2bgQth_sbKTchTUJdk-ESjsDtSkK9zIcQ&s" />
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
        </View>

        <View style={styles.priceSection}>
          <Text style={styles.priceTitle}>Total Package Price</Text>
          <Text style={styles.totalPrice}>{`INR ${req?.totalPrice || '22000'}`}</Text>
        </View>

        <View style={styles.footerContainer}>
          <Image style={styles.footerLogo} src={logoB64Str || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTglPjDIgJW4YQub0z-s9tDr2dn7kOrIVTuzw&s"} resizeMode="contain" />
          <View style={styles.footerDetails}>
            <Text style={styles.footerText}>{req?.address}</Text>
            <Text style={styles.footerText}>Email: {email}</Text>
            <Text style={styles.footerText}>Phone: {detailsPhone}</Text>
          </View>
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </View>
    </Page>
  </Document>
);

const styles = StyleSheet.create({
  // (Style definitions remain the same)
  page: {
    fontFamily: 'Roboto',
    fontSize: 12,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  headerImage: {
    width: '100%',
    height: 100,
    objectFit: 'cover',
    marginBottom: 20,
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
    width: 100,
    alignSelf: 'center',
  },
  body: {
    paddingBottom: 65,
    paddingHorizontal: 35,
    backgroundColor: '#ffffff',
    paddingTop: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333',
    marginBottom: 20,
    marginTop: 20,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionHeader: {
    flex: 1,
    backgroundColor: '#b352d1',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  hotelContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
  hotelImage: {
    width: 80,
    height: 80,
    marginRight: 15,
    borderRadius: 5,
    resizeMode: 'cover',
  },
  hotelDetails: {
    flex: 1,
    flexDirection: 'column',
  },
  hotelName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#0D3B66',
  },
  roomDetails: {
    marginVertical: 5,
    padding: 8,
    backgroundColor: '#ffffff',
    borderRadius: 3,
  },
  roomType: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#333333',
  },
  roomOccupancy: {
    fontSize: 12,
    color: '#777777',
    marginBottom: 2,
  },
  mealPlan: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#888888',
  },
  exclusionContainer: {
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  bullet: {
    marginBottom: 10,
    fontSize: 12,
  },
  priceSection: {
    marginVertical: 20,
    alignItems: 'center',
  },
  priceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF6347',
  },
  footerContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  footerLogo: {
    width: 60,
    height: 60,
  },
  footerDetails: {
    marginLeft: 10,
  },
  footerText: {
    fontSize: 12,
    color: '#777777',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#777777',
  },
});

export default HtmlPdfView;
