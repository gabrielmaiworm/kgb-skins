import React from "react";
import { DropdownMenuItem, DropdownMenuSeparator } from "../ui/dropdown-menu";

type DropDownItemType = {
  onClick?: () => void;
  children: string;
  end?: boolean;
};

export const DropDownItem: React.FC<DropDownItemType> = ({ children, onClick, end }) => {
  return (
    <>
      <DropdownMenuItem onClick={onClick} className="cursor-pointer">
        {children}
      </DropdownMenuItem>
      {!end && <DropdownMenuSeparator />}
    </>
  );
};
