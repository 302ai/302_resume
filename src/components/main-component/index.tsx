"use client";

import { useEffect, useState } from "react";
import HeaderTitle from "./header-title";
import FileList from "./file-list";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/reative-resume/query-client";
import { ResumeType } from "@/hooks/use-ajax-resumes";
import { getAll } from "@/lib/db";

export default function MainComponent() {
  const [loading, setLoading] = useState(false);
  const [resumes, setResumes] = useState<ResumeType[] | null>([]);

  const refresh = async () => {
    setLoading(true);
    const resumes = await getAll();
    setResumes(resumes);
    setLoading(false);
  };

  const handleAfterCreate = () => {
    refresh();
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="mx-auto my-0 flex w-full min-w-[300px] max-w-[1560px] flex-1 flex-col items-center justify-between p-3 ease-in-out">
      <HeaderTitle />
      <QueryClientProvider client={queryClient}>
        <FileList
          resumes={resumes}
          loading={loading}
          refresh={handleAfterCreate}
        />
      </QueryClientProvider>
    </div>
  );
}
