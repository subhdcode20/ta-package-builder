import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import useMediaQuery from '@mui/material/useMediaQuery';

import "./globals.css";
import "./styleguide.css";
import "./style.css";

const bull = (
	<Box
		component="span"
		sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
	>•</Box>
);

const PbHomepage = () => {
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

	return (<>
			{/* <Helmet>
				<meta charset="utf-8" />
				<link rel="stylesheet" href="globals.css" />
				<link rel="stylesheet" href="styleguide.css" />
				<link rel="stylesheet" href="style.css" />
			</Helmet> */}
		  	<div class="home">
			  <div class="top-bar">
				<div class="wallet-logo" style={{ marginTop: '-49px', marginLeft: '16px' }}>
					{/* <div class="wallet">AgentFlow</div> */}
					<img src='/afLogoDarkBg.png' alt="logo" width={'100%'} />
				</div>
				<Box sx={{ display: 'flex', marginRight: 4 }}>
					<Button variant="text" href="/login" sx={{ margin: 'auto', marginRight: 2 }}>Login</Button>
					{!isMobile && (<Button variant="contained" href="/signup" size={isMobile ? "small" : "medium"} sx={{ margin:'auto' }}>Request a Demo</Button>)}
				</Box>
				{/* <a
				  href="https://animaapp.com/?utm_source=figma-samples&utm_campaign=figma-lp-pets&utm_medium=figma-samples"
				  target="_blank"
				  rel="noopener noreferrer"
				  >
					<div class="primary-CTA"><div class="get-started">Request a Demo</div></div>
				</a> */}
			  </div>
			  <div class="header">
				<div class="overlap">
				  {/* <div class="bg"></div> */}
				  {/* <img class="image" src="img/image-2.png" /> */}
				  <div class="frame">
					<p class="title" style={isMobile ? { fontSize: '1.2rem', maxWidth: '80%', textAlign: 'center', lineHeight: '30px' } : {}}>The Simplest &amp; Fastest tool {isMobile ? <br /> : ''} to make Itinerary PDFs</p>
					<p class="subtitle" style={{ lineHeight: '24px' }}>
					  Transform the way Travel Agents share Quotations <br />Save time, maximize margins, and impress clients without
					  breaking a sweat.
					</p>
					<Button variant="contained" href="/signup" sx={{ margin:'auto' }} size="large">Watch Demo</Button>
					{/* <a
					  href="https://animaapp.com/?utm_source=figma-samples&utm_campaign=figma-lp-pets&utm_medium=figma-samples"
					  target="_blank"
					  rel="noopener noreferrer"
					  ><div class="get-started-wrapper"><div class="get-started">Get started for Free</div></div></a
					> */}
				  </div>
				  {/* <div class="group">
					<div class="overlap-group">
					  <img class="whatsapp-image-jan" src="img/whatsapp-image-jan-17-2025-1-1.png" />
					  <img class="img" src="img/whatsapp-image-jan-17-2025-2-1.png" />
					  <img class="whatsapp-image-jan-2" src="img/whatsapp-image-jan-17-2025-1.png" />
					</div>
				  </div> */}

				  <img src="/landing-banner.png" width={isMobile ? "95%" : "80%"} height="auto" class="banner-img" />  

				  {/* <img class="airport" src="img/airport.png" />
				  <img class="airport-2" src="img/image.png" />
				  <img class="beach" src="img/beach.png" />
				  <img class="suitcase" src="img/suitcase.png" />
				  <img class="next-location" src="img/next-location.png" />
				  <img class="taxi" src="img/taxi.png" /> */}
				</div>
			  </div>
			  <div class="product-image" style={ isMobile ? { height: '300px', padding: '16px 16px' } : {} }>
				<div class="div">
				  <img src="/screenshot-af.jpg" width="100%" />
				</div>
			  </div>
			  <div class="features" style={{ padding: isMobile ? '32px 8px' : '48px 8px' }}>
				<Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'center', textAlign: 'center' }}>
				<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', textAlign: 'center' }}>
					<div class="feature">
					  <div class="icon"><img class="img-2" src="/doc-icon-landing.png" /></div>
					  <div class="tile" style={isMobile ? { fontSize: '1.2rem', textAlign: 'center', lineHeight: '30px' } : {}}>Customized Templates</div>
					  <br />
					  <p class="p" style={isMobile ?{ textAlign: 'left' } : {}}>
						{bull} Change template and PDF images with 1-click.<br /><br />
						{bull} Professional templates with your branding.<br /><br />
						{bull} 1 new template added every 2-weeks.
					  </p>
					</div>
					<div class="feature">
					  <div class="icon"><img class="img-2" src="/math-icon-landing.png" /></div>
					  <div class="tile" style={isMobile ? { fontSize: '1.2rem', textAlign: 'center', lineHeight: '30px' } : {}}>Offload Grunt work to AI</div>
					  <br />
					  <p class="p" style={isMobile ?{ textAlign: 'left' } : {}}>
					    {bull} Just fill your Location and Hotel details.<br /><br />
						{bull} Generate daily itinerary with just 1-click.<br /><br />
						{bull} Auto-generated destination information.
					  </p>
					</div>
				</Box>
				<Box sx={{ display: 'flex', flexDirection: 'row' }}>
					<div class="feature">
					  <div class="icon"><img class="img-2" src="/robot-icon-landing.png" /></div>
					  <div class="tile" style={isMobile ? { fontSize: '1.2rem', textAlign: 'center', lineHeight: '30px' } : {}}>Calculator for Your Rates</div>
					  <br />
					  <p class="p" style={isMobile ?{ textAlign: 'left' } : {}}>
					    {bull} Upload your rate-sheets according to destination.<br /><br />
						{bull} Select your hotels, room-types and transfers.<br /><br />
						{bull} Edit Auto-calculated price if needed.
					  </p>
					</div>
					<div class="feature">
					  <div class="icon"><img class="img-2" src="/timer-icon-landing.png" /></div>
					  <p class="tile" style={isMobile ? { fontSize: '1.2rem', textAlign: 'center', lineHeight: '30px' } : {}}>Itinerary Creation &amp; Tracking</p>
					  <br />
					  <p class="p" style={isMobile ?{ textAlign: 'left' } : {}}>
					    {bull} Live-preview your PDF while editing.<br /><br />
						{bull} Only fill important details, leave the rest to us.<br /><br />
						{bull} Track all itinerary changes and updates.
					  </p>
					</div>
				</Box>
				</Box>
			  </div>
			  <div class="user-feedback">
				<div class="overlap-group-wrapper">
				  {/* <div class="overlap-group-2"> */}
				  <Box className="overlap-group-2" sx={{ display: 'flex', flexDirection: 'column', px: 1 }}>	
					<img class="quote-icon" src="img/quote-icon.svg" style={{ margin: 'auto' }}/>
					<p class="text" style={{ margin: 'auto' }}>
					  AgentFlow has been a game changer for our agency. We save hours on every itinerary, and our clients love
					  the results! The team keeps adding more and more templates and features over time, we’re able to use these
					  to set ourselves apart from the competition.
					</p>
					<div class="add-name-here" style={{ margin: 'auto' }}>Himanshu</div>
				  </Box>
				</div>
			  </div>
			  <div class="features-px">
				<div class="text-wrapper-2" style={isMobile ? { fontSize: '1.2rem', textAlign: 'center', lineHeight: '30px' } : {}}>Early-Bird Pricing:</div>
				<br />
				{/* <div class="div-wrapper"> */}
					<Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
					  <div class="rectangle">
						<span class="span" style={{ textDecoration: 'none', letterSpacing: '10px' }}>STARTER</span>
						<span class="text-wrapper-4">Rs. 700 /month</span>
						<span class="text-wrapper-5" style={{ lineHeight: '16px' }}>for 3 months</span>
						<br />
						<span class="also">Inclusions:</span>
						<span class="span" style={{ textDecoration: 'none' }}>Itinerary PDF Builder</span>
						<span class="span" style={{ textDecoration: 'none' }}>Hotel Calculator</span>
					  </div>
					  <div class="rectangle">
						<span class="span" style={{ textDecoration: 'none', letterSpacing: '10px' }}>PRO</span>
						<span class="text-wrapper-4">Rs. 1200 /month</span>
						<span class="text-wrapper-5" style={{ lineHeight: '16px' }}>for 6 months</span>
						<br />
						<span class="also">Inclusions:</span>
						<span class="span" style={{ textDecoration: 'none' }}>Itinerary PDF Builder</span>
						<span class="span" style={{ textDecoration: 'none' }}>Hotel+Cabs Rates Calculator</span>
						<Box display='flex' justifyContent={'center'}>
							<span class="span" style={{ textDecoration: 'none' }}>Voucher PDFs </span>
							<span class="also" style={{ fontSize: '10px' }}>&nbsp;( Launch by Feb end )</span>
						</Box>
						{/* <Box display='flex' justifyContent={'center'}>
							<span class="span" style={{ textDecoration: 'none' }}>Lead Tracking </span>
							<span class="also" style={{ fontSize: '12px' }}>&nbsp;(lauch by Mar end)</span>
						</Box> */}
					  </div>
					  <div class="rectangle">
						{/* <span class="span">Rs. 1200</span> */}
						<span class="span" style={{ textDecoration: 'none', letterSpacing: '10px' }}>LEGEND</span>
						<span class="text-wrapper-4">Rs. 1000 /month</span>
						<span class="text-wrapper-5" style={{ lineHeight: '16px' }}>for 12 months</span>
						<br />
						<span class="also">Inclusions:</span>
						<span class="span" style={{ textDecoration: 'none' }}>Itinerary PDF Builder</span>
						<span class="span" style={{ textDecoration: 'none' }}>Hotel+Cabs Rates Calculator</span>
						<Box display='flex' justifyContent={'center'}>
							<span class="span" style={{ textDecoration: 'none' }}>Voucher PDFs </span>
							<span class="also" style={{ fontSize: '10px' }}>&nbsp;( Launch by Feb end )</span>
						</Box>
						<Box display='flex' justifyContent={'center'}>
							<span class="span" style={{ textDecoration: 'none' }}>Lead Tracking </span>
							<span class="also" style={{ fontSize: '10px' }}>&nbsp;( Launch by Mar end )</span>
						</Box>
					  </div>
					</Box>
					{/* <div class="group-3">
					  <p class="rs-rs">
						<span class="span">Rs.2000</span>
						<span class="text-wrapper-3">&nbsp;</span>
						<span class="text-wrapper-4">Rs. 1,500/month</span>
						<span class="text-wrapper-5"> <br />3 months</span>
					  </p>
					  <p class="rs-rs-2">
						<span class="span">Rs.1500</span>
						<span class="text-wrapper-3">&nbsp;</span>
						<span class="text-wrapper-4">Rs. 1,200/month</span>
						<span class="text-wrapper-5"> <br />6 months</span>
					  </p>
					  <p class="rs-rs-3">
						<span class="span">Rs.1200</span>
						<span class="text-wrapper-3">&nbsp;</span>
						<span class="text-wrapper-4">Rs. 1,000/month</span>
						<span class="text-wrapper-5"> <br />12 months</span>
					  </p>
					</div> */}
				{/* </div> */}
				<br />
				<Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
					<p class="text-wrapper-6">Start your 7 Day free trial now.</p>
					<br />
					<Button variant="contained" href="/signup" sx={{ margin:'auto' }} size="large">Get Started for Free</Button>
				</Box>
			  </div>
			  <Box className="overlap-wrapper" sx={isMobile ? { flexDirection: 'column' } : { display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
				<Box sx={{ m: 'auto', display: 'flex', flexDirection: 'column', gap: 3, padding: 2 }}>
				  {/* <a
					href="https://animaapp.com/?utm_source=figma-samples&utm_campaign=figma-lp-pets&utm_medium=figma-samples"
					target="_blank"
					rel="noopener noreferrer"
					><div class="primary-CTA-2">
					  <div class="overlap-group-4">
						<div class="hover"></div>
						<button class="CTA">Request a Demo</button>
					  </div>
					</div></a
				  > */}
				  <div class="title-2" style={isMobile ? { textAlign: 'center' } : { fontSize: '3rem' }}>Coming Soon...</div>
				  <p class="subtitle-3">
					{bull} Create Vouchers for your Packages.<br />
					{bull} Professional Voucher Templates with Your Own Branding.<br />
					{bull} Track leads, Bookings and Accounts.<br />
					{bull} Professional Marketing material for your brand.
				  </p>
				  <Button variant="contained" href="/signup" sx={{ my:'auto', ml: 0, width: 'fit-content', mx: isMobile ? 'auto' : '8px' }} size="large">Get Started for Free</Button>
				</Box>
				<Box sx={{ m: 'auto', display: 'flex', py: 2 }}>
				  <img
					class="GIF"
					width="100%"
					height="100%"
					src="https://cdn.animaapp.com/projects/630dc37cacb332ac4dee2e04/files/1000x800.gif"
				  />
				</Box>
			  </Box>
			  <div class="line"></div>
			  <div class="footer" style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
				<div class="wallet-logo" style={isMobile ? { display: 'flex', alignSelf: 'center' } : { marginTop: '-10px' }}>
					{/* <div class="wallet">AgentFlow</div> */}
					<img src='/afLogoDarkBg.png' alt="logo" width={'100%'} />
				</div>
				<div class="wallet-2" style={isMobile ? { marginBottom: '16px', fontSize: '12px' } : {}}>
					<div class="text-wrapper-8">©</div>
					<div class="text-wrapper-8">AgentFlow 2024</div>
				</div>
				<div class="wallet-2">
					<div class="text-wrapper-8">demo@agentflowhq.com</div>
				</div>
				<div class="wallet-2">
					<div class="text-wrapper-8">+91-7880473111</div>
				</div>
				


				{/* <div class="frame-2">
				  <div class="wallet-2">
					<div class="wallet-3">AgentFlow 2024</div>
					<div class="text-wrapper-7">©</div>
				  </div>
				  <div class="text-wrapper-8">Privacy policy</div>
				  <div class="text-wrapper-8">Cookies policy</div>
				  <div class="text-wrapper-8">Terms of use</div>
				</div>
				<div class="wallet-wrapper"><div class="wallet">AgentFlow</div></div>
				<div class="line"></div> */}
			  </div>
			</div>
		</>)
}

export default PbHomepage;






