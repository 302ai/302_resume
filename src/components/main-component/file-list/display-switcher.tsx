"use client";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/react-resume-ui/tabs";
import { useTranslations } from "next-intl";
import { PiSquaresFour, PiList } from "react-icons/pi";

export type ViewType = "grid" | "list";

interface DisplaySwitcherProps {
  value: ViewType;
  onChange: (view: ViewType) => void;
}

export default function DisplaySwitcher({
  value,
  onChange,
}: DisplaySwitcherProps) {
  const t = useTranslations();
  return (
    <Tabs defaultValue={value}>
      <TabsList defaultValue={value}>
        <TabsTrigger
          value="grid"
          className="size-8 p-0 sm:h-8 sm:w-auto sm:px-4"
          onClick={() => onChange("grid")}
        >
          <PiSquaresFour />
          <span className="ml-2 hidden sm:block">{t("main.gird")}</span>
        </TabsTrigger>
        <TabsTrigger
          value="list"
          className="size-8 p-0 sm:h-8 sm:w-auto sm:px-4"
          onClick={() => onChange("list")}
        >
          <PiList />
          <span className="ml-2 hidden sm:block">{t("main.list")}</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
