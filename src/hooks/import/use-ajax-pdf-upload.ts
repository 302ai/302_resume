import { logger } from "@/utils";
import useAsyncFunction from "../use-async-function";
import { apiKy } from "@/api";
import { z } from "zod";
import { emitter } from "@/utils/mitt";
import { useTranslations } from "next-intl";

const apiUrl = "302/upload-file";

const resSchema = z.object({
  code: z.number(),
  data: z.string(),
  message: z.string(),
});

const action = async (file: File) => {
  let result: string | null = null;
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiKy
      .post(apiUrl, {
        body: formData,
      })
      .json();

    const data = resSchema.parse(response);
    result = data.data;
  } catch (error) {
    logger.error(error);
  }
  return result;
};

const useAjaxPdfUpload = () => {
  const t = useTranslations();
  const { loading, doAsync: doAjax } = useAsyncFunction({
    action: async (param) => {
      const result = await action(param);
      if (!result) {
        emitter.emit("ToastError", {
          code: -1,
          message: t("main.import_dialog.error_empty_file_url"),
        });
        return result;
      }
      return result;
    },
  });

  return {
    loading,
    doAjax,
  };
};

export default useAjaxPdfUpload;
