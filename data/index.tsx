import {
  Eye,
  Baby,
  Droplet,
  Blend,
  PocketKnife,
  Contact,
  Search,
  CircleDot,
  Brain,
  AlertCircle,
  LucideAsteriskSquare,
  Moon,
  EyeIcon,
  Building2,
  Award,
  Star,
} from "lucide-react";

const services = [
  {
    id: "comprehensive",
    title: "Comprehensive Eye Exams",
    icon: <Eye className="w-4 h-4 md:w-6 md:h-6" />,
    description:
      "A thorough eye examination goes beyond simply reading letters from an eye chart. It includes a detailed assessment of your overall eye health, evaluating factors such as visual clarity, eye muscle coordination, peripheral vision, and a close examination of the internal structures of your eyes. I use advanced diagnostic tools to assess your ocular health, helping identify early signs of conditions like glaucoma, macular degeneration, and diabetic retinopathy. In addition to health evaluation, a complete eye exam takes into account your lifestyle and specific visual needs, offering a personalized approach to vision correction, which may include glasses, contact lenses, or advice on managing digital eye strain. This holistic approach ensures not only improved vision but also long-term eye health and vitality.",
    color: "from-blue-500/20 to-blue-600/20",
  },
  {
    id: "pediatric",
    title: "Infant & Pediatric Eye Exams",
    icon: <Baby className="w-4 h-4 md:w-6 md:h-6" />,
    description:
      "A pediatric eye exam is a thorough evaluation aimed at assessing the visual health of children. I customize these exams to suit the child's age and developmental stage, ensuring that the process is both comfortable and engaging. I am also able to see children across a spectrum of developmental disorders, and will tailor my exam to ensure comfort for both the child and guardian present. I use specialized methods to make the experience enjoyable, often incorporating interactive elements such as pictures, toys, and fun games that not only hold the child's attention but also provide important insights into their vision. The exam examines various aspects of vision, including visual acuity to assess clarity of sight, eye alignment to check for issues like strabismus, and the ability to focus on both near and distant objects. The child's eye health is also carefully checked for potential concerns such as refractive errors (nearsightedness, farsightedness, astigmatism) or early signs of eye diseases. By identifying and addressing these issues early, a pediatric eye exam plays a vital role in the child's visual development, supporting their success in school, sports, and daily activities, while laying the groundwork for a lifetime of healthy vision.",
    color: "from-purple-500/20 to-purple-600/20",
  },
  {
    id: "dryeye",
    title: "Dry Eye Evaluations",
    icon: <Droplet className="w-4 h-4 md:w-6 md:h-6" />,
    description:
      "A dry eye evaluation is a thorough assessment aimed at diagnosing the underlying causes of eye discomfort and dryness. During the evaluation, the anterior surface of the eye is carefully examined to check for any signs of irritation or damage. The integrity of the tear film is also assessed to determine if your eyes are producing enough moisture or if there are issues with tear quality. Common symptoms of dry eye include a gritty or burning sensation, redness, blurred vision, and excessive tearing, which may seem counterintuitive. By thoroughly evaluating these factors, I can identify the root cause of your dry eye condition and recommend personalized treatments to help relieve discomfort and restore optimal eye health. Treatments may include creating a routine with medications and other therapeutic aids, specialized treatments such as IPL, Meibomian Gland Expressions, Punctal Plug insertions and many more!",
    color: "from-cyan-500/20 to-cyan-600/20",
  },
  {
    id: "lowvision",
    title: "Low Vision Exams",
    icon: <Search className="w-4 h-4 md:w-6 md:h-6" />,
    description:
      "A low vision eye exam is a specialized evaluation for individuals whose visual impairments cannot be fully corrected with standard glasses or contact lenses. This exam is customized to address your specific needs and challenges, with the goal of optimizing your remaining vision and promoting greater independence. During the exam, I carefully assess your vision, considering factors such as contrast sensitivity, lighting conditions, and your personal visual objectives. This allows me to suggest a variety of low vision aids and strategies to improve your daily life. Tools like magnifiers, telescopic lenses, digital devices, and adaptive techniques can significantly enhance your ability to perform tasks and open up new possibilities for greater independence. When needed, appropriate referrals to the Lighthouse Guild are made. ",
    color: "from-amber-500/20 to-amber-600/20",
  },
  {
    id: "contactlens",
    title: "Routine Contact Lens Exam",
    icon: <Contact className="w-4 h-4 md:w-6 md:h-6" />,
    description:
      "A routine contact lens exam is a thorough evaluation that goes beyond simply checking your prescription. It involves a detailed assessment of how your contact lenses interact with your eyes. This includes evaluating the fit of your lenses, checking your eye health, and ensuring that your lenses provide clear vision without discomfort. Key factors such as tear film quality, lens movement, and potential issues related to extended contact lens wear are carefully examined. Through these detailed steps, I can adjust your contact lens prescription or suggest alternative lens options, helping to maintain eye health and ensure optimal vision and comfort.",
    color: "from-emerald-500/20 to-emerald-600/20",
  },
  {
    id: "specialty",
    title: "Specialty Contact Lens Exam",
    icon: <CircleDot className="w-4 h-4 md:w-6 md:h-6" />,
    description:
      "A specialty contact lens exam is an in-depth evaluation designed to address complex vision problems that cannot be corrected with standard lenses such as Keratoconus, Corneal Ectasias, trauma and many other causes. This exam involves the use of scleral lenses, hybrid lenses, traditional rigid gas permeable lenses, and specialty soft lenses, all custom-made to fit your eyes. For individuals with conditions like keratoconus or irregular astigmatism, I am able to map the unique contours of your cornea to create specially designed lenses that offer exceptional comfort and visual clarity. Specialty contact lenses also serve other purposes, including the treatment of severe dry eye, utilizing advanced materials and designs that enhance moisture retention and comfort throughout the day.",
    color: "from-indigo-500/20 to-indigo-600/20",
  },
  {
    id: "cosmetic",
    title: "Cosmetic Contact Lens Exam",
    icon: <Contact className="w-4 h-4 md:w-6 md:h-6 transform rotate-45" />,
    description:
      "A cosmetic contact lens exam offers the chance to explore a new form of self-expression through your eyes. Whether you're aiming to change your eye color for a special occasion or want to embrace a bold, unique style, the exam ensures that your cosmetic lenses fit comfortably and meet your specific preferences and visual needs. With a wide range of colors and designs available, you can transform your appearance while still prioritizing your eye health and comfort.",
    color: "from-rose-500/20 to-rose-600/20",
  },
  {
    id: "prosthetic",
    title: "Prosthetic Contact Lenses",
    icon: <Blend className="w-4 h-4 md:w-6 md:h-6" />,
    description:
      "A prosthetic contact lens exam is a personalized process aimed at restoring both the appearance and functionality of your eyes. Whether due to an eye injury, congenital condition, or another circumstance affecting the appearance of your eyes, specialists are available to assist you. During the exam, your individual needs are carefully assessed, considering factors like eye color, shape, and alignment. Prosthetic lenses are custom-crafted to blend seamlessly with your natural eye, ensuring comfort, visual clarity, and helping restore your confidence.",
    color: "from-silver-500/20 to-silver-600/20",
  },
  {
    id: "colorvisionexam",
    title: "Color Vision Exam",
    icon: <Brain className="w-4 h-4 md:w-6 md:h-6" />,
    description:
      "A color vision exam goes beyond simply identifying primary colors; it involves evaluating the subtleties of your color perception. If you've ever had difficulty distinguishing certain colors or shades, I can help provide clarity. During the exam, advanced testing methods are used to assess your ability to differentiate between a range of colors. This helps determine if you have color vision deficiencies, such as red-green or blue-yellow color blindness. Through a detailed analysis, insights are provided into how you perceive colors, along with recommendations to help you manage daily activities more effectively.",
    color: "from-teal-500/20 to-teal-600/20",
  },
  {
    id: "myopiamanagementevaluation",
    title: "Myopia Management Evaluation",
    icon: <AlertCircle className="w-4 h-4 md:w-6 md:h-6" />,
    description:
      "A myopia management exam is a crucial step in addressing the rapid progression of nearsightedness in children. This exam involves evaluating factors such as your child’s eye shape, lifestyle, and family history to create a personalized plan for myopia control. The plan may include specialized contact lenses, prescription eyeglasses, or other methods that have been shown to slow the progression of nearsightedness. Taking early action can significantly reduce the risk of severe myopia and its related complications later in life. I myself have been utilizing myopia management technology for over a decade and am an example of its success!",
    color: "from-red-500/20 to-red-600/20",
  },
  {
    id: "orthokeratologyevaluation",
    title: "Orthokeratology Evaluation",
    icon: <LucideAsteriskSquare className="w-4 h-4 md:w-6 md:h-6" />,
    description:
      "An Orthokeratology exam offers a solution for clear vision without the need for glasses or contact lenses, using custom-designed lenses worn overnight. During the exam, your eyes are evaluated to determine if you're a good candidate for Ortho-K. If you are, you'll be fitted with specialized lenses that gently reshape the cornea while you sleep. Upon waking, you simply remove the lenses and enjoy improved vision throughout the day. This innovative method is not only convenient but can also help slow the progression of myopia, offering a transformative option for those seeking freedom from corrective eyewear. I myself have been using Orthokeratology lenses since 2010 and will continue to use them for as long as I can.",
    color: "from-yellow-500/20 to-yellow-600/20",
  },
  {
    id: "migraineevaluation",
    title: "Migraine Evaluation (Compton Eye Associates)",
    icon: <Moon className="w-4 h-4 md:w-6 md:h-6" />,
    description:
      "Migraine relief doesn’t always require surgery or medication. A groundbreaking treatment called NeuroLens offers a non-invasive solution that targets the root cause of many migraines. By assessing the connection between your vision and headaches, I can determine if an imbalance in your eye muscles is contributing to the migraines. NeuroLens uses custom-designed lenses to help your eyes work together more effectively, potentially reducing the frequency and severity of your migraines. This innovative approach provides a promising alternative for those seeking relief without resorting to traditional treatments.",
    color: "from-gray-500/20 to-gray-600/20",
  },
  {
    id: "laservisionconsultation",
    title: "Laser Vision Consultation",
    icon: <EyeIcon className="w-4 h-4 md:w-6 md:h-6" />,
    description:
      "A laser vision correction consultation is the first step toward achieving clear vision without the need for glasses or contact lenses. During the consultation, a comprehensive evaluation of your eyes is conducted, including assessments of corneal thickness, refractive error, and overall eye health. This information helps determine if procedures like LASIK or PRK are suitable for your specific needs. If you are a candidate, you’ll receive a detailed explanation of the process, expected outcomes, and what to anticipate during and after the procedure. With expert guidance, you can make an informed decision about laser vision correction and take a major step toward visual freedom.",
    color: "from-green-500/20 to-green-600/20",
  },
  {
    id: "surgicalconsultations",
    title: "Surgical Consultations",
    icon: <PocketKnife className="w-4 h-4 md:w-6 md:h-6" />,
    description:
      "While I am not a surgeon, I work closely with skilled ophthalmic surgeons in the area to co-manage a variety of eye surgeries. From cataracts and pterygium removal to blepharoplasties and more, I provide a comprehensive approach to guiding you through the surgical process. Surgical consultations are an opportunity to explore options for improving your eye health and vision through surgery. I collaborate with trusted ophthalmologists to ensure you receive optimal care before, during, and after your procedure. During the consultation, your specific condition will be discussed, along with a review of your medical history and an evaluation of your eye health. A personalized surgical plan will then be developed with your ophthalmologist, providing a clear understanding of the procedure, expected outcomes, and the recovery process.",
    color: "from-orange-500/20 to-orange-600/20",
  },
] as Service[];

const credentials = [
  {
    title: "Doctorate in Optometry",
    institution: "State University of New York College of Optometry",
    icon: Award,
  },
  {
    title: "Microcredential Certificate",
    institution: "SUNY College of Optometry",
    specialization: "Anterior Segment & Specialty Contact Lenses",
    icon: Award,
  },
  {
    title: "Optometric License",
    institution: "New York State Board of Optometry",
    icon: Building2,
  },
];

const locations = [
  {
    name: "Eye & Health",
    address: "159 1st Ave, New York, NY 10003",
    phone: "+1 (646) 410-1544",
    website: "",
    frame: (
      <div style={{ width: "100%" }}>
        <iframe
          width="100%"
          height="400"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src="https://maps.google.com/maps?width=100%25&amp;height=400&amp;hl=en&amp;q=159%201st%20Ave,%20New%20York,%20NY%2010003+(Eye%20%26%20Health)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
        >
          {/* <a href="https://www.gps.ie/">gps devices</a> */}
        </iframe>
      </div>
    ),
    hours: [
      { day: "Tuesday", time: "10:00am - 6:00pm" },
      { day: "Wednesday", time: "10:00am - 6:00pm" },
      { day: "Thursday", time: "10:00am - 6:00pm" },
    ],
  },
];

const contactLocations = [
  {
    name: "Eye & Health",
    phone: "+1 (646) 410-1544",
    bookingUrl: undefined,
  },
];


const reviews = [
  {
    id: 1,
    name: "Rory M.",
    rating: 5,
    date: "2024-08-26",
    service: "Comprehensive Eye Exam",
    review: "Great! Very informative and answered all of my questions!",
    initials: "RM",
    location: "Eye & Health"
  },
  {
    id: 2,
    name: "Sara V.",
    rating: 5,
    date: "2024-08-13",
    service: "Comprehensive Eye Exam",
    review: "The doctor was very kind and helpful. Great listener and lovely person.",
    initials: "SV",
    location: "Eye & Health"
  },
  {
    id: 3,
    name: "Gabrielle M.",
    rating: 5,
    date: "2024-08-09",
    service: "Comprehensive Eye Exam",
    review: "Dr. Joanna Latek was fabulous!! So kind and calming. I've never had such great bedside manner and she helped me figure out how to give my eyes a break since I have such a high prescription! She is also so professional. The front staff are so kind and helpful as well. All nice ladies and helped me find a pair of glasses that fit my face best. I believe her name was Sylvia!",
    initials: "GM",
    location: "Eye & Health"
  },
  {
    id: 4,
    name: "V.T.",
    rating: 5,
    date: "2024-10-01",
    service: "Comprehensive Eye Exam",
    review: "Very pleasant! Knows what she's talking about and her bedside manner is beyond what I've experienced anywhere else. Thank you Dr. Latek! I'll see you for my next exam!",
    initials: "VT",
    location: "Eye & Health"
  },
  {
    id: 5,
    name: "S.N.",
    rating: 5,
    date: "2024-10-15",
    service: "Comprehensive Eye Exam",
    review: "Dr. Latek was fantastic. She explained everything super well, and I left with all my answers. She knows what she's doing! Highly recommend.",
    initials: "SN",
    location: "Eye & Health"
  },
  {
    id: 6,
    name: "Anonymous Patient",
    rating: 5,
    date: "2024-10-20",
    service: "Comprehensive Eye Exam",
    review: "A fantastic experience was had with Dr. Joanna and the team! The front desk staff was friendly and welcoming. Highly recommended to anyone looking for an excellent eye doctor!",
    initials: "AP",
    location: "Eye & Health"
  },
  {
    id: 7,
    name: "C.S.",
    rating: 5,
    date: "2024-11-01",
    service: "Contact Lens Fitting",
    review: "Dr. Latek really took her time to figure out my prescription after many failed attempts with previous providers. I finally have contacts that don't bother my eyes anymore. Definitely my new doctor!",
    initials: "CS",
    location: "Eye & Health"
  },
  {
    id: 8,
    name: "K.N.",
    rating: 5,
    date: "2024-11-10",
    service: "Vision Therapy",
    review: "Dr. Latek took the time to explain why I developed the problem that I had and what she was going to do to help me! I never thought I could achieve 20/20 but with her recommendations and treatment plan, I am confident I will be there soon. No other doctor in the past has ever explained my condition to me so thoroughly and now I whole-heartedly feel that I am part of my own treatment because I understand the WHY! Thank you Dr. Latek!",
    initials: "KN",
    location: "Eye & Health"
  },
  {
    id: 9,
    name: "Anonymous Patient",
    rating: 5,
    date: "2024-11-15",
    service: "First Eye Exam",
    review: "Dr. Latek took the time to walk me through my first eye exam and sent me home with extra materials for my case. I appreciate that she took the extra time to explain what tools she was using and what she was looking for. I would recommend doctor Latek to anyone looking for the best in eye care in the city. I look forward to my follow up with her.",
    initials: "FT",
    location: "Eye & Health"
  }
];

const navItems = [
  {
    title: "Locations",
    href: "#locations",
  },
  {
    title: "About Me",
    href: "#about-me",
  },
  {
    title: "Services",
    href: "#services",
  },
  {
    title: "Licenses/Certifications",
    href: "#licenses",
  },
  {
    title: "What is an Optometrist?",
    href: "#optometrist_vs_Ophthalmologist"
  },
  {
    title: "Reviews",
    href: "#reviews",
  },
  {
    title: "Contact",
    href: "#contact-us",
  },
];

export { services, credentials, locations, contactLocations, navItems, reviews };
