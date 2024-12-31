"use client";

import { useTranslations } from "next-intl";
import LogoIcon from "./logo-icon";
import { useIsHideBrand } from "@/hooks/global/use-is-hide-brand";

interface HeaderTitleProps {}

export default function HeaderTitle({}: HeaderTitleProps) {
  const t = useTranslations();

  const hideBrand = useIsHideBrand();

  return (
    <div className="mt-9 flex flex-row items-center space-x-4">
      {!hideBrand && <LogoIcon className="size-8 flex-shrink-0" />}
      <h1 className="break-all text-3xl font-bold leading-tight tracking-tighter transition-all sm:text-4xl lg:leading-[1.1]">
        {t("main.header_title")}
      </h1>
    </div>
  );
}
