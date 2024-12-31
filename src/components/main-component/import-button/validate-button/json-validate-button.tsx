import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { emitter } from "@/utils/mitt";
import { createScopedLogger } from "@/utils";
import { ResumeData, resumeDataSchema } from "@/utils/resume-data-schema";
import { ValidationResult } from ".";
import ButtonText from "./button-text";
import useDefaultResumeData from "@/hooks/use-default-resume-data";
import { parseDataToResume } from "@/utils/parse-data-to-resume/index";

const JsonValidateButton = (props: {
  file: File | null;
  handleValidate: (result: ValidationResult) => void;
  onChangeLoading: (flag: boolean) => void;
}) => {
  const { file, handleValidate, onChangeLoading } = props;
  const t = useTranslations();

  const logger = createScopedLogger("Home");

  const loading = false;

  const disabled = !file;

  const { getter: getDefaultResumeData } = useDefaultResumeData();

  const action = async () => {
    const importedData = getDefaultResumeData();
    if (!file) return;
    try {
      const fileContent = await file.text();
      const jsonData = parseDataToResume(
        importedData.data,
        JSON.parse(fileContent)
      );
      importedData.data = jsonData;
    } catch (error) {
      logger.error(error);
      emitter.emit("ToastError", {
        code: -1,
        message: t("main.import_dialog.validate_error"),
      });
      return;
    }
    const resumeData: ResumeData = importedData.data;

    const validateData: ValidationResult = {
      isValid: true,
      type: "json",
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
export default JsonValidateButton;
