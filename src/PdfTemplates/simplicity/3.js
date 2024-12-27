<!DOCTYPE html>
<html>
<head>
  <style>
    :root {
      --ocean-green: #1a6355;
      --palm-green: #2d5a27;
      --sand-color: #e6d5b8;
      --foam-white: #f5f5f5;
      --deep-blue: #1c4652;
    }

    body {
      font-family: 'Inter', sans-serif;
      margin: 0;
      background: var(--foam-white);
      color: #2C3E50;
      line-height: 1.6;
    }

    .header {
      height: 60vh;
      background: url('/api/placeholder/1920/1080') center/cover;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      text-align: center;
    }

    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4));
    }

    .header-content {
      position: relative;
      z-index: 2;
      max-width: 800px;
      padding: 2rem;
      background: rgba(26, 99, 85, 0.85);
      border-radius: 1rem;
    }

    .logo-container {
      background: white;
      padding: 1rem;
      border-radius: 0.5rem;
      display: inline-block;
      margin-bottom: 2rem;
    }

    .logo {
      width: 150px;
      height: 60px;
      background: var(--ocean-green);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      border-radius: 0.25rem;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .guest-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin: -4rem auto 2rem;
      position: relative;
      z-index: 2;
    }

    .info-item {
      background: white;
      padding: 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border-left: 4px solid var(--ocean-green);
    }

    .card {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      padding: 2rem;
      margin-bottom: 2rem;
      position: relative;
      overflow: hidden;
    }

    .day-card {
      background: linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.95)), url('/api/placeholder/1920/1080') center/cover;
      border-top: 4px solid var(--ocean-green);
    }

    .about-section {
      background: linear-gradient(rgba(26, 99, 85, 0.95), rgba(26, 99, 85, 0.95)), url('/api/placeholder/1920/1080') right/cover;
      color: white;
    }

    .about-section h2 {
      color: white;
      border-color: var(--sand-color);
    }

    .itinerary-list {
      list-style-type: none;
      padding-left: 0;
    }

    .itinerary-list li {
      padding: 1rem;
      margin-bottom: 0.5rem;
      background: rgba(230, 213, 184, 0.2);
      border-radius: 0.25rem;
    }

    .policy-section {
      background: var(--foam-white);
      padding: 1.5rem;
      border-radius: 0.5rem;
      margin-top: 1.5rem;
      border-left: 4px solid var(--ocean-green);
    }

    h1 {
      font-size: 2.5rem;
      margin: 0;
      font-weight: 600;
    }

    h2 {
      color: var(--ocean-green);
      border-bottom: 2px solid var(--ocean-green);
      padding-bottom: 0.5rem;
      margin-top: 2rem;
      font-size: 1.5rem;
    }

    h3 {
      color: var(--ocean-green);
      margin-top: 1.5rem;
      font-size: 1.25rem;
    }

    .price-card {
      background: var(--ocean-green);
      color: white;
      text-align: center;
      padding: 2rem;
      border-radius: 1rem;
      margin-top: 2rem;
    }

    .flight-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .flight-item {
      background: var(--foam-white);
      padding: 1rem;
      border-radius: 0.25rem;
    }

    .contact-info {
      background: rgba(255, 255, 255, 0.1);
      padding: 1rem;
      border-radius: 0.5rem;
      margin-top: 1rem;
      display: flex;
      justify-content: center;
      gap: 2rem;
    }

    .accommodation-details {
      background: rgba(230, 213, 184, 0.2);
      padding: 1rem;
      border-radius: 0.5rem;
      margin: 1rem 0;
    }

    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }
      
      .guest-info {
        margin-top: -2rem;
      }
      
      .header {
        height: 50vh;
      }
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