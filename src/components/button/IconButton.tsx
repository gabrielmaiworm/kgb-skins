import Link from "next/link";
import React from "react";
import { IconType } from "react-icons";

type IconProps = {
  Icon: IconType;
  url: string;
  size?: string;
  color?: string;
  alt: string;
};

const IconButton: React.FC<IconProps> = ({ Icon, url, size = "text-base", color = "text-[#1B75BB]", alt }) => {
  return (
    <div className="flex items-center justify-center ">
      <Link aria-label={alt} target="_blank" href={url}>
        <div className="w-[1.8rem] h-[1.8rem] bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 hover:bg-srtc-hover-cinza transition-all">
          <Icon className={`${color} ${size}`} />
        </div>
      </Link>
    </div>
  );
};

export default IconButton;
