/*
  IT Mechanic — edit this file to change what the site says.
  Reload the page after saving. You do not need to edit index.html.

  Confirmed and left off this site on purpose:
  - The Companies Register office address is a Lincoln street address.
    It is not shown here. Put a public street in `street` only if
    customers should visit that address.
  - No email is listed on the register. Leave `email` empty until you have one.
  - Hours are not published. Leave `publishHours` false until you choose them.
    Do not copy hours from the Napier business of a similar name.
*/

window.SITE = {
  name: "IT Mechanic",
  legalName: "The IT Mechanic Limited",
  companyNumber: "9422682",
  nzbn: "9429053606808",

  // Public location. You said Christchurch. The register's office is in Lincoln.
  city: "Christchurch",
  region: "Canterbury",
  country: "New Zealand",
  street: "",
  suburb: "",
  postcode: "",

  contactName: "Anton",
  phoneDisplay: "021 152 9543",
  phoneTel: "+64211529543",
  email: "",

  // Set publishHours to true after you fill open/close (24-hour "HH:MM").
  // Use null for a closed day.
  publishHours: false,
  hoursNote: "Call to arrange a time.",
  hours: [
    { day: "Monday", open: null, close: null },
    { day: "Tuesday", open: null, close: null },
    { day: "Wednesday", open: null, close: null },
    { day: "Thursday", open: null, close: null },
    { day: "Friday", open: null, close: null },
    { day: "Saturday", open: null, close: null },
    { day: "Sunday", open: null, close: null }
  ],

  services: [
    {
      title: "IT support",
      text: "Support so your systems stay managed, and you can keep the business moving without chasing every fault yourself."
    },
    {
      title: "Devices, networks, and accounts",
      text: "Help with the computers, networks, and accounts you rely on, and how they fit together."
    },
    {
      title: "Security",
      text: "A practical look at whether your devices, networks, and accounts are properly secure. A breach can be costly for a business of any size."
    }
  ],

  reasons: [
    {
      title: "Locally owned",
      text: "The IT Mechanic is a locally owned and operated IT service provider, based in Christchurch."
    },
    {
      title: "Speak to Anton",
      text: "Call and describe what you need. We will work out the best way to support it."
    },
    {
      title: "Computer consultancy",
      text: "The IT Mechanic Limited is a registered New Zealand company. Its recorded activity is computer consultancy."
    }
  ]
};
