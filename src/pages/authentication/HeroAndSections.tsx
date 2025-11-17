import { SocialContactButtons } from "@/components/utilities";
import heroImage from "../../assets/hero-image-1.webp";
import SubscriptionCards from "./subscription-packeges";
import { faqs } from "@/data";
import { Disclosure, DisclosureButton } from "@headlessui/react";
import { IoChevronUpCircleOutline } from "react-icons/io5";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
export const HeroAndSections = () => {
  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-container-start to-container-end">
        <div className="pt-24 pb-12 md:py-[65px]">
          <div className="container-content mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center h-[90vh]">
              {/* Text */}
              <div className="md:col-span-6 flex flex-col justify-center">
                <h1 className="text-4xl sm:text-5xl md:text-[56px] lg:text-[70px] text-white font-david font-bold leading-tight md:leading-[0.9]">
                  Dine Smarter
                  <br />
                  With Cleverbiz AI
                </h1>

                <p className="text-[#CECECE] mt-6 max-w-xl text-sm sm:text-base md:text-[16px] font-inter leading-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>

                <SocialContactButtons className="fill-white mt-6" />

                <div className="mt-8 border-b border-white/20 w-3/4 md:w-1/2"></div>
              </div>

              {/* Image */}
              <div className="md:col-span-6 flex items-center justify-center relative">
                <div className="h-[900px] w-[900px]  md:pl-8">
                  <img
                    src={heroImage}
                    alt="CleverBiz"
                    height={900}
                    className="object-contain h-full "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Packages Section */}
      <section className="pt-12 pb-10 bg-white">
        <div className="container-content mx-auto px-4 md:px-8">
          <div className="mt-8">
            <SubscriptionCards />
          </div>
        </div>
      </section>

      {/* Frequently Ask Question */}
      <section className="pt-12 pb-12 bg-gradient-to-br from-container-start to-container-end">
        <div className="container-content mx-auto px-4 md:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-[52px] font-bold text-white font-david leading-none text-center md:text-left">
            Frequently Asked Questions
          </h2>

          <div className="mt-8 max-w-3xl mx-auto md:mx-0">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Disclosure key={index} defaultOpen={index === 0} as="div">
                  {({ open }) => (
                    <>
                      <DisclosureButton className="flex w-full justify-between items-center p-4 text-left text-primary-text bg-primary focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md">
                        <div className="flex items-center gap-x-3">
                          <span className="h-6 w-6">
                            <svg
                              className="h-6 w-6"
                              viewBox="0 0 34 32"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                width="22.5882"
                                height="22.5882"
                                fill="#5661F6"
                                fillOpacity="0.2"
                              />
                              <rect
                                x="11.2939"
                                y="9.41174"
                                width="22.5882"
                                height="22.5882"
                                fill="#5661F6"
                              />
                            </svg>
                          </span>
                          <span className="text-base sm:text-lg font-medium">
                            {faq.question}
                          </span>
                        </div>
                        <IoChevronUpCircleOutline
                          className={cn(
                            { "transform rotate-180": !open },
                            "h-6 w-6 text-primary-text"
                          )}
                        />
                      </DisclosureButton>

                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div
                            key="content"
                            initial="collapsed"
                            animate="open"
                            exit="collapsed"
                            variants={{
                              open: { height: "auto", opacity: 1 },
                              collapsed: { height: 0, opacity: 0 },
                            }}
                            transition={{
                              duration: 0.28,
                              ease: [0.4, 0, 0.2, 1],
                            }}
                            className="overflow-hidden text-primary"
                          >
                            <div className="bg-primary-text p-4 rounded-b-md text-sm sm:text-base">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </Disclosure>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
// ...existing code...
<main className="flex flex-col">
  {/* Hero Section */}
  <section className="flex flex-col bg-gradient-to-br from-container-start to-container-end">
    <div className="h-[calc(127px_+_65px)]"></div>
    <div className="container-content self-center flex flex-col md:flex-row relative h-[898px]">
      {/* Right Container */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[712px] w-full flex flex-row">
        <div className="basis-[50%]"></div>
        {/* Hero Image */}
        <div className="basis-[50%] flex flex-row justify-end relative">
          <div className="absolute right-0 top-0 bottom-0 -left-40 flex justify-end">
            <img src={heroImage} alt="CleverBiz" className="h-[712px]" />
          </div>
        </div>
      </div>
      {/* Left Container */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[712px] w-full flex flex-row">
        {/* Left Secion Text And Buttons */}
        <div className="basis-[45%] mt-24 flex flex-col justify-center">
          <h1 className="text-[70px] text-white font-david font-bold leading-20">
            Dine Smarter
            <br />
            With Cleverbiz AI
          </h1>
          <div className="flex flex-row">
            <p className="text-[#CECECE] mt-16 basis-[80%] font-inter leading-8 text-[16px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <SocialContactButtons className="fill-white mt-8" />
          <div className="flex-1"></div>
          <div className="border-b border-white/20 w-1/2 mb-24"></div>
        </div>
        <div className="basis-[55%]"></div>
      </div>
    </div>
  </section>
  {/* Subscription Packages Section */}
  <section className="pt-16 pb-10 flex flex-col max-w-full bg-white">
    <div className="mt-16 container-content self-center">
      <SubscriptionCards />;
    </div>
  </section>
  {/* Frequently Ask Question */}
  <section className="pt-16 pb-10 flex flex-col bg-gradient-to-br from-container-start to-container-end">
    <h2 className="text-[52px] self-center font-bold text-white font-david leading-none">
      Frequently Asked Questions
    </h2>
    <div className="container-content self-center">
      <div className="space-y-4 mt-16">
        {/* Faq list section */}
        {faqs.map((faq, index) => (
          <Disclosure key={index} defaultOpen={index === 0} as="div">
            {({ open }) => (
              <>
                {/* Expand button with question */}
                <DisclosureButton className="flex w-full justify-between items-center p-4 text-left text-primary-text bg-primary focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md">
                  <div className="flex flex-row gap-x-2">
                    <span className="h-6 w-6">
                      <svg
                        className="h-6 w-6"
                        viewBox="0 0 34 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          width="22.5882"
                          height="22.5882"
                          fill="#5661F6"
                          fillOpacity="0.2"
                        />
                        <rect
                          x="11.2939"
                          y="9.41174"
                          width="22.5882"
                          height="22.5882"
                          fill="#5661F6"
                        />
                      </svg>
                    </span>
                    <span className="text-lg font-medium">{faq.question}</span>
                  </div>
                  <IoChevronUpCircleOutline
                    className={cn(
                      { "transform rotate-180": !open },
                      "h-6 w-6 text-primary-text"
                    )}
                  />
                </DisclosureButton>
                {/* Expandable container with answer */}
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      key="content"
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      variants={{
                        open: { height: "auto", opacity: 1 },
                        collapsed: { height: 0, opacity: 0 },
                      }}
                      transition={{
                        duration: 0.3,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      className="overflow-hidden pt-0 text-primary"
                    >
                      <div className="bg-primary-text p-4 rounded-b-md">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </div>
  </section>
</main>;
