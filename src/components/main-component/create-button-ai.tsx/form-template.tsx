/* eslint-disable @next/next/no-img-element */
import {
  Select,
  SelectContent,
  SelectValue,
  SelectTrigger,
  SelectItem,
} from "@/components/ui/select";
import * as Form from "@radix-ui/react-form";
import { useTranslations } from "next-intl";
import languageOptions from "./language-options";
import { cn } from "@/lib/utils";
import { templateOptions } from "./template-options";
import { Button } from "@/components/ui/button";
import { HiCheck } from "react-icons/hi";
import useResumeTemplateName from "@/hooks/use-resume-template-name";

const FormTemplate = (props: {
  value: string | undefined;
  onChange: (value: string) => void;
}) => {
  const { value, onChange } = props;
  const t = useTranslations();

  const { getTemplateName } = useResumeTemplateName();

  const onClickTemplate = (template: string) => {
    onChange(template);
  };
  return (
    <Form.Root className="flex w-full flex-col gap-4">
      <Form.Field className="grid" name="email">
        <div className="flex items-baseline justify-between">
          <Form.Label className="text-[15px] font-medium leading-[35px] dark:text-white">
            {t("main.create_resume_ai_dialog.step_select_template")}
          </Form.Label>
        </div>
        <Form.Control asChild>
          <div className="max-h-[500px] overflow-y-auto p-1">
            {/* src="/templates/jpg/azurill.jpg" */}
            <div className="mx-auto grid grid-cols-3 gap-4 md:grid-cols-6">
              {templateOptions.map((template, index) => (
                <div
                  key={index}
                  className={cn(
                    "relative cursor-pointer rounded-sm ring-primary transition-all hover:text-primary hover:ring-2",
                    value === template && "text-primary ring-2"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    onClickTemplate(template);
                  }}
                >
                  <img
                    src={`/templates/jpg/${template}.jpg`}
                    alt={template}
                    className="rounded-sm"
                  />

                  <div className="absolute inset-x-0 bottom-0 h-32 w-full bg-gradient-to-b from-transparent to-background/80">
                    <p
                      className={cn(
                        "absolute inset-x-0 bottom-2 text-center font-bold capitalize"
                      )}
                    >
                      {getTemplateName(template)}
                    </p>
                  </div>

                  <div className="absolute inset-x-0 inset-y-0 z-10 h-full w-full flex-col items-center justify-center opacity-0 transition-all duration-300 hover:opacity-100">
                    <div className="flex h-full flex-col items-center justify-center">
                      {value === template ? (
                        <Button variant="default" className="w-auto">
                          <HiCheck className="size-4" />
                          {t(
                            "main.create_resume_ai_dialog.selected_after_template_text"
                          )}
                        </Button>
                      ) : (
                        <Button variant="default" className="w-auto">
                          {t(
                            "main.create_resume_ai_dialog.selected_template_text"
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Form.Control>
      </Form.Field>
    </Form.Root>
  );
};

export default FormTemplate;
