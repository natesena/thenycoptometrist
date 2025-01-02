import React from "react";
import Image from "next/image";

const comments = [
  {
    title: "Improved my vision with the best care",
    text: [
      "I’ve been struggling with my eyesight for years, and after visiting this clinic, my vision has improved significantly. The staff is knowledgeable, and the treatment options are top-notch.",
      "I’m so grateful for the personalized care I received – it really made all the difference!",
    ],
    author: "John Doe",
    position: "Patient",
    avatar: "/testimonials/user1.jpeg",
  },
  {
    title: "Highly recommend for eye care",
    text: [
      "The optometrists here are amazing! They thoroughly explained my diagnosis and recommended the perfect pair of glasses for me.",
      "I’m now seeing better than ever, and the whole experience was smooth and comfortable.",
    ],
    author: "Jane Smith",
    position: "Patient",
    avatar: "/testimonials/user2.jpeg",
  },
  {
    title: "Exceptional service and care",
    text: [
      "This clinic offers a wide range of services, from eye exams to the latest in optical technology. My visit was stress-free, and the staff was incredibly friendly.",
      "I’ve never felt more confident in my eye care, and I’ll definitely be returning for all my future eye exams.",
    ],
    author: "Michael Brown",
    position: "Patient",
    avatar: "/testimonials/user1.jpeg",
  },
  {
    title: "Comprehensive eye health check-up",
    text: [
      "I had a thorough eye check-up, and the optometrist took time to explain every step. I appreciate the level of care provided.",
      "The new glasses I was prescribed work wonders, and I can see so much more clearly now.",
    ],
    author: "Emily Davis",
    position: "Patient",
    avatar: "/testimonials/user2.jpeg",
  },
];

const Testimonials = () => {
  return (
    <section className="bg-white section h-fit dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm">
          <h2 className="mb-4 text-4xl tracking- font-extrabold text-gray-900 dark:text-white">
            Testimonials
          </h2>
          <p className="mb-8 font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
            Explore the whole collection of open-source web components and
            elements built with the utility classes from Tailwind
          </p>
        </div>
        <div className="grid mb-8 lg:mb-12 lg:grid-cols-2">
          {comments.map((comment, i) => (
            <figure
              key={i}
              className="flex flex-col justify-center items-center p-8 text-center bg-gray-50 border-b border-gray-200 md:p-12 lg:border-r dark:bg-gray-800 dark:border-gray-700"
            >
              <blockquote className="mx-auto mb-8 max-w-2xl text-gray-500 dark:text-gray-400">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {comment.title}
                </h3>
                <p >
                  {comment.text.map((text, i) => (
                    <span key={i} className="my-4">{text}</span>
                  ))}
                </p>
              </blockquote>
              <figcaption className="flex justify-center items-center space-x-3">
                <Image width={40} height={40}
                  className="w-9 h-9 rounded-full"
                  src={comment.avatar}
                  alt="profile picture"
                />
                <div className="space-y-0.5 font-medium dark:text-white text-left">
                  <div>{comment.author}</div>
                  <div className="text-sm font-light text-gray-500 dark:text-gray-400">
                    {comment.position}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
