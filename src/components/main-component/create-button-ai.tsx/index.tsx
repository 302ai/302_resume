"use client";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { save } from "@/lib/db";
import dayjs from "dayjs";
import useDefaultResumeData from "@/hooks/use-default-resume-data";
import Stepper, { StepValue } from "./stepper";
import FormLanguage from "./form-language";
import FormTemplate from "./form-template";
import FormInputData, { FormInputValues } from "./form-input-data";
import SubmitButton from "./submit-button";
import { emitter } from "@/utils/mitt";

const defaultFormInputData: FormInputValues = {
  name: "",
  birth: "",
  gender: "",
  email: "",
  phone: "",
  address: "",
  position: "",
  workTime: "",
  personalInfo: "",
  optimize: "",
};

const CreateButtonAI = (props: { afterCreate: () => void }) => {
  const { afterCreate } = props;
  const t = useTranslations();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false); // 改为使用 state
  const [language, setLanguage] = useState<string | undefined>(undefined);
  const [template, setTemplate] = useState<string | undefined>(undefined);
  const [formInputData, setFormInputData] =
    useState<FormInputValues>(defaultFormInputData);

  const [step, setStep] = useState<StepValue>("select-language");

  const { getter: getDefaultResumeData } = useDefaultResumeData();

  const handleCreate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const defaultData = getDefaultResumeData();
    defaultData.createdAt = dayjs().valueOf().toString();
    defaultData.updatedAt = dayjs().valueOf().toString();
    await save(defaultData);
    setOpen(false);
    afterCreate();
  };

  const isDisabled = () => {
    if (step === "select-language") {
      return language === undefined;
    } else if (step === "select-template") {
      return template === undefined;
    }
    return false;
  };

  const onClickNextStep = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (step === "select-language") {
      setStep("select-template");
    } else if (step === "select-template") {
      setStep("input-experience");
    } else if (step === "input-experience") {
      handleCreate(e);
    }
  };

  const onClickPreviousStep = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      // 使用 loading state
      return;
    }
    e.preventDefault();
    if (step === "select-template") {
      setStep("select-language");
    } else if (step === "input-experience") {
      setStep("select-template");
    }
  };

  const onChangeFormInputData = (value: FormInputValues) => {
    setFormInputData(value);
  };

  const refresh = () => {
    setOpen(false);
    setFormInputData(defaultFormInputData);
    setLanguage(undefined);
    setTemplate(undefined);
    setStep("select-language");
    afterCreate();
  };

  const onOpenChange = (flag: boolean) => {
    if (!flag && loading) {
      // 使用 loading state
      emitter.emit("ToastError", {
        code: -1,
        message: t("main.create_resume_ai_dialog.submit-button-loading"),
      });
      return;
    }
    setOpen(flag);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button variant="default">{t("main.create_resume_ai")}</Button>
        </DialogTrigger>
        <DialogContent className="max-w-[1200px]">
          <DialogTitle>{t("main.create_resume_ai")}</DialogTitle>
          <DialogDescription></DialogDescription>
          <Stepper value={step} onChange={setStep} />
          {step === "select-language" && (
            <FormLanguage value={language} onChange={setLanguage} />
          )}
          {step === "select-template" && (
            <FormTemplate value={template} onChange={setTemplate} />
          )}
          {step === "input-experience" && (
            <FormInputData
              defaultValue={formInputData}
              onChange={onChangeFormInputData}
            />
          )}

          <div className="flex flex-row justify-center gap-2">
            {step !== "select-language" && (
              <Button
                disabled={loading}
                className="mt-4"
                variant="default"
                onClick={(e) => onClickPreviousStep(e)}
              >
                {t("main.create_resume_ai_dialog.previous_step")}
              </Button>
            )}
            {step !== "input-experience" ? (
              <Button
                className="mt-4"
                variant="default"
                disabled={isDisabled()}
                onClick={(e) => onClickNextStep(e)}
              >
                {t("main.create_resume_ai_dialog.next_step")}
              </Button>
            ) : (
              <SubmitButton
                refresh={refresh}
                onChangeLoading={setLoading} // 更新为使用 setLoading
                values={{
                  ...formInputData,
                  language: language,
                  template: template,
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateButtonAI;
