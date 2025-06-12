import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const mockupVariants = cva(
  "flex relative z-10 overflow-hidden shadow-2xl border border-border/5 border-t-border/15",
  {
    variants: {
      type: {
        mobile: "rounded-[48px] max-w-[350px]",
        responsive: "rounded-md",
        browser: "rounded-lg max-w-5xl mx-auto bg-background",
      },
    },
    defaultVariants: {
      type: "responsive",
    },
  },
);

export interface MockupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof mockupVariants> {
  showBrowser?: boolean;
}

const Mockup = React.forwardRef<HTMLDivElement, MockupProps>(
  ({ className, type, showBrowser = false, children, ...props }, ref) => {
    if (showBrowser || type === "browser") {
      return (
        <div
          ref={ref}
          className={cn(mockupVariants({ type: "browser", className }))}
          {...props}
        >
          <div className="w-full">
            {/* Browser Chrome */}
            <div className="flex h-12 items-center justify-between bg-gray-100 dark:bg-gray-800 px-4">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 mx-6">
                <div className="bg-white dark:bg-gray-700 rounded-md px-3 py-1 text-sm text-gray-600 dark:text-gray-300 font-mono">
                  https://alexsmith.namedrop.cv
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded bg-gray-300 dark:bg-gray-600"></div>
                <div className="h-4 w-4 rounded bg-gray-300 dark:bg-gray-600"></div>
              </div>
            </div>
            
            {/* Content */}
            <div className="relative">
              {children}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(mockupVariants({ type, className }))}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Mockup.displayName = "Mockup";

const frameVariants = cva(
  "bg-accent/5 flex relative z-10 overflow-hidden rounded-2xl",
  {
    variants: {
      size: {
        small: "p-2",
        large: "p-4",
      },
    },
    defaultVariants: {
      size: "small",
    },
  },
);

export interface MockupFrameProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof frameVariants> {}

const MockupFrame = React.forwardRef<HTMLDivElement, MockupFrameProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(frameVariants({ size, className }))}
      {...props}
    />
  ),
);
MockupFrame.displayName = "MockupFrame";

export { Mockup, MockupFrame };