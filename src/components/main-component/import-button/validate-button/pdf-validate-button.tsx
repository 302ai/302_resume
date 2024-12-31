import { Button } from "@/components/ui/button";
import useAjaxPdfUpload from "@/hooks/import/use-ajax-pdf-upload";
import useAjaxPdfParsing from "@/hooks/import/use-ajax-pdf-parsing";
import useAjaxPdfSummary from "@/hooks/import/use-ajax-pdf-summary";
import { useTranslations } from "next-intl";
import { emitter } from "@/utils/mitt";
import { createScopedLogger } from "@/utils";
import { ValidationResult } from ".";
import ButtonText from "./button-text";
import useDefaultResumeData from "@/hooks/use-default-resume-data";
import { parseDataToResume } from "@/utils/parse-data-to-resume/index";

const PdfValidateButton = (props: {
  file: File | null;
  handleValidate: (result: ValidationResult) => void;
  onChangeLoading: (flag: boolean) => void;
}) => {
  const { file, handleValidate, onChangeLoading } = props;
  const t = useTranslations();
  const { loading: uploadLoading, doAjax: doUpload } = useAjaxPdfUpload();
  const { loading: parsingLoading, doAjax: doParsing } = useAjaxPdfParsing();
  const { loading: summaryLoading, doAjax: doSummary } = useAjaxPdfSummary();

  const logger = createScopedLogger("Home");

  const loading = uploadLoading || parsingLoading || summaryLoading;

  const disabled = !file;

  const { getter: getDefaultResumeData } = useDefaultResumeData();

  const action = async () => {
    const fileUrl = await doUpload(file);
    if (!fileUrl) {
      emitter.emit("ToastError", {
        code: -1,
        message: t("main.import_dialog.validate_upload_error"),
      });
      return;
    }
    const markdownStr = await doParsing(fileUrl);
    if (!markdownStr) {
      emitter.emit("ToastError", {
        code: -1,
        message: t("main.import_dialog.validate_error"),
      });
      return;
    }

    const json = await doSummary(markdownStr);

    if (!json) {
      emitter.emit("ToastError", {
        code: -1,
        message: t("main.import_dialog.validate_error"),
      });
      return;
    }

    let jsonData: any = null;

    try {
      jsonData = JSON.parse(json);
    } catch (error) {
      logger.error(error);
      emitter.emit("ToastError", {
        code: -1,
        message: t("main.import_dialog.validate_error"),
      });
    }
    const defaultData = getDefaultResumeData();

    const resumeData = parseDataToResume(defaultData.data, jsonData);

    resumeData.metadata = defaultData.data.metadata;
    resumeData.basics.url = defaultData.data.basics.url;

    const validateData: ValidationResult = {
      isValid: true,
      type: "pdf",
      result: resumeData,
    };
    emitter.emit("ToastSuccess", {
      code: -1,
      message: `${t("main.import_dialog.validate_success")}`,
    });
    handleValidate(validateData);
  };

  const onClick = async () => {
    onChangeLoading(true);
    await action();
    onChangeLoading(false);
  };
  return (
    <Button
      disabled={disabled || loading}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      <ButtonText loading={loading}>
        {t("main.import_dialog.action_validate")}
      </ButtonText>
    </Button>
  );
};
export default PdfValidateButton;
