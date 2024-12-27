<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Inter', sans-serif;
      margin: 0;
      background: linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('/api/placeholder/1920/1080') center/cover fixed;
      color: #2D3748;
      line-height: 1.6;
    }

    .header {
      background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/api/placeholder/1920/600') center/cover;
      color: white;
      padding: 4rem 2rem;
      text-align: center;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .card {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 2rem;
      margin-bottom: 2rem;
    }

    .guest-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .info-item {
      background: #F7FAFC;
      padding: 1rem;
      border-radius: 0.5rem;
      text-align: center;
    }

    .day-card {
      border-left: 4px solid #4299E1;
    }

    .itinerary-list {
      list-style-type: none;
      padding-left: 0;
    }

    .itinerary-list li {
      padding: 1rem 0;
      border-bottom: 1px solid #E2E8F0;
    }

    .policy-section {
      background: #EDF2F7;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-top: 1rem;
    }

    h1 {
      font-size: 3rem;
      margin: 0;
    }

    h2 {
      color: #2B6CB0;
      border-bottom: 2px solid #4299E1;
      padding-bottom: 0.5rem;
      margin-top: 2rem;
    }

    .price-card {
      background: #2B6CB0;
      color: white;
      text-align: center;
      padding: 2rem;
      border-radius: 1rem;
      margin-top: 2rem;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Kerala Travel Itinerary</h1>
    <p>Experience God's Own Country</p>
  </div>

  <div class="container">
    <div class="guest-info">
      <div class="info-item">
        <strong>Lead Passenger</strong>
        <p>Promoth Vinayak</p>
      </div>
      <div class="info-item">
        <strong>Travel Date</strong>
        <p>29-Nov-2024</p>
      </div>
      <div class="info-item">
        <strong>Group Size</strong>
        <p>4 Adults | 2 Children</p>
      </div>
    </div>

    <div class="card">
      <h2>About Kerala</h2>
      <p>Escape to Kerala, India's "God's Own Country," where lush green landscapes meet pristine beaches. Experience the serenity of backwaters, cruise through tranquil canals lined with coconut palms. Explore vibrant spice gardens, savor authentic Kerala cuisine, and indulge in Ayurvedic treatments. From the bustling city of Kochi, with its colonial history and cultural heritage, to the tranquil hill station of Munnar, Kerala offers a diverse and unforgettable travel experience.</p>
    </div>

    <div class="card day-card">
      <h2>Day 1 - Arrival & Munnar</h2>
      <p><strong>Hotel:</strong> Arbour Resort Premium Hotel</p>
      <p><strong>Room:</strong> Garden Cottage Family Suite</p>
      <ul class="itinerary-list">
        <li>Welcome to Kerala! Arrive at Cochin International Airport (COK) and meet your friendly driver for a comfortable transfer to Munnar (approx. 4-hour drive).</li>
        <li>Enjoy the scenic beauty of the countryside as you journey through lush landscapes and picturesque tea plantations.</li>
        <li>Upon arrival in Munnar, check into your cozy and comfortable accommodation at Hotel Arbour Resort.</li>
        <li>After settling in, embark on a delightful sightseeing tour of Munnar's iconic attractions, including the captivating Eravikulam National Park.</li>
        <li>Experience the breathtaking panoramic views from the Mattupetty Dam and indulge in the aromatic beauty of the Munnar Tea Museum.</li>
      </ul>
    </div>

    <div class="card day-card">
      <h2>Day 2 - Munnar Exploration</h2>
      <p><strong>Hotel:</strong> Arbour Resort Premium Hotel</p>
      <p><strong>Room:</strong> Garden Cottage Family Suite</p>
      <ul class="itinerary-list">
        <li>Pick up from Arbour Resort.</li>
        <li>Drive to Munnar, a scenic hill station known for its tea plantations and breathtaking views.</li>
        <li>Explore the rolling hills and lush greenery of the Munnar Tea Gardens, enjoying the panoramic vistas.</li>
        <li>Visit the Eravikulam National Park, home to the endangered Nilgiri Tahr and other diverse wildlife.</li>
        <li>Return to Arbour Resort for an overnight stay.</li>
      </ul>
    </div>

    <div class="card day-card">
      <h2>Day 3 - Munnar Discovery</h2>
      <p><strong>Hotel:</strong> Arbour Resort Premium Hotel</p>
      <p><strong>Room:</strong> Garden Cottage Family Suite</p>
      <ul class="itinerary-list">
        <li>Pick up from Arbour Resort in the morning.</li>
        <li>Drive to Munnar, a picturesque hill station known for its tea plantations and stunning landscapes.</li>
        <li>Explore the lush green tea gardens of Munnar, including the famous Eravikulam National Park.</li>
        <li>Visit the Mattupetty Dam, a beautiful reservoir with breathtaking views of the surrounding hills.</li>
        <li>Return to Arbour Resort in the evening for an overnight stay.</li>
      </ul>
    </div>

    <div class="card">
      <h2>Package Details</h2>
      
      <h3>Inclusions</h3>
      <ul>
        <li>6 nights accommodation on double/twin sharing with breakfast</li>
        <li>Entire travel in a private vehicle as per the itinerary</li>
        <li>Airport pick up and drop</li>
      </ul>

      <h3>Exclusions</h3>
      <ul>
        <li>GST and TCS extra as applicable</li>
        <li>Any other meals which are not mentioned in the inclusion column</li>
        <li>Any personal expense</li>
        <li>Any expense arises due to natural clamity</li>
      </ul>

      <div class="policy-section">
        <h3>Cancellation Policy</h3>
        <ul>
          <li>45 - 30 days: 50% of the total cost</li>
          <li>30 - 15 days: 75% of the total cost</li>
          <li>15 - 0 days: 100% of the total cost</li>
          <li>Visa Fee & Service charges are non-refundable</li>
          <li>No refund for unused services</li>
        </ul>
      </div>

      <div class="policy-section">
        <h3>Payment Policy</h3>
        <ul>
          <li>Pay ₹3,000 per head to reserve your seat</li>
          <li>Remaining amount due 30 days before the trip</li>
          <li>Final payment must be completed 24hrs before trip start</li>
        </ul>
      </div>
    </div>

    <div class="price-card">
      <h2>Total Package Price</h2>
      <h1>₹15,255</h1>
      <p>Contact: +917880473111</p>
      <p>Email: subhdcode@gmail.com</p>
    </div>
  </div>
</body>
</html>