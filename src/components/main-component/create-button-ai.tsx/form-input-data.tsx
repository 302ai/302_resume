"use client";

import * as Form from "@radix-ui/react-form";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export interface FormInputValues {
  name: string;
  birth: string;
  gender: string;
  email: string;
  position: string;
  workTime: string;
  phone: string;
  address: string;

  personalInfo: string;

  optimize: string;
}

const FormItem = (props: {
  label: string;
  children: ReactNode;
  danger?: boolean;
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-start">
        <Form.Label className="w-[120px] text-[15px] font-medium dark:text-white md:w-[90px]">
          {props.danger && <span className="text-red-500">*</span>}{" "}
          {props.label}
        </Form.Label>
      </div>
      <div className="flex-1">{props.children}</div>
    </div>
  );
};

const FormInputData = (props: {
  defaultValue: FormInputValues;
  onChange: (value: FormInputValues) => void;
}) => {
  const { defaultValue: parentValue, onChange } = props;

  const t = useTranslations();
  return (
    <Form.Root className="flex w-full flex-col gap-4">
      <Form.Field
        className="grid max-h-[600px] gap-4 overflow-y-auto p-4"
        name="email"
      >
        <div className="flex flex-col items-baseline justify-between">
          <Form.Label className="text-[15px] font-medium leading-[35px] dark:text-white">
            {t("main.create_resume_ai_dialog.step_input_data_core")}
          </Form.Label>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="flex items-baseline justify-between">
              <FormItem
                label={t("main.create_resume_ai_dialog.input_name")}
                danger={true}
              >
                <Input
                  type="text"
                  defaultValue={parentValue.name}
                  onChange={(e) =>
                    onChange({ ...parentValue, name: e.target.value })
                  }
                  className="rounded border p-2"
                />
              </FormItem>
            </div>
            <div className="flex items-baseline justify-between">
              <FormItem
                label={t("main.create_resume_ai_dialog.input_birth")}
                danger={true}
              >
                <Input
                  type="text"
                  defaultValue={parentValue.birth}
                  onChange={(e) =>
                    onChange({ ...parentValue, birth: e.target.value })
                  }
                  className="rounded border p-2"
                />
              </FormItem>
            </div>
            <div className="flex items-baseline justify-between">
              <FormItem label={t("main.create_resume_ai_dialog.input_gender")}>
                <Input
                  type="text"
                  defaultValue={parentValue.gender}
                  onChange={(e) =>
                    onChange({ ...parentValue, gender: e.target.value })
                  }
                  className="rounded border p-2"
                />
              </FormItem>
            </div>
            <div className="flex items-baseline justify-between">
              <FormItem label={t("main.create_resume_ai_dialog.input_email")}>
                <Input
                  type="text"
                  defaultValue={parentValue.email}
                  onChange={(e) =>
                    onChange({ ...parentValue, email: e.target.value })
                  }
                  className="rounded border p-2"
                />
              </FormItem>
            </div>
            <div className="flex items-baseline justify-between">
              <FormItem
                label={t("main.create_resume_ai_dialog.input_position")}
                danger={true}
              >
                <Input
                  type="text"
                  defaultValue={parentValue.position}
                  onChange={(e) =>
                    onChange({ ...parentValue, position: e.target.value })
                  }
                  className="rounded border p-2"
                />
              </FormItem>
            </div>
            <div className="flex items-baseline justify-between">
              <FormItem
                label={t("main.create_resume_ai_dialog.input_work_time")}
                danger={true}
              >
                <Input
                  type="text"
                  defaultValue={parentValue.workTime}
                  onChange={(e) =>
                    onChange({ ...parentValue, workTime: e.target.value })
                  }
                  className="rounded border p-2"
                />
              </FormItem>
            </div>
            <div className="flex items-baseline justify-between">
              <FormItem label={t("main.create_resume_ai_dialog.input_phone")}>
                <Input
                  type="text"
                  defaultValue={parentValue.phone}
                  onChange={(e) =>
                    onChange({ ...parentValue, phone: e.target.value })
                  }
                  className="rounded border p-2"
                />
              </FormItem>
            </div>
            <div className="flex items-baseline justify-between">
              <FormItem label={t("main.create_resume_ai_dialog.input_address")}>
                <Input
                  type="text"
                  defaultValue={parentValue.address}
                  onChange={(e) =>
                    onChange({ ...parentValue, address: e.target.value })
                  }
                  className="rounded border p-2"
                />
              </FormItem>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-baseline justify-between">
          <Form.Label className="text-[15px] font-medium leading-[35px] dark:text-white">
            <span className="text-red-500">*</span>
            {t("main.create_resume_ai_dialog.step_input_data_personal")}
          </Form.Label>
          <Form.Label className="text-[14px] font-medium leading-[24px] dark:text-white">
            <p>
              {t(
                "main.create_resume_ai_dialog.step_input_data_personal_hint_1"
              )}
            </p>
            <p>
              {t(
                "main.create_resume_ai_dialog.step_input_data_personal_hint_2"
              )}
            </p>
          </Form.Label>
          <Textarea
            defaultValue={parentValue.personalInfo}
            onChange={(e) =>
              onChange({ ...parentValue, personalInfo: e.target.value })
            }
            className="rounded border p-2"
          />
        </div>
        <div className="flex flex-col items-baseline justify-between">
          <Form.Label className="text-[15px] font-medium leading-[35px] dark:text-white">
            {t("main.create_resume_ai_dialog.step_input_data_optimize")}
          </Form.Label>
          <Form.Label className="text-[14px] font-medium leading-[24px] dark:text-white">
            <p>
              {t(
                "main.create_resume_ai_dialog.step_input_data_optimize_hint_1"
              )}
            </p>
            <p>
              {t(
                "main.create_resume_ai_dialog.step_input_data_optimize_hint_2"
              )}
            </p>
          </Form.Label>
          <Textarea
            defaultValue={parentValue.optimize}
            onChange={(e) =>
              onChange({ ...parentValue, optimize: e.target.value })
            }
            className="rounded border p-2"
          />
        </div>
      </Form.Field>
    </Form.Root>
  );
};

export default FormInputData;
