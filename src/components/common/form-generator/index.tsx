import { ErrorMessage } from "@hookform/error-message";

import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import HostRenderer from "../host-renderer";

type FormGeneratorProps = {
  id: string;
  inputType: "select" | "input" | "textarea" | "checkbox";
  name: string;
  errors: FieldErrors<FieldValues>;
  type?: HTMLInputElement["type"];
  options?: { value: string; label: string; id: string }[];
  placeholder?: string;
  label?: string;
  lines?: number;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  watch: (_name: string, _defaultValue: any) => any;
  className?: string;
  autoComplete?: HTMLInputElement["autocomplete"];
};

const FormGenerator = ({
  id,
  inputType,
  options,
  label,
  placeholder,
  register,
  setValue,
  name,
  errors,
  type = "text",
  lines,
  watch,
  className,
  autoComplete,
}: FormGeneratorProps) => {
  const renderErrorMessage = () => (
    <ErrorMessage
      errors={errors}
      name={name}
      render={({ message }) =>
        message !== "Required" && (
          <p className="mt-2 text-red-400">
            <HostRenderer content={message} />
          </p>
        )
      }
    />
  );

  const renderInput = () => (
    <Label
      className="flex flex-col items-center justify-center gap-2 text-center"
      htmlFor={`input-${id}`}
    >
      {label}
      <Input
        id={`input-${id}`}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={cn(
          "bg-themeBlack border-themeGray text-themeTextGray",
          className
        )}
        {...register(name)}
      />
      {renderErrorMessage()}
    </Label>
  );

  const renderSelect = () => (
    <Label htmlFor={`select-${id}`} className="flex flex-col gap-2">
      {label}
      <select
        id={`select-${id}`}
        className="w-full rounded-lg border bg-transparent p-3"
        {...register(name)}
      >
        {options?.map((option) => (
          <option
            value={option.value}
            key={option.id}
            className="dark:bg-muted"
          >
            {option.label}
          </option>
        ))}
      </select>
      {renderErrorMessage()}
    </Label>
  );

  const renderTextarea = () => (
    <Label className="flex flex-col gap-2" htmlFor={`input-${id}`}>
      {label}
      <Textarea
        className=""
        id={`input-${id}`}
        placeholder={placeholder}
        {...register(name)}
        rows={lines}
      />
      {renderErrorMessage()}
    </Label>
  );

  const renderCheckbox = () => {
    const watchCheckbox = watch(name, true);
    return (
      <Label className="flex items-center gap-2" htmlFor={`checkbox-${id}`}>
        <Checkbox
          id={`checkbox-${id}`}
          {...register(name)}
          checked={watchCheckbox}
          onCheckedChange={(checked) => setValue(name, checked)}
        />
        {label}
      </Label>
    );
  };

  switch (inputType) {
    case "input":
      return renderInput();
    case "select":
      return renderSelect();
    case "textarea":
      return renderTextarea();
    case "checkbox":
      return renderCheckbox();
    default:
      return null;
  }
};

export default FormGenerator;
