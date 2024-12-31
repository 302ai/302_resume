"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { FormInputValues } from "./form-input-data";
import { Loader2 } from "lucide-react";
import useAjaxOptimization from "@/hooks/use-ajax-optimization";
import useDefaultResumeData from "@/hooks/use-default-resume-data";
import dayjs from "dayjs";
import useAjaxLanguageTranslation from "@/hooks/use-ajax-language-translation";
import { parseDataToResume } from "@/utils/parse-data-to-resume/index";
import { save } from "@/lib/db";
import { emitter } from "@/utils/mitt";
import getClearCustomFields from "../get-clear-custom-fields";
import useAjaxSummaryToJson from "@/hooks/use-ajax-summary-to-json";
import { createScopedLogger } from "@/utils";

export interface SubmitButtonValues extends FormInputValues {
  language: string | undefined;
  template: string | undefined;
}

const SubmitButton = (props: {
  values: SubmitButtonValues;
  refresh: () => void;
  onChangeLoading: (loading: boolean) => void;
}) => {
  const { values, refresh, onChangeLoading } = props;
  const {
    name,
    birth,
    gender,
    email,
    position,
    workTime,
    phone,
    address,
    personalInfo,
    optimize,
    language,
    template,
  } = values;
  const t = useTranslations();

  const { doAjax: doAjaxSummaryToJson, loading: loadingSummaryToJson } =
    useAjaxSummaryToJson();
  const {
    doAjax: doAjaxLanguageTranslation,
    loading: loadingLanguageTranslation,
  } = useAjaxLanguageTranslation();
  const { doAjax: doAjaxOptimization, loading: loadingOptimization } =
    useAjaxOptimization();

  const { getter: getDefaultResumeData } = useDefaultResumeData();

  const logger = createScopedLogger("SubmitButton");

  const isDisabled =
    !name ||
    !birth ||
    !position ||
    !workTime ||
    !personalInfo ||
    loadingSummaryToJson ||
    loadingLanguageTranslation ||
    loadingOptimization;

  const action = async () => {
    if (!template || !language) {
      return;
    }
    let resume = getDefaultResumeData();
    resume.data.basics.name = name;
    resume.data.basics.email = email;
    resume.data.basics.phone = phone;
    resume.data.basics.location = address;

    resume.data.basics.customFields = [
      {
        name: t("main.create_resume_ai_dialog.input_birth"),
        value: birth,
        id: "birth",
      },
      {
        name: t("main.create_resume_ai_dialog.input_gender"),
        value: gender,
        id: "gender",
      },
      {
        name: t("main.create_resume_ai_dialog.input_position"),
        value: position,
        id: "position",
      },
      {
        name: t("main.create_resume_ai_dialog.input_work_time"),
        value: workTime,
        id: "workTime",
      },
    ];

    resume.data.metadata.template = template;

    // resume.data.sections.summary.content = personalInfo;

    const resultSummaryToJson = await doAjaxSummaryToJson(personalInfo);
    if (!resultSummaryToJson) {
      emitter.emit("ToastError", {
        code: -1,
        message: t(
          "main.create_resume_ai_dialog.submit-button-error-summary-to-json"
        ),
      });
      return;
    }

    try {
      resume.data = parseDataToResume(
        resume.data,
        JSON.parse(resultSummaryToJson)
      );
    } catch (error) {
      logger.error(error);
      emitter.emit("ToastError", {
        code: -1,
        message: t(
          "main.create_resume_ai_dialog.submit-button-error-summary-to-json"
        ),
      });
      return;
    }

    resume = getClearCustomFields(resume);

    const resultLanguageTranslation = await doAjaxLanguageTranslation(
      JSON.stringify(resume.data),
      language
    );
    if (!resultLanguageTranslation) {
      emitter.emit("ToastError", {
        code: -1,
        message: t("main.create_resume_ai_dialog.submit-button-error"),
      });
      return;
    }
    const resultOptimization = optimize
      ? await doAjaxOptimization(resultLanguageTranslation, optimize)
      : resultLanguageTranslation;
    if (!resultOptimization) {
      emitter.emit("ToastError", {
        code: -1,
        message: t(
          "main.create_resume_ai_dialog.submit-button-optimization-error"
        ),
      });
      return;
    }

    try {
      const data = parseDataToResume(
        resume.data,
        JSON.parse(resultOptimization)
      );

      resume.data = data;
    } catch (error) {
      logger.error(error);
      emitter.emit("ToastError", {
        code: -1,
        message: t(
          "main.create_resume_ai_dialog.submit-button-optimization-error"
        ),
      });
      return;
    }

    resume.createdAt = dayjs().valueOf().toString();
    resume.updatedAt = dayjs().valueOf().toString();
    resume.title = name;
    resume.slug = name;

    resume.data.basics.name = name;
    resume.data.basics.headline = name;
    resume.data.basics.email = email;
    resume.data.basics.phone = phone;
    resume.data.basics.location = address;

    resume.data.basics.customFields = [
      {
        name: t("main.create_resume_ai_dialog.input_birth"),
        value: birth,
        id: "birth",
      },
      {
        name: t("main.create_resume_ai_dialog.input_gender"),
        value: gender,
        id: "gender",
      },
      {
        name: t("main.create_resume_ai_dialog.input_position"),
        value: position,
        id: "position",
      },
      {
        name: t("main.create_resume_ai_dialog.input_work_time"),
        value: workTime,
        id: "workTime",
      },
      ...resume.data.basics.customFields,
    ];

    await save(resume);

    emitter.emit("ToastSuccess", {
      code: 200,
      message: t("main.create_resume_ai_dialog.submit-button-success"),
    });

    refresh();
  };
  const onClick = async () => {
    onChangeLoading(true);
    await action();
    onChangeLoading(false);
  };

  return (
    <Button
      className="mt-4"
      variant="default"
      disabled={isDisabled}
      onClick={() => onClick()}
    >
      {(loadingLanguageTranslation ||
        loadingOptimization ||
        loadingSummaryToJson) && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {t("main.create_resume_ai_dialog.submit-button")}
    </Button>
  );
};
export default SubmitButton;
