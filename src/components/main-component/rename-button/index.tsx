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
import * as Form from "@radix-ui/react-form";
import { Input } from "@/components/ui/input";
import { update } from "@/lib/db";
import dayjs from "dayjs";
import { PencilSimple } from "@phosphor-icons/react";
import { ResumeSchemaData } from "@/lib/reative-resume/dto/resume";

const RenameButton = (props: {
  resumeData: ResumeSchemaData;
  refresh: () => void;
  afterClose: () => void;
  triggerNode: (textNode: ReactNode, onClick: () => void) => ReactNode;
}) => {
  const { refresh, resumeData, afterClose: afterClose, triggerNode } = props;
  const t = useTranslations();

  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");

  const disabled = title.length === 0 || slug.length === 0;

  const onClickUpdate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const defaultData = resumeData;
    defaultData.title = title;
    defaultData.slug = slug;
    defaultData.updatedAt = dayjs().valueOf().toString();
    await update(defaultData);
    setOpen(false);
    refresh();
  };

  const onChangeOpen = (flag: boolean) => {
    if (!flag) {
      afterClose();
    }
    setTitle(resumeData.title);
    setSlug(resumeData.slug);
    setOpen(flag);
  };
  return (
    <>
      <Dialog open={open} onOpenChange={onChangeOpen}>
        <DialogTrigger asChild>
          {triggerNode(
            <>
              <PencilSimple size={14} className="mr-2" />
              {t("main.item_rename")}
            </>,
            () => {
              onChangeOpen(true);
            }
          )}
        </DialogTrigger>
        <DialogContent onClick={(e) => e.preventDefault()}>
          <DialogTitle>{t("main.item_rename")}</DialogTitle>
          <DialogDescription></DialogDescription>
          <Form.Root className="flex w-full flex-col gap-4">
            <Form.Field className="grid" name="email">
              <div className="flex items-baseline justify-between">
                <Form.Label className="text-[15px] font-medium leading-[35px] dark:text-white">
                  {t("main.create_title")}
                </Form.Label>
              </div>
              <Form.Control asChild>
                <Input
                  value={title}
                  key={open + ""}
                  onChange={(e) => setTitle(e.target.value)}
                ></Input>
              </Form.Control>
            </Form.Field>
            <Form.Field className="grid" name="question">
              <div className="flex items-baseline justify-between">
                <Form.Label className="text-[15px] font-medium leading-[35px] dark:text-white">
                  {t("main.create_slug")}
                </Form.Label>
              </div>
              <Form.Control asChild>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                ></Input>
              </Form.Control>
            </Form.Field>
            <Form.Field className="grid" name="create">
              <Button disabled={disabled} onClick={(e) => onClickUpdate(e)}>
                {t("main.item_rename")}
              </Button>
            </Form.Field>
          </Form.Root>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RenameButton;
