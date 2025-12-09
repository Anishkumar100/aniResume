export const Footer = () => {
    
    
const footer_data = [
      {
          title: "Quick Links",
          links: ["Home", "Best Sellers", "Offers & Deals", "Contact Us", "FAQs"]
      },
      {
          title: "Need Help?",
          links: ["Delivery Information", "Return & Refund Policy", "Payment Methods", "Track your Order", "Contact Us"]
      },
      {
          title: "Follow Us",
          links: ["Instagram", "Twitter", "Facebook", "YouTube"]
      }
  ];
  return (
    <div className='mt-32 px-6 md:px-16 lg:px-24 xl:px-32 bg-primary/3 '>

      <div className='flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-t border-gray-500/30   text-gray-500  '>

        <div>
          {/*Even here u have to change logo when in  mode */}
          <img
            src="/navLogo.png"
            alt="logo"
            className='w-32 sm:w-44'
          />
          <p className='max-w-[410px] mt-6'>
            AniResume is your ultimate AI-powered resume builder designed to help you craft professional resumes effortlessly. Our platform leverages advanced AI technology to generate tailored resume content, ensuring you stand out in the competitive job market.
          </p>
        </div>

        <div className='flex flex-wrap justify-between w-full md:w-[45%] gap-5'>
          {footer_data.map((section, index) => {
            return (
              <div key={index}>
                <h3 className='font-semibold text-base text-gray-900  mb-2'>
                  {section.title}
                </h3>
                <ul className='text-sm space-y-1'>
                  {section.links.map((link, i) => {
                    return (
                      <li key={i}>
                        <a href="#" className='hover:underline transition'>
                          {link}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>

      </div>

      <p className='py-4 text-center text-sm md:text-base text-gray-500/80 '>
        Copyright © 2025 AniResume<br />
        Anish Kumar - All Rights Reserved
      </p>

    </div>
  )
}
