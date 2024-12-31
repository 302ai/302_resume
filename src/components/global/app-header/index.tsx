"use client";
import { cn } from "@/lib/utils";
import { isOutsideDeployMode } from "@/utils/302";
import { isAuthPath } from "@/utils/path";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeSwitcher } from "./theme-switcher";
import { ToolInfo } from "./tool-info";

type HeaderProps = {
  className?: string;
};

const Header = forwardRef<HTMLDivElement, HeaderProps>(({ className }, ref) => {
  const pathname = usePathname();
  return (
    <div
      ref={ref}
      className={cn(
        "absolute right-0 top-0 z-10 flex items-center justify-end gap-2 p-2",
        className
      )}
    >
      {!isAuthPath(pathname) && !isOutsideDeployMode() && <ToolInfo />}
      <LanguageSwitcher />
      <ThemeSwitcher />
    </div>
  );
});

Header.displayName = "AppHeader";

export default Header;
