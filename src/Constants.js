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

export const PACKAGE_TYPES = {
  "package": "Package",
  "hotels": "Hotels",
  "transport": "Only Transport"
}

export const DIR_POLE_IMG_B64 = "data:image/jpeg;base64,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"
export const DIR_BANNER_IMG_B64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCACmAMMDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9U6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACikNZms+JNK8OxeZqepWtgp6faJlTd7DPJ/CgDUorjj8Ro71T/AGLo2qawuMiZYPs8H1MkxUEe4zUMfjrUrNbW81bTbKDSLiVYDeWGofaRbMxCr5o8tQFJIG5ScEjPHNAHb0U1fu8nNOoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACikNZ2teINN8O2v2jU7+3sIc4DXEgXcfQAnJPsOaANKms2K4/8A4TPVdc48O6DNLCemoasTaQY9VUgyMP8AgIHvWNrjQ2siJ4v8ZSGaT7ukaPm23+wVC07j/gWPagDrda8baL4flW3vdQj+1twtpCDLO30jTLH8qzf+En8RaxgaP4ba1iPS71uYQD6iJNzn6HbWVoa3ttC0XhLwfBols/3r3Vh5Bf3Ma5kY/wC+V+tabeArjWOfEeu3mqqetnbH7Ja/Qqh3MP8AeY0Ac/rGox/amtdc8YXV/eE86N4ahKNn+6RHul/EuoqXRvDt+snm6D4W03wxuPOoati5vWHrsU5z/vSfUV3em6Tpvh21WCws7bT7fOPLgjWNSenbGTWfB40s7zWJNOtLa8vPJlNvPdwQE28MgGSrP0yO+M4PBxQBj3/gvS7ezk1Dxdq9xrEMOHk/tGUR2iHPB8lMJ1x94HrXJ6n4g8F2OuRx2U9p/YWr272GpWlrEUjU7S0U2FXH95CR/eT+7XbeNMahrnhXSjhkmvzdyL1+SCNnHH/XQxVXtb3xH4m1HWH03VbHTdPs7xrOJZ9Pa4dyirvYt5q/xl1xj+HrQBleCfinotpo5sNY1uFbmxka3W8mJQXUS48uXJHUqQDn+IGuph+JPhO4+54m0gn0N9ED+W6mLp/i6OMj+3dHlbsX0eUfyuagk0fxNMn7+Tw9ct3DafIAfzlNAG1a+JtIvji21WxuD/0yuUb+RrRSRZBlGDD1U5rgr7wbf3anzfDXhG+PpPEy/r5bVjt4DkXJf4c+HCw/jsdRMTfh+4H8xQB6tzS15QugrZLufwh4m05/72k63vX/AL5FwP8A0Gg3VvagltY8daOF/iuLOS4QfVjDIP1oA9Yorym38UFZhHH8T7NX7R6tp8MbfTGYjW/Y6z4qnUPayeG9dhHVrW5lgY/TiQfrQB29Fch/wnN1ptxFHrugXmkwyyJCt4kkdxBvdgiglDuXLMByoHvXXKcjNAC0UUUAFFFFABTWzn+lOpDQB57qOvajrVvqF9JrUPhbw3aTy2zXSIr3MxjcxuwZsrGC4IUAMx698Vn6LbwJdG68N+FbvVL5v+Y74hkaPP8AtBpAZSP9xQKh8TWc+j6xqdrbxef5c6eJrCAjIldDi5hHuchx7yZ7V6hp99Bqljb3lrIs1tPGssUi9GUjIP5UAct/wieta182u+IZhE3JsdGU2sX0MmTIw+jL9K29B8KaP4ajddM063sy/wB+REzI/wDvOfmY/UmteigBKRqdVa8vrfT4/Nup4raLcq+ZK4RdzHAGT3JwB9aAOd1LwbF4i8ST3WtRQahpcMCR2VlKN6I53ebI6MNpbBUA84APrUvgfwLZeA9OazsZ7qdZG3sbiUsM5J+VR8qDLE8AV0oowOKAON1C6jHxJjllIEGmaLLOzHovmyrz+UDU74U3EN34E024hnine4D3M7QuHxNI7SOpI7hmIIPTFc34tnkY/ESWI4mmhs9GibuGkXHHvm5FdFqPgX+z7uDUvC7Q6VqcexJY2BFvdxjjbKqjqB0ccjgcigDslpa4/wD4SrVtAkh/4STT7W2s5ZFi/tKxuDJDEzEBRKrqrICeN3IyRnFdetAC0UUUAFFFVtShnubG4htrj7JcSRssdwEDGJiMBtp4ODzg0ASXEMc6+XKiyRt1V1BBrzjWrz4bTzzxz6fp99dQsUY2enmV94/gDxp972zkGsk/DHxWXYalqI8QRnILSa1d2mQevyIrKMjjjiut0/UPEOh2MVnB4MhS2gTZFDY6lGwAHQfOqfnQBwVvCk0PiCG3sLrR7SbVtJsYrG6mLmNhNHI7bdzBSVdSVB4wM817iteR6BK+tR+G5pIjDLq/iK71OSJmDFEhSVVBI4ONkQyPavXaACiiigAooooAKKKKAOS+I1rLBpltrtqhe80Sb7YFUfNJDgidPxjLfiq1W8A3Uem3l9oEcivaIBf6ZIv3XtJSSAv+4+5foUrtJFDKVYBgRggjINeSKsnhZX2hjN4RudwXktLpM3JHvsA/O396APWz/nms2+8SaXpt/a2N3qVrbXt0cQQTTKjyc8bQTk88e9ReIJNRn0Uf2I6fapniRJ/lIjjZ1DyAHhiqFmA74HB6HlfCfw3vtP8AEGo6vrurHVnnkxHbyRRsNq/6tnfYuWHUBQoBJ69aAPQV6dc1zvxG0H/hJvBGtaaF3STWzGMYz+8X5k/8eVa6NaDQB5p4b1bUPDHh/TdThE+s+FLq3jnCLmW605WUHA6mWJend1A/ixx6Dpuo2urWMN5ZXEd3azLvjmjbcrD1BrmPhuBp9nq+iN8v9k6hLDGp/wCeMhE0X/jsgH/AaXUPC95oN9NqvhgxxySN5l1pMrbbe7Pdl/55Sf7QGD/EO4AOOvzeX0ojsEhlvdQ8XSSoly7LGy2sZ+8wBIANuo6HqK7Rtc8W2inz/C9rd4/6B+qBifwljT+dcj8PmbVNS8IPIpR/sep6rIGwTumuFAzjgnDtz7V63QBwt94zS/s57HV/CGvxW08bRTKbNblCpGCP3TuT19K59NYfQo92leML2K1jG1bTxHpUzIMfw+ZsRx+JbFet0lAHHeAfiAPGTXtu9t5dzZ7d89uWe2lznmN2VT26EAj3rU1/xda6BNBa+XPf6ncAmDT7NA80gH8XJwqj+8xA9+1bjd65LwNGt7feItXlXN9NqM1qWPVYYW8tEHoPlLfVzQAj+MdasVE+oeE7yKz6vJaXEdxJGPVowQT9F3Guk0nVLTW9OgvrGdLq0nXfHKhyCP6HtjqOlWumK5Dw6iaN408SadFtispIrfU9g4WOSQyJJ9M+UG+pJ70AdhWd4k1NdD8P6nqJwBaW0k/P+ypP9Kxp/ih4Vt1mK69ZXMsZ2/Z7aUSzO2cBUjXLMc4GFHeua8ceJNU17QV01vDd5YWWq3NvYi5u5olbbJIobMYYsPl3daAJ/B+mGz8QeGNNcEnSPDweTPXzZmRcn3/dSfma9IFcl4VX7Z4s8W6h1QXENgh9oogx/wDH5XH4V1tAC0UUUAFFFFABRRRQAVxnjaJNH1jSvEDIptAf7N1EMMg28zAKx9lk2fg712dUtZ0uDXNLu9Puk3211E0Mi/7LDB/nQBzvgGZ9NjvvDdw7GbR5BHAznmS0YEwtn2GUJ9Y/euuAxXllpqdxp8el65eNm+0aZtD1th/y0hJASc+2TFL9JHr1NaAFpG/+tVbUr+PS7C5vJg5ht4mmfy1LNtUEnAHU4HSuUi8davqNjb3emeDdSuoZ0EkbzXdpEGUjII/ek4Ix2oAqa1qU/hP4jeZbabdan/bliFWC1KAmaBjyS7KANkg5z/B0qxqWteLxpl3dR6XpukQQwvKXu7tp5MBSfuRqFHT+/VPVLTxn4k1DSbtNK0vQ5NPuDMj3N69w7Bo2RlKogGCGz97+EVzPxKlew0HV7bX/ABtPLqb2UjQabYoLSEswKqG27mYE8YZhuweKAN34aWfkaxpsOP8Ajz8L2EbezSNIT/6AK9MrjPCVuIPG3iVB923trC2HH91JD/7PXZ0ALRVe/wBQttLtZLm7uIrW3jGXlmcKqj3Jrlk+I0eqNjQNH1LXo/8An6hjWG2P0llKhv8AgOaAOvauLuFu/A+tahfQ2c2oaFqMn2i4jtFMk1pPtCs4QcujbQTt5BBODkkTn4gppsqpr+k32gRkgC6uAsttk8AGWMsF/wCB7a6uGRLiNJEZZEYblZSCCCOoNAHlOufFDV77xAlloFrdTaY0YP2y20mW4lD85DK7RqgHH96stotPk1K6m8S6tr7RXjRvdWs+iSwxziMEIjNGh+QZyVzgknJr2w/SlWgDj4fiD4QtreGP+0LWyhiH7pJojAIwAQMBlGOP0rP1DxLpPi/xb4Xs9L1Oz1KC2lm1K4NrOkmwRxlELYJx80wPP92vQCM15d4muvJ1HxzqVsixTWemxaXbsox/pEoLficyQ/lQB0/wxUyeEYL51xJqU02oNkdpZWdf/HSo/CurqrpWnx6TpdnYwjENtCkKD/ZVQB/KrVABRRRQAUUUUAFFFFABSGlooA4XxHp8Gn+K1kuY1k0nxHD/AGZeoennBW8pj/vKXj+uytHwDqFxJpM2lXrmTUdHlNlO7dZFABjk/wCBxlW+ufStLxVoK+JNBu9PZ/KeVcxTDrFKpDI491YKfwrgv+EqfTW0vxc1pKxuE/sjWLK2UM63KOVjIBI6S7kye0qmgD0m8vraxEYuriGAStsQTOF3H0GTycV55ql+3gC8it/DV5b6mt1LiPwyzlnBJJZoHXJjXuQwKDnBXodnTPCr+JLmbVfFdhbzTSL5Vtpk4WaOzhJBIIOVMjEAswz0ABwOd/Q/C2j+HBJ/Zel2enmT75toFQt9SBzQBzul+EfEiwpNd+L72K7nzJdQwwwyRRsSTth3xkqAMAZyDjOKq+MfDtn4d8B3tpaCR5b27tY5ridy807yXESFnY8k4P0AGAAK9BrkviN+8ttBgxxLrVnn6LJ5h/8AQKAGeHJo4fFPja6kdYoY7qBGd22qoW1iYknsBupG8YX/AIizF4Ws1uIc4OsXwZLRfdAMNL/wHC/7VY3h/wAH2fiPxN4ovtSea7to9WIj0+Rv9GLrBCPMZP4zxj5sgY4FekxqFUAAALwB6UAcnY/Dyzluo77XLiXxHqCHcst8AYoj6xwj5E+vJ9zXWKoVcDp2paRs9jigBk0aSKUdFdGBUq3Qg9RivNYmvtH8TXWj+CXhuLPaxuoboMbTTJe2xh1J5zCOh5yozW1d6veeNryfTdEuGtNLhbyr3WIuSxHDRW56Fh0MnRegyenT6Po9noenQ2VhAtvaxDCoo/Mknkk9yeSeTzQBzkPw4tbtRNrWo6hrV+eWuDdy26Kf+mccTBUH059SaWTQfEGgYk0TVm1G3Xk6brDmTI9EuAN6n/f3119LQBg6D4st9auJbOWKXTtVgXdNp90MSKM43rjh0zxuUkeuDxXBae39rabooPL+IPEcmouuf+WELNIhPqNkEI/Guq+KtjZzeDdRvbiJvtdjC8tlPC5jlinIwmx1wVJYgHB5zVDw9pK2vjLS9NTDW/h3Q0hGOgklYLn67YD/AN9UAd+vTmlpBS0AFFFFABRRRQAUUUUAFFFFADWrz/XdGgh8S3+k3WU0jxVCwDL/AMsr2NOo9CyKGH+1Ca9BrC8beH5PEXh+e2tnEOoRMtzZzH/lnOh3Rt9MjB9iaAOf07x3qmn6fb2GoeGdbvtZhURTNaWw8iVhx5iysyptbGcZyM4NWf7a8b6jxaeHNP0lP+emp35kP/fESnn/AIFW94T19PE2gWmorGYXlUiWFvvRSqSsiH3Vgw/CtegDiv8AhG/F2pHN/wCLks0b70OkaeiY+jyFz+QFY2seC4NH8ReEZjqWqandyargvqF48uFW3mc4ThAcqOg45r06uS8WfN4v8FJ2+23DflaTf40AQWei+JdBudXbTn0m5gvLyS7Vboyo43YG0lQRxgc4qddW8ZQ7hL4d0ufH8VvqzjP0DQD+ddYKWgDkh4o8SJ/rfBtw/wD176hbt/6Ey1zvi7xF4g1qS20//hF9esdIkB+3Pa+Q1xKP+eaFZvlU92BzjgAda9PpKAOHt/HUOk28NnB4P8RQW8KhI44dPUoijoBtc1cX4hRYz/YHiEe39mPXWUtAHLjx9beXvfSNdT2/sqZj+imiL4hafJndYa7EPVtEvD/KI11FFAHnPiDxVp/jS60nQtPF3LJLqMMl0k1jPAFhiJmJYvGo+9Gq4/2q1vALf2hP4i1o8i/1KRI2HQxQAQrj8Y3P41r+MNbHhvwvqep8bra3d0UjO58fKv4tgfjSeDdFPh3wrpWmtzLbW6JI2c5kxlz+LEn8aANleKWiigAooooAKKKKACiiigAooooAKT+KiigDi7+y1XwjqWpX2jw2d5Yag4nltLqd4DFPjazqyo+QwC5GByCcnNH2rx7eKWgtvDlmn96S4uJz+QRP50UUAJ/wjfi/UD/pni9LRG6xaXpyJ+TyM5/SsHxV4c/4QVdO8WHU9U1o6VcNJPHqF4X3RPG8bbFC7A2XB6DgYzRRQA7Q/wBobw7r8hjt7LVEYH/lpFGB+khrf/4WrpP/AD73n/fCf/FUUUAH/C1tJ/5973/vhP8A4qqeofGnRNOAMlrqDZ/uxp/8XRRQBn/8NBeHRx9j1T/v1H/8crM1L9p/wzp7bf7O1Z3/AOucQH/oyiigCTT/ANomx1hAbHR7hmPGLiVUH6Bq6ax8XeJNcQf2fo+lxk/xXOpScfgIP60UUAOuPDviHxNPZw69d6dDp0M0dy9np8UjGdkYMoaRyMKGCnG3nHWu0XpRRQA6iiigAooooAKKKKAP/9k="