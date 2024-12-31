import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { GrNext } from "react-icons/gr";

export type StepValue =
  | "select-language"
  | "select-template"
  | "input-experience";

export type OptionItem = {
  label: string;
  value: StepValue;
};

const Stepper = (props: {
  value: StepValue;
  onChange: (value: StepValue) => void;
}) => {
  const { value, onChange } = props;
  const t = useTranslations();

  const steps: OptionItem[] = [
    {
      label: t("main.create_resume_ai_dialog.step_select_language"),
      value: "select-language",
    },
    {
      label: t("main.create_resume_ai_dialog.step_select_template"),
      value: "select-template",
    },
    {
      label: t("main.create_resume_ai_dialog.step_input_experience"),
      value: "input-experience",
    },
  ];

  const onClickStep = (value: StepValue) => {
    onChange(value);
  };

  return (
    <div className="flex flex-row items-center justify-center gap-8 rounded-md bg-secondary">
      {steps.map((step, index) => (
        <div
          key={index}
          className="flex h-9 flex-row items-center justify-center gap-8"
        >
          <div
            className={cn(
              "flex flex-row gap-2",
              value === step.value && "text-primary"
            )}
          >
            {step.label}
          </div>
          {index < steps.length - 1 && <GrNext />}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
