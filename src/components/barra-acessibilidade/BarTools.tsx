"use client";

import { useHtmlFontSize } from "@/context/HtmlFontSizeContext";
import { fontSize } from "@/utils/fontSize";
import { VLibras } from "@/utils/vLibras";
import { IoLogoInstagram } from "react-icons/io5";
import { FaLinkedinIn, FaFacebookF, FaYoutube, FaGooglePlay, FaApple } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import React from "react";
import { LibrasButton } from "../button/LibrasButton";
import { ChangeThemeButton } from "../button/ChangeThemeButton";

export const BarTools = () => {
  const [isMounted, setIsMounted] = React.useState<boolean>(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const { setHtmlFontSize } = useHtmlFontSize();

  function openInNewTab(url: string) {
    window.open(url, "_blank");
  }

  if (!isMounted) {
    return null;
  }
  return <div className="fixed w-full z-50"></div>;
};
