"use client";

import { useIsHideBrand } from "@/hooks/global/use-is-hide-brand";
import { isMobile } from "@/utils";
import Script from "next/script";

const AppChat = () => {
  const isHideBrand = useIsHideBrand();
  if (isMobile() || isHideBrand) {
    if (typeof window !== "undefined") {
      document.getElementById("ss-chat-p")?.remove();
    }
    return null;
  }
  return (
    <Script src="https://assets.salesmartly.com/js/project_177_61_1649762323.js" />
  );
};

export default AppChat;
