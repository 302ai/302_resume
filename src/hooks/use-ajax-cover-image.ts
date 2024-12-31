import { useState } from "react";

import { ResumeSchemaData } from "@/lib/reative-resume/dto/resume";
import { selfKy } from "@/api";

const useAjaxCoverImage = () => {
  const [loading, setLoading] = useState(false);

  const doAjax = async (resumeData: ResumeSchemaData) => {
    setLoading(true);
    let result: string | null = null;
    const url = `api/generate-cover-image`;
    try {
      const res = await selfKy
        .post(url, {
          json: {
            data: resumeData,
          },
        })
        .json<{ data: { url: string } }>();
      result = res.data.url;
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
    return result;
  };

  return {
    loading,
    doAjax,
  };
};
export default useAjaxCoverImage;
