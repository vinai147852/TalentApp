export const category_options = [
  { value: "Artist", label: "Artist", name: "category" },
  { value: "Anchor", label: "Anchor", name: "category" },
  { value: "Choreographer", label: "Choreographer", name: "category" },
  { value: "Dancer", label: "Dancer", name: "category" },
  { value: "Director", label: "Director", name: "category" },
  { value: "DOP", label: "DOP", name: "category" },
  { value: "Muscian", label: "Muscian", name: "category" },
  { value: "Singer", label: "Singer", name: "category" },
  { value: "Stunt Master", label: "Stunt Master", name: "category" },
  { value: "Stuntman/woman", label: "Stuntman/woman", name: "category" },
  { value: "Writer", label: "Writer", name: "category" },
];
export const autition_types = [
  { value: 1, label: "Online", name: "type" },
  { value: 2, label: "Physical", name: "type" },
];

export const options_styles = {
  container: (provided) => ({
    ...provided,
    height: "100%",
  }),
  control: (provided) => ({
    ...provided,
    height: "100%",
    border: "1px solid rgba(220,220,220)",
    outline: "none",
    boxShadow: "none",
    cursor: "pointer",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
};

export const assistant_options = [
  { value: 3, label: "Line Producer", name: "role" },
  { value: 4, label: "Director", name: "role" },
];

export const phoneinput_options = {
  type: "tel",
  country: "in",
  onlyCountries: ["in"],
  countryCodeEditable: false,
  placeholder: "phone Number",
};

export const languages_options = [
  { value: "Telugu", label: "Telugu", name: "motherlanguage" },
  { value: "Hindi", label: "Hindi", name: "motherlanguage" },
  { value: "English", label: "English", name: "motherlanguage" },
  { value: "Tamil", label: "Tamil", name: "motherlanguage" },
  { value: "Kannada", label: "Kannada", name: "motherlanguage" },
  { value: "Malayalam", label: "Malayalam", name: "motherlanguage" },
  { value: "Punjabi", label: "Punjabi", name: "motherlanguage" },
  { value: "Oriya", label: "Oriya", name: "motherlanguage" },
  { value: "Urdu", label: "Urdu", name: "motherlanguage" },
  { value: "Marathi", label: "Marathi", name: "motherlanguage" },
  { value: "Bangla", label: "Bangla", name: "motherlanguage" },
  { value: "Gujarathi", label: "Gujarathi", name: "motherlanguage" },
];

export const gender_options = [
  { value: "male", label: "Male", name: "gender" },
  { value: "female", label: "Female", name: "gender" },
  { value: "other", label: "Other", name: "gender" },
];

export const subcategory_options = [
  { value: "Hero", label: "Hero", name: "subcategory", target: "Artist" },
  { value: "Heroine", label: "Heroine", name: "subcategory", target: "Artist" },
  { value: "Villain", label: "Villain", name: "subcategory", target: "Artist" },
  {
    value: "Comedian",
    label: "Comedian",
    name: "subcategory",
    target: "Artist",
  },
  {
    value: "Supporting Role",
    label: "Supporting Role",
    name: "subcategory",
    target: "Artist",
  },
  {
    value: "Jr Artist",
    label: "Jr Artist",
    name: "subcategory",
    target: "Artist",
  },
  { value: "Others", label: "Others", name: "subcategory", target: "Artist" },
  {
    value: "Classical",
    label: "Classical",
    name: "subcategory",
    target: "Choreographer",
  },
  {
    value: "Folk",
    label: "Folk",
    name: "subcategory",
    target: "Choreographer",
  },
  {
    value: "Western",
    label: "Western",
    name: "subcategory",
    target: "Choreographer",
  },

  {
    value: "Classical",
    label: "Classical",
    name: "subcategory",
    target: "Dancer",
  },
  { value: "Folk", label: "Folk", name: "subcategory", target: "Dancer" },
  {
    value: "Western",
    label: "Western",
    name: "subcategory",
    target: "Dancer",
  },

  {
    value: "TV Serials",
    label: "TV Serials",
    name: "subcategory",
    target: "Director",
  },
  {
    value: "Web Series",
    label: "Web Series",
    name: "subcategory",
    target: "Director",
  },
  { value: "Films", label: "Films", name: "subcategory", target: "Director" },
  { value: "Songs", label: "Songs", name: "subcategory", target: "Director" },
  {
    value: "Non-Fiction",
    label: "Non-Fiction",
    name: "subcategory",
    target: "Director",
  },

  {
    value: "TV Serials",
    label: "TV Serials",
    name: "subcategory",
    target: "DOP",
  },
  {
    value: "Web Series",
    label: "Web Series",
    name: "subcategory",
    target: "DOP",
  },
  { value: "Films", label: "Films", name: "subcategory", target: "DOP" },
  { value: "Songs", label: "Songs", name: "subcategory", target: "DOP" },
  {
    value: "Non-Fiction",
    label: "Non-Fiction",
    name: "subcategory",
    target: "DOP",
  },

  {
    value: "TV Serials",
    label: "TV Serials",
    name: "subcategory",
    target: "Muscian",
  },
  {
    value: "Web Series",
    label: "Web Series",
    name: "subcategory",
    target: "Musician",
  },
  { value: "Films", label: "Films", name: "subcategory", target: "Musician" },
  { value: "Songs", label: "Songs", name: "subcategory", target: "Musician" },
  {
    value: "Non-Fiction",
    label: "Non-Fiction",
    name: "subcategory",
    target: "Musician",
  },

  {
    value: "Classical",
    label: "Classical",
    name: "subcategory",
    target: "Singer",
  },
  { value: "Folk", label: "Folk", name: "subcategory", target: "Singer" },
  {
    value: "Indi Pop",
    label: "Indi Pop",
    name: "subcategory",
    target: "Singer",
  },
  {
    value: "Devotional",
    label: "Devotional",
    name: "subcategory",
    target: "Singer",
  },
  {
    value: "Western",
    label: "Western",
    name: "subcategory",
    target: "Singer",
  },
  {
    value: "Ghazals",
    label: "Ghazals",
    name: "subcategory",
    target: "Singer",
  },
  {
    value: "Qawwalli",
    label: "Qawwalli",
    name: "subcategory",
    target: "Singer",
  },

  {
    value: "Martial Arts Expert",
    label: "Martial Arts Expert",
    name: "subcategory",
    target: "Stunt Master",
  },
  {
    value: "Stunts Assistant",
    label: "Stunts Assistant",
    name: "subcategory",
    target: "Stunt Master",
  },
  {
    value: "Stunts Supporting Team",
    label: "Stunts Supporting Team",
    name: "subcategory",
    target: "Stunt Master",
  },
  {
    value: "Special Expert",
    label: "Special Expert",
    name: "subcategory",
    target: "Stunt Master",
  },
  {
    value: "Stunt Master",
    label: "Stunt Master",
    name: "subcategory",
    target: "Stunt Master",
  },

  {
    value: "Karate",
    label: "Karate",
    name: "subcategory",
    target: "Stuntman/woman",
  },
  {
    value: "Boxing",
    label: "Boxing",
    name: "subcategory",
    target: "Stuntman/woman",
  },
  {
    value: "Taekwondo",
    label: "Taekwondo",
    name: "subcategory",
    target: "Stuntman/woman",
  },
  {
    value: "Kungfu",
    label: "Kungfu",
    name: "subcategory",
    target: "Stuntman/woman",
  },
  {
    value: "Others",
    label: "Others",
    name: "subcategory",
    target: "Stuntman/woman",
  },

  {
    value: "Story development",
    label: "Story development",
    name: "subcategory",
    target: "Writer",
  },
  {
    value: "Screenplay",
    label: "Screenplay",
    name: "subcategory",
    target: "Writer",
  },
  {
    value: "Dialogues",
    label: "Dialogues",
    name: "subcategory",
    target: "Writer",
  },
  {
    value: "Song lyrics",
    label: "Song lyrics",
    name: "subcategory",
    target: "Writer",
  },
];

export const export_options = [
  {
    value: "PDF",
    label: "PDF",
    name: "exportto",
  },
  {
    value: "Excel",
    label: "Excel",
    name: "exportto",
  },
];

export const state_options = [
  {
    label: "Andhra Pradesh",
    value: "Andhra Pradesh",
    name: "state",
  },
  {
    label: "Telangana",
    value: "Telangana",
    name: "state",
  },
  {
    label: "Arunachal Pradesh",
    value: "Arunachal Pradesh",
    name: "state",
  },
  { label: "Assam", value: "Assam", name: "state" },
  { label: "Bihar", value: "Bihar", name: "state" },
  {
    label: "Chhattisgarh",
    value: "Chhattisgarh",
    name: "state",
  },
  { label: "Goa", value: "Goa", name: "state" },
  { label: "Gujarat", value: "Gujarat", name: "state" },
  { label: "Haryana", value: "Haryana", name: "state" },
  {
    label: "Himachal Pradesh",
    value: "Himachal Pradesh",
    name: "state",
  },
  {
    label: "Jharkhand",
    value: "Jharkhand",
    name: "state",
  },
  {
    label: "Karnataka",
    value: "Karnataka",
    name: "state",
  },
  { label: "Kerala", value: "Kerala", name: "state" },
  {
    label: "Madhya Pradesh",
    value: "Madhya Pradesh",
    name: "state",
  },
  {
    label: "Maharashtra",
    value: "Maharashtra",
    name: "state",
  },
  { label: "Manipur", value: "Manipur", name: "state" },
  {
    label: "Meghalaya",
    value: "Meghalaya",
    name: "state",
  },
  { label: "Odisha", value: "Odisha", name: "state" },
  { label: "Punjab", value: "Punjab", name: "state" },
  {
    label: "Rajasthan",
    value: "Rajasthan",
    name: "state",
  },
  { label: "Sikkim", value: "Sikkim", name: "state" },
  {
    label: "Tamil Nadu",
    value: "Tamil Nadu",
    name: "state",
  },
  { label: "Tripura", value: "Tripura", name: "state" },
  {
    label: "Uttar Pradesh",
    value: "Uttar Pradesh",
    name: "state",
  },
  {
    label: "Uttarakhand",
    value: "Uttarakhand",
    name: "state",
  },
  {
    label: "West Bengal",
    value: "West Bengal",
    name: "state",
  },
  { label: "Delhi", value: "Delhi", name: "state" },
  { label: "Ladakh", value: "Ladakh", name: "state" },
  {
    label: "Lakshadweep",
    value: "Lakshadweep",
    name: "state",
  },
  {
    label: "Jammu and Kashmir",
    value: "Jammu and Kashmir",
    name: "state",
  },
  {
    label: "Puducherry",
    value: "Puducherry",
    name: "state",
  },
  {
    label: "Andaman and Nicobar Island",
    value: "Andaman and Nicobar Island",
    name: "state",
  },
  {
    label: "Dadra and Nagar Haveli and Daman and Diu",
    value: "Dadra and Nagar Haveli and Daman and Diu",
    name: "state",
  },
];

export const project_type = [
  { label: "Documentary", value: "Documentary", name: "type" },
  { label: "Film", value: "Film", name: "type" },
  { label: "Serial", value: "Serial", name: "type" },
  { label: "Short Film", value: "Short Film", name: "type" },
];
