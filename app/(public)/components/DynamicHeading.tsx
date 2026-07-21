import { cn } from "@/lib/utils";
import * as React from "react";

interface HeadingProps {
  className?: string;
  titleClassName?: string;
  subTitleClassName?: string;
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
}

function Heading({
  className,
  titleClassName,
  subTitleClassName,
  title,
  subTitle,
}: HeadingProps) {
  return (
    <div className={cn("mb-10 max-w-2xl", className)}>
      {title && (
        <h2 className={cn("text-3xl font-bold tracking-tight", titleClassName)}>
          {title}
        </h2>
      )}
      {subTitle && (
        <p className={cn("mt-3 text-muted-foreground", subTitleClassName)}>
          {subTitle}
        </p>
      )}
    </div>
  );
}

export { Heading };
