"use client";

import { useState } from "react";
import DisplaySwitcher, { ViewType } from "./display-switcher";
import { ScrollArea } from "@/components/ui/react-resume-ui/scroll-area";
import { GridView } from "./_layouts/grid";
import { ListView } from "./_layouts/list";
import { ResumeType } from "@/hooks/use-ajax-resumes";
import CreateButton from "../create-button";
import { cn } from "@/lib/utils";
import ImportButton from "../import-button";
import EmptyIcon from "../empty";
import { useTranslations } from "next-intl";
import CreateButtonAI from "../create-button-ai.tsx";

interface FileListProps {
  resumes: ResumeType[] | null;
  loading: boolean;
  refresh: () => void;
}

export default function FileList({ resumes, loading, refresh }: FileListProps) {
  const [view, setView] = useState<ViewType>("grid");

  const t = useTranslations();

  const handleAfterCreate = () => {
    refresh();
  };

  const isResumeEmpty = !resumes || resumes.length === 0;

  return (
    <div className="flex w-full flex-1 flex-col gap-3">
      <div
        className={cn(
          "flex w-full items-center",
          isResumeEmpty ? "justify-center" : "justify-between"
        )}
      >
        <div
          className={cn(
            "flex w-full flex-row gap-4",
            isResumeEmpty ? "mt-7 items-center justify-center" : "items-start"
          )}
        >
          <CreateButtonAI afterCreate={handleAfterCreate} />
          <CreateButton afterCreate={handleAfterCreate} />
          <ImportButton afterImport={handleAfterCreate} />
        </div>
        {!isResumeEmpty && (
          <div className="rounded-sm bg-secondary">
            <DisplaySwitcher value={view} onChange={setView} />
          </div>
        )}
      </div>
      <div className="flex w-full flex-1">
        {isResumeEmpty ? (
          <div className="mx-auto my-9 flex flex-col items-center justify-center">
            <div className="size-64 lg:size-80">
              <EmptyIcon />
            </div>
            <p className="mt-8 w-full text-center text-3xl text-secondary-foreground opacity-50">
              {t("main.no_data")}
            </p>
          </div>
        ) : (
          <ScrollArea className="w-full">
            {view === "grid" ? (
              <GridView
                resumes={resumes}
                loading={loading}
                afterDelete={refresh}
              />
            ) : (
              <ListView
                resumes={resumes}
                loading={loading}
                afterDelete={refresh}
              />
            )}
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
