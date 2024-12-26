export const DestNameKerala = "Kerala";
export const DestNameDubai = "Dubai";
export const DestNameKarnataka = "Karnataka";
export const DestNameKashmir = "Kashmir";
export const DestNameHimachal = "Himachal";
export const DestNameUttrakhand = "Uttrakhand";
export const DestNameRajasthan = "Rajasthan";
export const DestNameSikkimDarjeeling = "Sikkim_Darjeeling";
export const DestNameGoa = "Goa";
export const DestNameBali = "Bali";
export const DestNameNepal = "Nepal";
export const DestNameBhutan = "Bhutan";
export const DestNameVietnam = "Vietnam";
export const DestNameMaharashtra = "Maharashtra";
export const DestNamePuducherry = "Puducherry";
export const DestNameTamilNadu = "Tamil Nadu";
export const DestNameThailand = "Thailand";
export const DestNameEurope = "Europe";
export const DestNameTurkey = "Turkey";
export const DestNameSriLanka = "SriLanka";
export const DestNameAndaman = "Andaman";
export const DestNameMeghalaya = "Meghalaya";
export const DestNameAssam = "Assam";
export const DestNameArunanchal = "Arunanchal Pradesh";
export const DestNameOthers = "Others";

export const DestinationNames = [
  DestNameKerala,
  DestNameKarnataka,
  DestNameKashmir,
  DestNameHimachal,
  DestNameSikkimDarjeeling,
  DestNameDubai,
  DestNameBhutan,
  DestNameUttrakhand,
  DestNameRajasthan,
  DestNameMaharashtra,
  DestNameGoa,
  DestNameNepal,
  DestNamePuducherry,
  DestNameBali,
  DestNameVietnam,
  DestNameTamilNadu,
  DestNameThailand,
  DestNameEurope,
  DestNameTurkey,
  DestNameSriLanka,
  DestNameAndaman,
  DestNameMeghalaya,
  DestNameAssam,
  DestNameArunanchal
];

export const MAX_CHILD_AGE = 12;
export const HOTEL_STAR_CAT_OPTS = [
  {
    label: "5 ⭐",
    value: 5
  },
  {
    label: "4 ⭐",
    value: 4
  },
  {
    label: "3 ⭐",
    value: 3
  },
  {
    label: "2 ⭐",
    value: 2
  }
]
export const CabTypes = ["Sedan", "Suv", "Hatchback", "Traveller", "Bus"];
export const DEFAULT_TEMPLATE_NAME = 'green';
export const AF_THEME_PRIMARY_COLOR = '#b352d1';
export const AF_THEME_SECONDARY_COLOR = '#000000bf';
export const MEAL_PLAN_LABEL = {
  "mapai": 'Breakfast and (Lunch or Dinner)',
  "cpai": 'Breakfast ONLY',
  "apai": 'All meals (Breakfast, Lunch, and Dinner)',
}

export const DEFAULT_POLICIES = {
  cancellationPolicyDefault: [
    {text: "Cancellations made 30 days or more before the travel date: 100% refund of the package cost, excluding non-refundable components like flight tickets, visa fees, and service charges."},
    {text: "Cancellations made 15-29 days before the travel date: 50% refund of the package cost."},
    {text: "Cancellations made less than 15 days before the travel date: No refund will be provided."},
    {text: "Air tickets, visa fees, and any other services explicitly marked as non-refundable at the time of booking will not be eligible for a refund under any circumstances."},
    {text: "In case of natural disasters, pandemics, government restrictions, or any other events beyond our control, refund will not be applicable."},
    {text: "Any request to reschedule or amend travel dates is subject to availability and may incur additional charges."},
    {text: "Refunds will be processed within 7-14 business days after receiving the cancellation request and confirmation from suppliers."},
  ],
  paymentPolicyDefault: [
    {text: "A minimum of 25% of the total package cost is required at the time of booking to confirm your reservation. This deposit is non-refundable."},
    {text: "50% Payment: To be made at least 15 days before the travel date."},
    {text: "Final Payment: The remaining balance must be cleared at least 7 days before the travel date."},
    {text: "For bookings made within 15 days of the travel date, 100% of the package cost must be paid at the time of booking."},
    {text: "Payments can be made via bank transfer, credit/debit card, or UPI. Additional charges may apply for international transactions or specific payment methods."},
    {text: "Payment receipts and invoices will be issued for each transaction upon confirmation."},
  ],
  exclusionsDefault: [
    {text: "Unless specifically mentioned, flights/train tickets, visa fees, processing fees and travel insurance are not included in the package."},
    {text: "Expenses of a personal nature, such as laundry, phone calls, minibar usage, beverages, and snacks, are not included."},
    {text: "Sightseeing tours, excursions, and activities that are not explicitly mentioned in the itinerary are considered optional and are not covered."},
    {text: "Meals other than those specified in the itinerary (e.g., lunch, snacks) are excluded."},
    {text: "Entrance fees to some attractions (unless specifically mentioned as included) must be borne by the traveler."},
    {text: "Costs for additional on-demand services like car hires, guides and hotel stuff are excluded."},
    {text: "Any costs incurred due to natural calamities, weather disruptions, flight/train delays, political unrest, or other unforeseen circumstances are not included."},
  ],
  inclusionsDefault: [
    {text: "24x7 support for any travel-related queries during the trip."},
    {text: "Driver allowances, fuel charges, and parking fees are included."},
    {text: "Complimentary honeymoon or celebratory decorations for special occasions (subject to prior request)."},
    {text: "Stay at carefully selected hotels/resorts as mentioned in the itinerary."},
    {text: "Specific meals (lunch/dinner) as detailed in the package inclusions."},
    {text: "Pick-up and drop-off services from the designated airport/railway station."},
    {text: "Entry fees for monuments and attractions if explicitly mentioned/discussed in the itinerary."},
  ]
}
