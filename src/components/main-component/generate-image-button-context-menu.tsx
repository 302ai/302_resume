import {
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import * as Form from "@radix-ui/react-form";
import { update } from "@/lib/db";
import { ResumeSchemaData } from "@/lib/reative-resume/dto/resume";
import useAjaxCoverImage from "@/hooks/use-ajax-cover-image";
import { emitter } from "@/utils/mitt";
import { ReactNode, useState } from "react";
import { MdFilter } from "react-icons/md";

const GenererateImageButtonContextMenu = (props: {
  data: ResumeSchemaData;
  refresh: () => void;
  afterClose: () => void;
  triggerNode: (textNode: ReactNode, onClick: () => void) => ReactNode;
}) => {
  const { data, refresh, afterClose, triggerNode } = props;

  const t = useTranslations();

  const [open, setOpen] = useState(false);

  const { doAjax, loading } = useAjaxCoverImage();

  const onClick = async () => {
    const coverImageUrl = await doAjax(data);
    if (!coverImageUrl) {
      emitter.emit("ToastError", {
        code: -1,
        message: t("main.generate_image_button_error"),
      });
      setOpen(false);
      return;
    }
    update({
      ...data,
      coverUrl: coverImageUrl,
    });
    refresh();
    setOpen(false);
  };

  const onChangeOpen = (flag: boolean) => {
    if (!flag) {
      if (loading) {
        emitter.emit("ToastError", {
          code: -1,
          message: t("main.generate_image_dialog.hint"),
        });
        return;
      }
      afterClose();
    }
    if (flag) {
      onClick();
    }
    setOpen(flag);
  };
  return (
    <>
      <Dialog open={open} onOpenChange={onChangeOpen}>
        <DialogTrigger asChild>
          {triggerNode(
            <>
              <MdFilter size={14} className="mr-2" />
              {t("main.generate_image_button")}
            </>,
            () => {
              onChangeOpen(true);
            }
          )}
        </DialogTrigger>
        <DialogContent onClick={(e) => e.preventDefault()}>
          <DialogTitle>{t("main.generate_image_button")}</DialogTitle>
          <DialogDescription></DialogDescription>
          <Form.Root className="flex w-full flex-col gap-4">
            <Form.Field className="grid" name="email">
              <div className="flex items-baseline justify-between">
                <Form.Label className="text-[15px] font-medium leading-[35px] dark:text-white">
                  {t("main.generate_image_dialog.title")}
                </Form.Label>
              </div>
            </Form.Field>
          </Form.Root>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GenererateImageButtonContextMenu;
