import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font, PDFViewer } from '@react-pdf/renderer';
import moment from 'moment';

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
  if (!timestamp) return 'N/A';
  return moment.unix(timestamp).format('DD-MM-YYYY');
};

const HtmlPdfView = ({
  packageData: {
    packageId,
    hotels = [],
    req = {},
    createdAt
  },
  userData: {
    userPhone,
    logo,
  },
  userDetails: {
    email,
    phone,
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
          style={[styles.logo, { position: 'absolute', top: -50 }]}
          src={logo || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTglPjDIgJW4YQub0z-s9tDr2dn7kOrIVTuzw&s"}
          resizeMode="contain"
        />

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
            <Text style={styles.value}>{req?.adultPax} Adult {req?.childPax ? `| ${req?.childPax} Child` : ''}</Text>
          </View>
        </View>

        <View style={styles.hr} />

        <View style={styles.sectionHeaderContainer}>
          <Image style={styles.sectionIcon} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROpNdGfaqSeeq9hgJdiSPuHCYMjX0RFSkRNQ&s" />
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transfer</Text>
          </View>
        </View>
        <View style={styles.transferContainer}>
          <Text style={styles.transferText}>
            {`All tours and transfers are private by ${req?.cabType || 'N/A'} from ${formatDate(req?.startDate)}.`}
          </Text>
        </View>

        <View style={styles.hr} />

        <View style={styles.sectionHeaderContainer}>
          <Image style={styles.sectionIcon} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTochMAC1-AZcxH2IICWlZb4IBzHMYSSksPzw&s" />
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Hotels</Text>
          </View>
        </View>

        {hotels.map((hotelsCurrDay, currDayIndex) => (
          <View key={currDayIndex} style={styles.daySection}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayTitle}>Day {currDayIndex + 1}</Text>
            </View>
            {hotelsCurrDay.hotels.map((hotel, hotelIndex) => {
              const { location, hotelName, selectedRooms = [] } = hotel;

              return (
                <View key={hotelIndex} style={styles.hotelContainer}>
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
        ))}

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
          <Image style={styles.footerLogo} src={logo || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTglPjDIgJW4YQub0z-s9tDr2dn7kOrIVTuzw&s"} resizeMode="contain" />
          <View style={styles.footerDetails}>
            <Text style={styles.footerText}>{req?.address}</Text>
            <Text style={styles.footerText}>Email: {email}</Text>
            <Text style={styles.footerText}>Phone: {phone}</Text>
          </View>
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </View>
    </Page>
  </Document>
);

const styles = StyleSheet.create({
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
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
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
  infoBox: {
    marginVertical: 10,
    padding: 15,
    width: '100%',
    backgroundColor: '#0D3B66',
    color: '#ffffff',
    borderRadius: 5,
  },
  infoRow: {
    flexDirection: 'row',
    marginVertical: 3,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 5,
    color: '#ffffff',
  },
  value: {
    fontSize: 12,
    color: '#ffffff',
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
  sectionIcon: {
    width: 25,
    height: 25,
  },
  daySection: {
    marginBottom: 20,
  },
  dayHeader: {
    backgroundColor: '#B8E0D2',
    padding: 8,
    borderRadius: 3,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  dayTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  hotelContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    // Removed boxShadow and shadow properties
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
    // Removed boxShadow
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
    marginVertical: 1, // Reduced vertical spacing between points
    lineHeight: 1.5, // More compact but readable spacing
    color: '#555555',
  },
  priceSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  priceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
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
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#dddddd',
    backgroundColor: '#f0f0f0',
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
    bottom: 15,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
});

const RenderPreview = (props) => (
  <div style={{ width: '100%', height: 'auto' }}>
    <PDFViewer width={'100%'} height={'800'}>
      <HtmlPdfView {...props} />
    </PDFViewer>
  </div>
);

export default RenderPreview;
