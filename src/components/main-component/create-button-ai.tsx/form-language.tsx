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

const FormLanguage = (props: {
  value: string | undefined;
  onChange: (value: string) => void;
}) => {
  const { value, onChange } = props;
  const t = useTranslations();
  return (
    <>
      <Form.Root className="flex w-full flex-col gap-4">
        <Form.Field className="grid" name="none">
          <div className="flex items-baseline justify-between">
            <Form.Label className="text-[15px] font-medium leading-[35px] dark:text-white">
              {t("main.create_resume_ai_dialog.step_select_language")}
            </Form.Label>
          </div>
          <Select
            value={value}
            onValueChange={(value) => {
              onChange(value);
            }}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={t(
                  "main.create_resume_ai_dialog.step_select_language"
                )}
              />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map((item, index) => (
                <SelectItem key={index} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Form.Field>
      </Form.Root>
    </>
  );
};

export default FormLanguage;
