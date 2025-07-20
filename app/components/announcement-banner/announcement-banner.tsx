import NextLink from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FallInPlace } from "@/components/motion/fall-in-place";

export interface AnnouncementBannerProps {
  title: string;
  description: string;
  href: string;
  action?: string;
}

export const AnnouncementBanner: React.FC<AnnouncementBannerProps> = (
  props
) => {
  const { title, description, href, action } = props;
  if (!title) {
    return null;
  }

  return (
    <div className="absolute top-[100px] z-10 w-full">
      <div className="container max-w-7xl px-8">
        <FallInPlace delay={1.4} translateY="-100px">
          <NextLink href={href}>
            <div
              className={cn(
                "group relative mx-auto flex max-w-[400px] cursor-pointer items-center justify-center",
                "overflow-visible rounded-full bg-white px-3 py-1 text-sm transition-all duration-200 ease-out",
                "dark:bg-gray-900",
                "before:absolute before:inset-0 before:-m-0.5 before:rounded-full before:bg-gradient-to-r before:from-purple-500 before:to-cyan-500",
                "before:transition-all before:duration-200 before:ease-out before:-z-10",
                "hover:shadow-md"
              )}
            >
              <div className="z-[2] flex items-center gap-2">
                <span className="font-semibold text-foreground line-clamp-1">
                  {title}
                </span>
                <span 
                  className="hidden md:block text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: description }}
                />

                {action && (
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-muted-foreground hover:no-underline"
                  >
                    Read more
                    <ArrowRight className="ml-1 h-3 w-3 -translate-x-1 transition-transform duration-200 group-hover:translate-x-0" />
                  </Button>
                )}
              </div>
            </div>
          </NextLink>
        </FallInPlace>
      </div>
    </div>
  );
};
