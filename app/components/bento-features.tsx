import { CalendarIcon, FileTextIcon } from "@radix-ui/react-icons";
import { BellIcon, Share2Icon, BrainIcon, RocketIcon, CodeIcon, LayoutIcon } from "lucide-react";

// import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import AnimatedBeamMultipleOutputDemo from "@/components/ui/animated-beam-multiple-outputs";
import AnimatedListDemo from "@/components/ui/animated-list-demo";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { Marquee } from "@/components/magicui/marquee";

const files = [
  {
    name: "business-model.pdf",
    body: "Complete business model analysis with market sizing, competitor analysis, and revenue projections.",
  },
  {
    name: "pitch-deck.pptx",
    body: "Investor-ready pitch deck with all the key slides to present your startup idea effectively.",
  },
  {
    name: "system-design.svg",
    body: "Technical architecture diagrams showing the complete system design for your product.",
  },
  {
    name: "ui-mockups.fig",
    body: "Beautiful user interface mockups and wireframes for your product experience.",
  },
  {
    name: "deployment.yml",
    body: "Production-ready code and deployment configurations to launch your MVP.",
  },
];

const features = [
  {
    Icon: BrainIcon,
    name: "Input Your Idea",
    description: "Just describe your startup in plain language and let AI do the work.",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: (
      <Marquee
        pauseOnHover
        className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] "
      >
        {files.map((f, idx) => (
          <figure
            key={idx}
            className={cn(
              "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
              "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
              "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
              "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none",
            )}
          >
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-col">
                <figcaption className="text-sm font-medium dark:text-white ">
                  {f.name}
                </figcaption>
              </div>
            </div>
            <blockquote className="mt-2 text-xs">{f.body}</blockquote>
          </figure>
        ))}
      </Marquee>
    ),
  },
  {
    Icon: FileTextIcon,
    name: "Get Instant Documents",
    description: "Business model, pitch deck, system design, and more automatically generated.",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-2",
    background: (
      <AnimatedListDemo className="absolute right-2 top-4 h-[300px] w-full scale-75 border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-90" />
    ),
  },
  {
    Icon: LayoutIcon,
    name: "AI Builds Your Tech Stack",
    description: "Architecture, UI mockups, and production-ready code without technical expertise.",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-2",
    background: (
      <AnimatedBeamMultipleOutputDemo className="absolute right-2 top-4 h-[300px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
    ),
  },
  {
    Icon: RocketIcon,
    name: "Launch and Manage",
    description: "Track progress, get updates, and ship faster with AI doing the heavy lifting.",
    className: "col-span-3 lg:col-span-1",
    href: "#",
    cta: "Learn more",
    background: (
      <BellIcon
        mode="single"
        
        className="absolute right-0 top-10 origin-top scale-75 rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-90"
      />
    ),
  },
];

export function BentoDemo() {
  return (
    <BentoGrid>
      {features.map((feature, idx) => (
        <BentoCard key={idx} {...feature} />
      ))}
    </BentoGrid>
  );
}
