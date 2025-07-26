import React from "react";
import { Hero } from "~/components/generic/home/Hero";
import { Pricing } from "~/components/generic/home/Pricing";
import { Services } from "~/components/generic/home/Services";
import Testimonials from "~/components/generic/home/Testimonials";
import { WorkProcess } from "~/components/generic/home/WorkProcess";

function HomePages() {
  return (
    <div>
      <Hero />
      <Services />
      <WorkProcess />
      <Pricing />
      <Testimonials />
    </div>
  );
}

export default HomePages;
