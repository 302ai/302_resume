import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";
import { save } from "@/lib/db";
import dayjs from "dayjs";
import { ResumeSchemaData } from "@/lib/reative-resume/dto/resume";
import FormLanguage from "../create-button-ai.tsx/form-language";
import useAjaxLanguageTranslation from "@/hooks/use-ajax-language-translation";
import { createScopedLogger } from "@/utils";
import { emitter } from "@/utils/mitt";
import { resumeDataSchema } from "@/utils/resume-data-schema";
import useDefaultResumeData from "@/hooks/use-default-resume-data";
import { Loader2 } from "lucide-react";
import { MdOutlineTranslate } from "react-icons/md";

const TranslationButton = (props: {
  resumeData: ResumeSchemaData;
  refresh: () => void;
  afterClose: () => void;
  triggerNode: (textNode: ReactNode, onClick: () => void) => ReactNode;
}) => {
  const { refresh, resumeData, afterClose: afterClose, triggerNode } = props;
  const t = useTranslations();

  const [open, setOpen] = useState(false);

  const [language, setLanguage] = useState<string | undefined>(undefined);

  const { loading, doAjax } = useAjaxLanguageTranslation();

  const { getter } = useDefaultResumeData();

  const logger = createScopedLogger("translate-button");

  const disabled = language === undefined;

  const onClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!language) {
      return;
    }
    const resultData = getter();
    resultData.id = "";
    resultData.title = resumeData.title + " " + t("main.copy_resume_title");
    resultData.slug = resumeData.slug;
    resultData.updatedAt = dayjs().valueOf().toString();
    const result = await doAjax(JSON.stringify(resumeData.data), language);
    if (!result) {
      emitter.emit("ToastError", {
        code: -1,
        message: t("main.translate_dialog.error_message_translate"),
      });
      return;
    }
    try {
      const object = resumeDataSchema.parse(JSON.parse(result));
      resultData.data = object;
    } catch (error) {
      logger.error(error);
      emitter.emit("ToastError", {
        code: -1,
        message: t("main.translate_dialog.error_message_translate"),
      });
      return;
    }
    await save(resultData);
    emitter.emit("ToastSuccess", {
      code: 0,
      message: t("main.translate_dialog.success_message_translate"),
    });
    setOpen(false);
    refresh();
  };

  const onChangeOpen = (flag: boolean) => {
    if (!flag) {
      afterClose();
      if (loading) {
        emitter.emit("ToastError", {
          code: -1,
          message: t("main.translate_dialog.do_not_close_dialog"),
        });
        return;
      }
    }
    setLanguage(undefined);
    setOpen(flag);
  };
  return (
    <>
      <Dialog open={open} onOpenChange={onChangeOpen}>
        <DialogTrigger asChild>
          {triggerNode(
            <>
              <MdOutlineTranslate size={14} className="mr-2" />
              {t("main.item_translate")}
            </>,
            () => {
              onChangeOpen(true);
            }
          )}
        </DialogTrigger>
        <DialogContent onClick={(e) => e.preventDefault()}>
          <DialogTitle>{t("main.translate_dialog.title")}</DialogTitle>
          <DialogDescription>
            {t("main.translate_dialog.description")}
          </DialogDescription>
          <FormLanguage
            value={language}
            onChange={(value) => setLanguage(value)}
          />
          <Button disabled={disabled || loading} onClick={(e) => onClick(e)}>
            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
            {t("main.translate_dialog.submit_button")}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TranslationButton;
