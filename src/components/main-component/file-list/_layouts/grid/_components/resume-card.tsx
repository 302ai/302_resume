import { FolderOpen, Lock, LockOpen, TrashSimple } from "@phosphor-icons/react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/react-resume-ui/context-menu";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";

import { BaseCard } from "./base-card";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ResumeType } from "@/hooks/reactive-resume/resumes";
import { useRouter } from "@/i18n/routing";
import ConfirmDialog from "../../confirm-dialog";
import { remove, update } from "@/lib/db";
import { useState } from "react";
import { emitter } from "@/utils/mitt";
import { FaFileAlt } from "react-icons/fa";
// import GenererateImageButton from "../../generate-image-button";
import TranslationButton from "@/components/main-component/translation-button";
import RenameButton from "@/components/main-component/rename-button";
import GenererateImageButtonContextMenu from "@/components/main-component/generate-image-button-context-menu";

type Props = {
  resume: ResumeType;
  refresh: () => void;
};

export const ResumeCard = ({ resume, refresh }: Props) => {
  // const navigate = useNavigate();
  // const { open } = useDialog<ResumeDto>("resume");
  // const { open: lockOpen } = useDialog<ResumeDto>("lock");
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const t = useTranslations();

  const lastUpdated = dayjs(Number(resume.updatedAt)).format(
    "YYYY-MM-DD HH:mm:ss"
  );

  const onOpen = () => {
    if (resume.locked) {
      emitter.emit("ToastError", {
        code: 403,
        message: t("main.item_hint_locked"),
      });
      return;
    }
    router.replace(`/builder/${resume.id}`);
  };

  const onUpdate = () => {
    // open("update", { id: "resume", item: resume });
  };

  const onDuplicate = () => {
    // open("duplicate", { id: "resume", item: resume });
  };

  const onExport = () => {
    // open("duplicate", { id: "resume", item: resume });
  };

  const onLockChange = async () => {
    // lockOpen(resume.locked ? "update" : "create", { id: "lock", item: resume });
    await update({
      ...resume,
      locked: !resume.locked,
    });
    refresh();
  };

  const onDelete = async () => {
    await remove(resume.id);
    refresh();
  };

  return (
    <ContextMenu onOpenChange={setOpen}>
      <ContextMenuTrigger>
        <BaseCard className="space-y-0" onClick={onOpen}>
          <AnimatePresence>
            {resume.locked ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-background/75 backdrop-blur-sm"
              >
                <Lock size={42} />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-background/75 text-primary backdrop-blur-sm"
              >
                {resume.coverUrl ? (
                  <div
                    className="flex h-full w-full flex-1 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${resume.coverUrl})`,
                    }}
                  ></div>
                ) : (
                  <FaFileAlt size={42} />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className={cn(
              "absolute inset-x-0 bottom-0 z-10 flex flex-row justify-end space-y-0.5 p-4 pt-12",
              "bg-gradient-to-t from-background/80 to-transparent"
            )}
          >
            <div className="line-clamp-2 flex flex-1 flex-col">
              <h4 className="line-clamp-1 font-medium">{resume.title}</h4>
              <p className="line-clamp-1 text-xs opacity-75">
                {`${t("main.last_updated")} ${lastUpdated}`}
              </p>
            </div>
            {/* <div
              className="flex flex-col justify-end"
              onClick={(e) => e.preventDefault()}
            >
              <GenererateImageButton data={resume} refresh={() => refresh()} />
            </div> */}
          </div>
        </BaseCard>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem onClick={onOpen}>
          <FolderOpen size={14} className="mr-2" />
          {t("main.item_open")}
        </ContextMenuItem>
        <RenameButton
          resumeData={resume}
          refresh={() => refresh()}
          afterClose={() => setOpen(false)}
          triggerNode={(textNode, onClick) => (
            <ContextMenuItem
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick();
              }}
            >
              {textNode}
            </ContextMenuItem>
          )}
        />
        <TranslationButton
          resumeData={resume}
          refresh={() => refresh()}
          afterClose={() => setOpen(false)}
          triggerNode={(textNode, onClick) => (
            <ContextMenuItem
              className="text-primary"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick();
              }}
            >
              {textNode}
            </ContextMenuItem>
          )}
        />
        <GenererateImageButtonContextMenu
          data={resume}
          refresh={() => refresh()}
          afterClose={() => setOpen(false)}
          triggerNode={(textNode, onClick) => (
            <ContextMenuItem
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick();
              }}
            >
              {textNode}
            </ContextMenuItem>
          )}
        />
        {/* <ContextMenuItem onClick={onUpdate}>
          <PencilSimple size={14} className="mr-2" />
          {t("main.item_rename")}
        </ContextMenuItem>
        <ContextMenuItem onClick={onExport}>
          <CopySimple size={14} className="mr-2" />
          {t("main.item_duplicate")}
        </ContextMenuItem>
        <ContextMenuItem onClick={onDuplicate}>
          <CopySimple size={14} className="mr-2" />
          {t("main.item_export")}
        </ContextMenuItem> */}
        {resume.locked ? (
          <ContextMenuItem onClick={onLockChange}>
            <LockOpen size={14} className="mr-2" />
            {t("main.item_unlock")}
          </ContextMenuItem>
        ) : (
          <ContextMenuItem onClick={onLockChange}>
            <Lock size={14} className="mr-2" />
            {t("main.item_lock")}
          </ContextMenuItem>
        )}
        <ContextMenuSeparator />
        <ContextMenuItem className="text-red-500">
          <div className="w-full" onClick={(e) => e.preventDefault()}>
            <ConfirmDialog
              title={t("main.item_hint")}
              description={t("main.item_delete_description")}
              action={t("main.item_action")}
              cancel={t("main.item_cancel")}
              onConfirm={onDelete}
            >
              <>
                <TrashSimple size={14} className="mr-2" />
                {t("main.item_delete")}
              </>
            </ConfirmDialog>
          </div>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
