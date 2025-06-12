import { cn } from "@/lib/utils"

interface MockupProps {
  children: React.ReactNode
  className?: string
}

export function Mockup({ children, className }: MockupProps) {
  return (
    <div
      className={cn(
        "relative mx-auto max-w-5xl",
        "rounded-lg border bg-background shadow-2xl",
        "overflow-hidden",
        className
      )}
    >
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
  )
}