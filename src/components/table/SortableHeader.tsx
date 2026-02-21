import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { useSort } from "@/context/SortContext";

interface SortableHeaderProps {
  column: any;
  columnKey: string;
  title: string;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({ column, columnKey, title }) => {
  const { handleSortValue } = useSort();
  return (
    <Button variant="ghost" onClick={() => handleSortValue(columnKey)}>
      <span className="title-medium font-bold text-muted-foreground">{title}</span>
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};

export const UnsortableHeader: React.FC<{
  title: string;
  style?: React.CSSProperties;
  columnKey?: string;
  icon: React.ElementType;
}> = ({ title, style, columnKey, icon: Icon }) => {
  return (
    <div
      className="button_text px-2 inline-flex items-start justify-start gap-2 rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 whitespace-nowrap"
      style={style}
    >
      <Icon className="w-4 h-4" />
      <span className="title-medium font-bold text-muted-foreground">{title}</span>
    </div>
  );
};

export default SortableHeader;
