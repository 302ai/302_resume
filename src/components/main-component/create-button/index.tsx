import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useState } from "react";
import * as Form from "@radix-ui/react-form";
import { Input } from "@/components/ui/input";
import { save } from "@/lib/db";
import dayjs from "dayjs";
import useDefaultResumeData from "@/hooks/use-default-resume-data";

const CreateButton = (props: { afterCreate: () => void }) => {
  const { afterCreate: afterCreateParent } = props;
  const t = useTranslations();

  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");

  const disabled = title.length === 0;

  const { getter: getDefaultResumeData } = useDefaultResumeData();

  const handleCreate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const defaultData = getDefaultResumeData();
    defaultData.title = title;
    defaultData.createdAt = dayjs().valueOf().toString();
    defaultData.updatedAt = dayjs().valueOf().toString();
    await save(defaultData);
    afterCreate();
  };

  const afterCreate = () => {
    setOpen(false);
    afterCreateParent();
  };
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary">{t("main.new_resume_create")}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>{t("main.create_dialog_title")}</DialogTitle>
          <DialogDescription></DialogDescription>
          <Form.Root className="flex w-full flex-col gap-4">
            <Form.Field className="grid" name="email">
              <div className="flex items-baseline justify-between">
                <Form.Label className="text-[15px] font-medium leading-[35px] dark:text-white">
                  {t("main.create_title")}
                </Form.Label>
              </div>
              <Form.Control asChild>
                <Input onChange={(e) => setTitle(e.target.value)}></Input>
              </Form.Control>
            </Form.Field>
            <Form.Field className="flex flex-row justify-center" name="create">
              <Button disabled={disabled} onClick={(e) => handleCreate(e)}>
                {t("main.create_resume")}
              </Button>
            </Form.Field>
          </Form.Root>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateButton;
