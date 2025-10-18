const reviews = [
  {
    id: 1,
    name: "Alison V.",
    rating: 5,
    date: "Less than 1 month ago",
    review: "Great experience, great knowledge and advice for my eye health. Really liked communication and friendliness, def recommend!",
    initials: "AV",
    location: "Eye & Health"
  },
  {
    id: 2,
    name: "AL",
    rating: 5,
    date: "Less than 1 month ago",
    review: "Dr. Latek was amazing! She is extremely knowledgeable, answered all my questions and had great energy!",
    initials: "AL",
    location: "Eye & Health"
  },
  {
    id: 3,
    name: "Sara V.",
    rating: 5,
    date: "Less than 1 month ago",
    review: "The doctor was very kind and helpful. Great listener and lovely person.",
    initials: "SV",
    location: "Eye & Health"
  },
  {
    id: 4,
    name: "Kerry M.",
    rating: 5,
    date: "Less than 1 month ago",
    review: "The office is phenomenal. Everyone is so helpful and friendly.",
    initials: "KM",
    location: "Eye & Health"
  },
  {
    id: 5,
    name: "Rory M.",
    rating: 5,
    date: "Less than 1 month ago",
    review: "Great! Very informative and answered all of my questions!",
    initials: "RM",
    location: "Eye & Health"
  },
  {
    id: 6,
    name: "FERNANDO S.",
    rating: 5,
    date: "Less than 1 month ago",
    review: "Great doctor",
    initials: "FS",
    location: "Eye & Health"
  },
  {
    id: 7,
    name: "Amalia F.",
    rating: 5,
    date: "Less than 1 month ago",
    review: "The doctor was so informative and sweet! She went out of her way to explain things to me and the experience was top notch. Really loved her!!",
    initials: "AF",
    location: "Eye & Health"
  },
  {
    id: 8,
    name: "Amelia F.",
    rating: 5,
    date: "Less than 1 month ago",
    review: "So good! Highly recommend!",
    initials: "AF",
    location: "Eye & Health"
  },
  {
    id: 9,
    name: "Emmeline D.",
    rating: 5,
    date: "Less than 1 month ago",
    review: "Joanna was truly incredible. She was able to identify that I had allergies which were impacting my eyes. She walked me through the recommended next steps and over the counter care. I will be seeing her every year moving forward for my annual. Highly recommend!!",
    initials: "ED",
    location: "Eye & Health"
  },
  {
    id: 10,
    name: "Katerina P.",
    rating: 5,
    date: "Less than 1 month ago",
    review: "Amazing! Super friendly",
    initials: "KP",
    location: "Eye & Health"
  },
  {
    id: 11,
    name: "OA",
    rating: 5,
    date: "Less than 1 month ago",
    review: "Dr. Latek is very thorough with her exams and makes sure to give quality care. I had an excellent experience with her and will 100% be returning!",
    initials: "OA",
    location: "Eye & Health"
  },
  {
    id: 12,
    name: "Shideh A.",
    rating: 5,
    date: "Less than 3 months ago",
    review: "Dr. Latek was awesome –she explained my condition so clearly (why it was happening and how to overcome it), super clear, patient, answered all my questions, and so friendly! Will definitely be back to see her!",
    initials: "SA",
    location: "Eye & Health"
  },
  {
    id: 13,
    name: "Victoria M.",
    rating: 5,
    date: "Less than 3 months ago",
    review: "Still waiting for my glasses - was told they'd be ready in a week and it's been 2.5 weeks. Had to call to ask for an update and they seemed annoyed that I would do so despite the clear delay.   Appointment itself was great though.",
    initials: "VM",
    location: "Eye & Health"
  },
  {
    id: 14,
    name: "Allan D.",
    rating: 5,
    date: "Less than 3 months ago",
    review: "Dr Joanna was amazing! She was so polite, understanding, and respectful. She listened, answered, and reassured me on all of my questions and concerns. I felt better post visit, than I did pre visit, and to me that’s always the sign of a great doctor.",
    initials: "AD",
    location: "Eye & Health"
  },
  {
    id: 15,
    name: "Alexandra R.",
    rating: 5,
    date: "Less than 3 months ago",
    review: "Great experience - especially as a first time optometrist goer! Everyone was friendly, clear, and professional. I really appreciated it.",
    initials: "AR",
    location: "Eye & Health"
  },
  {
    id: 16,
    name: "Adeola M.",
    rating: 5,
    date: "Less than 3 months ago",
    review: "It was very welcoming and friendly. I was early for my appointment and was seen way before time. The doctor explained everything in a way I was able to understand and remember.",
    initials: "AM",
    location: "Eye & Health"
  },
  {
    id: 17,
    name: "Gabrielle M.",
    rating: 5,
    date: "Less than 3 months ago",
    review: "Dr.Joanna Latek was fabulous!! So kind and calming. I’ve never had such great bedside manner and she helped me figure out how to give my eyes a break since I have such a high prescription! She is also so professional. The front staff are so kind and helpful as well. All nice ladies and helped me find a pair of glasses that fit my face best .I believe her name was Sylvia !",
    initials: "GM",
    location: "Eye & Health"
  },
  {
    id: 18,
    name: "VT",
    rating: 5,
    date: "Less than 3 months ago",
    review: "Very pleasant! Knows what she's talking about and her bed side manner is beyond what I've experienced any where else. Thank you Dr. Latek! I'll see your for my next exam! :)",
    initials: "VT",
    location: "Eye & Health"
  },
  {
    id: 19,
    name: "SN",
    rating: 5,
    date: "Less than 3 months ago",
    review: "Dr. Latek was fantastic. She explained everything super well, and I left with all my answers. She knows what she’s doing! Highly recommend.",
    initials: "SN",
    location: "Eye & Health"
  },
  {
    id: 20,
    name: "CJ",
    rating: 5,
    date: "Less than 3 months ago",
    review: "A fantastic experience was had with Dr.  Joanna and the team ! The front desk staff was friendly and welcoming. Highly recommended to anyone looking for an excellent eye doctor!",
    initials: "CJ",
    location: "Eye & Health"
  },
  {
    id: 21,
    name: "CS",
    rating: 5,
    date: "Less than 3 months ago",
    review: "Dr.Latek really took her time to figure out my prescription after many failed attempts with previous providers. I finally have contacts that don’t bother my eyes anymore. Definitely my new doctor!",
    initials: "CS",
    location: "Eye & Health"
  },
  {
    id: 22,
    name: "KN",
    rating: 5,
    date: "Less than 3 months ago",
    review: "<span data-test=\"preview-span\" class=\"sc-1opoey3-1 iKfHMS\">Dr Latek took the time to explain why I developed the problem that I had and what she was going to do to help me! I never thought I could achieve 20/20 but with her recommendations and treatment plan, I am confident I will be there soon. No other doctor in the past has ever explained my condition to me so thoroughly and now I whole-heartedly feel that I am part of my own treatment",
    initials: "KN",
    location: "Eye & Health"
  },
  {
    id: 23,
    name: "NS",
    rating: 5,
    date: "Less than 3 months ago",
    review: "Dr. Latek took the time to walk me through my first eye exam and sent me home with extra materials for my case. I appreciate that she took the extra time to explain what tools she was using and what she was looking for.  I would recommend doctor Latek to anyone looking for the best in eye care in the city.  I look forward to my follow up with her.",
    initials: "NS",
    location: "Eye & Health"
  }
] as Review[];
