"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckCircle2, Sparkles, Crown, Users, BarChart3 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface TourStep {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface TourProps {
  triggerText?: string;
  triggerVariant?: "default" | "outline" | "secondary" | "ghost" | "link";
}

export function Tour({ triggerText = "Start Tour", triggerVariant = "outline" }: TourProps) {
  const [step, setStep] = useState(0);

  const steps: TourStep[] = [
    {
      title: "Welcome to NameDrop.cv",
      description: "Build your professional CV website with custom branding and verification. Your story deserves more than a plain link.",
      icon: <Sparkles className="w-5 h-5 text-primary" />
    },
    {
      title: "Create Your Professional Identity",
      description: "Use our smart CV builder to craft your story. Add work experience, skills, and projects that showcase your expertise.",
      icon: <Users className="w-5 h-5 text-primary" />
    },
    {
      title: "Unlock Pro Features",
      description: "Upgrade to Pro for custom domains, verification badges, AI optimization, and advanced analytics to amplify your reach.",
      icon: <Crown className="w-5 h-5 text-primary" />
    },
    {
      title: "Track Your Impact",
      description: "Monitor profile views, CV downloads, and link clicks. See how your professional story resonates with your audience.",
      icon: <BarChart3 className="w-5 h-5 text-primary" />
    },
  ];

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  return (
    <Dialog onOpenChange={(open) => open && setStep(0)}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant}>{triggerText}</Button>
      </DialogTrigger>

      <DialogContent
        className={cn(
          "max-w-3xl p-0 overflow-hidden rounded-xl border shadow-2xl",
          "bg-white text-black",
          "dark:bg-black dark:text-white dark:border-neutral-800",
          "data-[state=open]:animate-none data-[state=closed]:animate-none"
        )}
      >
        <div className="flex flex-col md:flex-row w-full h-full">
          {/* Sidebar */}
          <div className="w-full md:w-1/3 p-6 border-r border-gray-200 dark:border-neutral-800">
            <div className="flex flex-col gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">N</span>
              </div>
              <h2 className="text-lg font-medium">NameDrop.cv Tour</h2>
              <p className="text-sm opacity-80">
                Discover how to build your professional identity and amplify your career story.
              </p>
              <div className="flex flex-col gap-3 mt-6">
                {steps.map((s, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center gap-2 text-sm transition",
                      index === step
                        ? "font-semibold"
                        : "opacity-60 hover:opacity-100"
                    )}
                  >
                    {index < step ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : index === step ? (
                      s.icon
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-black dark:bg-white/40" />
                    )}
                    <span className="font-normal">{s.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-2/3 p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.25 }}
                    >
                      {steps[step].icon}
                    </motion.div>
                  </AnimatePresence>
                </div>
                
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={steps[step].title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="text-2xl font-medium"
                  >
                    {steps[step].title}
                  </motion.h2>
                </AnimatePresence>

                <div className="min-h-[60px]">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={steps[step].description}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="text-gray-600 dark:text-gray-400 text-base opacity-90"
                    >
                      {steps[step].description}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </DialogHeader>

              {/* Visual Content */}
              <div className="w-full h-60 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    <div className="text-6xl mb-4">
                      {step === 0 && "🚀"}
                      {step === 1 && "✨"}
                      {step === 2 && "👑"}
                      {step === 3 && "📊"}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Step {step + 1} of {steps.length}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-between items-center">
              <DialogClose asChild>
                <Button variant="outline">Skip Tour</Button>
              </DialogClose>

              {step < steps.length - 1 ? (
                <Button onClick={next}>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <DialogClose asChild>
                  <Button>Get Started</Button>
                </DialogClose>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}