import { Reveal } from "@/components/animation/reveal";
import { About } from "@/components/home/about";
import { CategoryBrowse } from "@/components/home/category-browse";
import { FeaturedStudios } from "@/components/home/featured-studios";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { RecentlyAdded } from "@/components/home/recently-added";
import { getHeroSlides } from "@/lib/studios";

export default function Home() {
  return (
    <>
      {/* The hero is above the fold — everything below reveals on scroll. */}
      <Hero slides={getHeroSlides()} />
      <CategoryBrowse />
      <Reveal>
        <FeaturedStudios />
      </Reveal>
      <RecentlyAdded />
      <Reveal>
        <HowItWorks />
      </Reveal>
      <Reveal>
        <About />
      </Reveal>
    </>
  );
}
