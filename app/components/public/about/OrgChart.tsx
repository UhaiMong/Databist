import React from "react";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Adjust path based on your shadcn installation

// --- TYPE DEFINITIONS ---
// This ensures your dynamic data will plug in perfectly later.
export type TeamMember = {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  extraMessage?: string;
};

export type Department = {
  id: string;
  leader: TeamMember;
  reports: TeamMember[];
};

// --- FALLBACK DEMO DATA ---
// Kept to 4 members as requested (CEO, CTO, and 2 reports)
const fallbackData: Department[] = [
  {
    id: "dept-1",
    leader: {
      id: "ceo-1",
      name: "Yeasin Arafat",
      role: "Co-Founder - Chief Executive Officer (CEO)",
      imageUrl: "/about/shahin.jpeg",
      extraMessage:
        "Alex drives the core vision and strategy, ensuring we meet our quarterly growth targets.",
    },
    reports: [
      {
        id: "emp-1",
        name: "Sajjad",
        role: "Sales Manager",
        imageUrl: "/about/sajjad.jpeg",
      },
    ],
  },
  {
    id: "dept-2",
    leader: {
      id: "cto-1",
      name: "Uhai Mong",
      role: "Co-Founder - Chief Technology Officer (CTO)",
      imageUrl: "/about/uhai.jpg",
      extraMessage:
        "Innovation happens when you explore new paths and are willing to change how you do things.",
    },
    reports: [
      {
        id: "emp-2",
        name: "Akram",
        role: "Developer",
        imageUrl: "/about/avatar.png",
      },
    ],
  },
];

interface OrgChartProps {
  departments?: Department[];
}

export default function OrgChart({
  departments = fallbackData,
}: OrgChartProps) {
  return (
    <section className="min-h-auto bg-page-bg px-4 py-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-200 mb-4 tracking-tight">
            Our Executive & <br /> Team
          </h2>
        </div>

        {/* Dynamic Organization Chart */}
        <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-12 relative">
          {/* Optional: Dotted connector line between founders for desktop */}
          <div className="hidden md:block absolute top-11.25 left-1/2 -translate-x-1/2 w-12 border-t-2 border-dashed border-slate-400 z-0" />

          {departments.map((dept, index) => (
            <div
              key={dept.id}
              className={`flex flex-col items-center flex-1 animate-fade-up delay-${(index + 1) * 100}`}
            >
              {/* Leader Card (Yellow Background) */}
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative z-10 w-full max-w-md bg-yellow-400 border-2 border-slate-400 rounded-xl p-3 flex items-center gap-4 cursor-help transition-transform hover:-translate-y-1 shadow-sm">
                      {dept.leader.imageUrl ? (
                        <img
                          src={dept.leader.imageUrl}
                          alt={dept.leader.name}
                          className="w-16 h-16 rounded-lg object-cover border border-black/10 bg-white"
                        />
                      ) : (
                        <img
                          src="/about/avatar.png"
                          alt={dept.leader.name}
                          className="w-16 h-16 rounded-lg object-cover border border-black/10 bg-white"
                        />
                      )}
                      <div className="text-left flex-1">
                        <h3 className="font-bold text-slate-900 leading-tight">
                          {dept.leader.role}
                        </h3>
                        <p className="text-[16px] font-black text-slate-900">
                          ({dept.leader.name})
                        </p>
                      </div>
                      {dept.leader.extraMessage && (
                        <Info className="w-5 h-5 text-slate-700 opacity-70 shrink-0" />
                      )}
                    </div>
                  </TooltipTrigger>
                  {dept.leader.extraMessage && (
                    <TooltipContent className="max-w-xs bg-black/80 text-white p-5 text-[20px] rounded-lg shadow-lg">
                      <p>{dept.leader.extraMessage}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>

              {/* Connecting Line Downwards */}
              {dept.reports.length > 0 && (
                <div className="flex flex-col items-center w-full">
                  <div className="h-8 border-l-2 border-slate-300"></div>

                  {/* Horizontal Branching Line (if multiple reports) */}
                  {dept.reports.length > 1 && (
                    <div className="w-[calc(100%-4rem)] border-t-2 border-slate-300"></div>
                  )}

                  {/* Reports Grid */}
                  <div className="flex flex-wrap justify-center gap-4 pt-4 w-full">
                    {dept.reports.map((report) => (
                      <div
                        key={report.id}
                        className="relative flex flex-col items-center group"
                      >
                        {/* Vertical drop line for multiple reports */}
                        {dept.reports.length > 1 && (
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-4 border-l-2 border-slate-300 hidden md:block"></div>
                        )}

                        {/* Employee Card */}
                        <div className="bg-white border border-slate-200 rounded-xl p-3 w-32 flex flex-col items-center gap-3 shadow-sm transition-all hover:shadow-md hover:border-slate-300">
                          <img
                            src={report.imageUrl}
                            alt={report.name}
                            className="w-14 h-14 rounded-lg object-cover bg-slate-100"
                          />
                          <div className="text-center">
                            <h3 className="font-black text-[16px] text-slate-900">
                              ({report.name})
                            </h3>
                            <p className="text-sm font-semibold text-slate-900 leading-tight">
                              {report.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
