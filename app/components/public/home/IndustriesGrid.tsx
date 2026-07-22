import * as Icons from "lucide-react";
import { LucideProps } from "lucide-react";

interface Industry {
  name: string;
  icon: string;
}

interface IndustriesGridProps {
  industries: Industry[];
}

function toPascalCase(str: string) {
  return str.replace(/(^\w|-\w)/g, (s) => s.replace("-", "").toUpperCase());
}

export default function IndustriesGrid({ industries }: IndustriesGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {industries.map((industry) => {
        const IconComponent =
          (
            Icons as unknown as Record<string, React.ComponentType<LucideProps>>
          )[toPascalCase(industry.icon)] ?? Icons.Building2;

        return (
          <div
            key={industry.name}
            className="flex flex-col items-center gap-3 rounded-lg bg-brand text-slate-50 p-6 text-center"
          >
            <IconComponent className="h-8 w-8 text-slate-50" />
            <p className="text-sm font-medium">{industry.name}</p>
          </div>
        );
      })}
    </div>
  );
}
