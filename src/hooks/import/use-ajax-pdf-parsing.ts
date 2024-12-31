import { logger } from "@/utils";
import useAsyncFunction from "../use-async-function";
import { apiKy } from "@/api";
import { z } from "zod";

const apiUrl = "302/file/parsing";

const resSchema = z.object({
  code: z.number(),
  msg: z.string(),
  data: z.object({
    msg: z.string(),
  }),
});

const action = async (fileUrl: string) => {
  let result: string | null = null;
  try {
    const response = await apiKy
      .get(apiUrl, {
        searchParams: {
          url: fileUrl,
        },
      })
      .json();

    const data = resSchema.parse(response);
    result = data.data.msg;
  } catch (error) {
    logger.error(error);
  }
  return result;
};

const useAjaxPdfParsing = () => {
  const { loading, doAsync: doAjax } = useAsyncFunction({
    action: action,
  });

  return {
    loading,
    doAjax,
  };
};

export default useAjaxPdfParsing;
