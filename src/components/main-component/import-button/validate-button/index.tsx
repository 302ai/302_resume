"use client";

import { FileType } from "..";
import { ResumeData } from "@/utils/resume-data-schema";
import PdfValidateButton from "./pdf-validate-button";
import JsonValidateButton from "./json-validate-button";

interface ValidateButtonProps {
  type: FileType;
  file: File | null;
  onValidate: (data: ValidationResult) => void;
  onChangeLoading: (flag: boolean) => void;
}

export type ValidationResult =
  | {
      isValid: false;
      errors: string;
    }
  | {
      isValid: true;
      type: FileType;
      // result: ResumeData | ReactiveResumeV3 | LinkedIn | JsonResume;
      result: ResumeData;
    };

const ValidateButton = ({
  file,
  onValidate,
  type,
  onChangeLoading,
}: ValidateButtonProps) => {
  if (type === "pdf") {
    return (
      <PdfValidateButton
        file={file}
        handleValidate={(data) => onValidate(data)}
        onChangeLoading={(flag) => onChangeLoading(flag)}
      />
    );
  }

  return (
    <JsonValidateButton
      file={file}
      handleValidate={(data) => onValidate(data)}
      onChangeLoading={(flag) => onChangeLoading(flag)}
    />
  );
};

export default ValidateButton;
