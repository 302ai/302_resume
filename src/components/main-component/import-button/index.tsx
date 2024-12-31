import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import * as Form from "@radix-ui/react-form";
import { Input } from "@/components/ui/input";
import { save } from "@/lib/db";
import dayjs from "dayjs";
import { CiImport } from "react-icons/ci";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ValidateButton, { ValidationResult } from "./validate-button";
import { emitter } from "@/utils/mitt";
import useDefaultResumeData from "@/hooks/use-default-resume-data";

export type FileType = "json" | "pdf";

const getFileAccept = (type: FileType): string => {
  if (type === "json") return ".json";
  if (type === "pdf") return ".pdf";
  return "";
};

const ImportButton = (props: { afterImport: () => void }) => {
  const { afterImport } = props;
  const t = useTranslations();

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const validateLoading = useRef(false);

  const [validatedData, setValidatedData] = useState<ValidationResult | null>(
    null
  );

  const [fileType, setFileType] = useState<FileType>("pdf");

  const inputRef = useRef<HTMLInputElement>(null);

  const { getter: getDefaultResumeData } = useDefaultResumeData();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setValidatedData(null);
    }
  };

  const handleImport = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const importedData = getDefaultResumeData();
    if (!file) return;
    if (!(validatedData && validatedData.isValid) || !file) {
      return;
    }
    importedData.title = file.name.split(".")[0]; // 获取文件名，不需要后缀名
    importedData.data = validatedData.result;

    setLoading(true);
    try {
      const defaultData = getDefaultResumeData();
      const mergedData = {
        ...defaultData,
        ...importedData,
        createdAt: dayjs().valueOf().toString(),
        updatedAt: dayjs().valueOf().toString(),
      };
      mergedData.data.sections.awards.name =
        defaultData.data.sections.awards.name;
      mergedData.data.sections.skills.name =
        defaultData.data.sections.skills.name;
      mergedData.data.sections.summary.name =
        defaultData.data.sections.summary.name;
      mergedData.data.sections.profiles.name =
        defaultData.data.sections.profiles.name;
      mergedData.data.sections.projects.name =
        defaultData.data.sections.projects.name;
      mergedData.data.sections.education.name =
        defaultData.data.sections.education.name;
      mergedData.data.sections.interests.name =
        defaultData.data.sections.interests.name;
      mergedData.data.sections.languages.name =
        defaultData.data.sections.languages.name;
      mergedData.data.sections.volunteer.name =
        defaultData.data.sections.volunteer.name;
      mergedData.data.sections.experience.name =
        defaultData.data.sections.experience.name;
      mergedData.data.sections.references.name =
        defaultData.data.sections.references.name;
      mergedData.data.sections.publications.name =
        defaultData.data.sections.publications.name;
      mergedData.data.sections.certifications.name =
        defaultData.data.sections.certifications.name;

      console.log(mergedData.data);

      await save(mergedData);
      afterImport();
    } catch (error) {
      console.error("Import failed:", error);
    }
    setOpen(false);
    setLoading(false);
  };

  const handleValidate = (data: ValidationResult) => {
    setValidatedData(data);
  };

  const onOpenChange = (flag: boolean) => {
    if (flag === false && validateLoading.current === true) {
      emitter.emit("ToastError", {
        code: -1,
        message: t("main.import_dialog.error_hint_loading"),
      });
      return;
    }
    if (flag) {
      setValidatedData(null);
      setFile(null);
    }
    setOpen(flag);
  };

  return (
    <Dialog open={open} onOpenChange={(flag) => onOpenChange(flag)}>
      <DialogTrigger asChild>
        <Button variant="secondary">{t("main.new_resume_import")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="flex items-center gap-2">
          <CiImport />
          <p>{t("main.import_dialog.title")}</p>
        </DialogTitle>
        <DialogDescription className="text-[15px] font-medium dark:text-white">
          {t("main.import_dialog.sub_title")}
        </DialogDescription>
        <Form.Root className="flex w-full flex-col gap-4">
          <Form.Field className="grid" name="file">
            <div className="flex items-baseline justify-between">
              <Form.Label className="text-[15px] font-medium leading-[35px] dark:text-white">
                {t("main.import_dialog.file_type")}
              </Form.Label>
            </div>
            <div>
              <Select
                value={fileType}
                onValueChange={(value) => {
                  setFileType(value as FileType);
                  setValidatedData(null);
                  setFile(null);
                }}
              >
                <SelectTrigger>
                  <SelectValue
                    className="hover:border-primary dark:bg-white"
                    placeholder={t("main.import_dialog.file_type")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Form.Field>
          <Form.Field className="grid" name="file">
            <div className="flex items-baseline justify-between">
              <Form.Label className="text-[15px] font-medium leading-[35px] dark:text-white">
                {t("main.import_dialog.file_item")}
              </Form.Label>
            </div>
            <Form.Control asChild>
              <div
                className="flex h-9 w-full items-center rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground hover:cursor-pointer hover:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => inputRef.current && inputRef.current.click()}
              >
                {file
                  ? file.name
                  : `${t("main.import_dialog.file_item_placeholder")} .${fileType}`}
              </div>
            </Form.Control>
          </Form.Field>
          <Form.Field className="grid" name="validate">
            <ValidateButton
              file={file}
              onValidate={handleValidate}
              type={fileType}
              onChangeLoading={(flag) => (validateLoading.current = flag)}
            />
          </Form.Field>
          <Form.Field className="grid" name="import">
            <Button
              disabled={!validatedData || !validatedData.isValid || loading}
              onClick={handleImport}
            >
              {t("main.import_dialog.action")}
            </Button>
          </Form.Field>
        </Form.Root>
        <Input
          ref={inputRef}
          className="hidden"
          type="file"
          accept={getFileAccept(fileType)}
          onChange={handleFileChange}
          placeholder={`${t("main.import_dialog.file_item_placeholder")} .${fileType}`}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImportButton;
