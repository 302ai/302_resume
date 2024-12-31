import {
  DotsThreeVertical,
  FolderOpen,
  Lock,
  LockOpen,
  TrashSimple,
} from "@phosphor-icons/react";

import dayjs from "dayjs";

import { BaseListItem } from "./base-item";
import { ResumeType } from "@/hooks/reactive-resume/resumes";
import { update, remove } from "@/lib/db";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { emitter } from "@/utils/mitt";
import { ContextMenuSeparator } from "@/components/ui/react-resume-ui/context-menu";
import ConfirmDialog from "../../confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import useSessionDbUpdate from "@/hooks/db-hooks/use-session-db-update";
import TranslationButton from "@/components/main-component/translation-button";
import RenameButton from "@/components/main-component/rename-button";
import GenererateImageButtonContextMenu from "@/components/main-component/generate-image-button-context-menu";

type Props = {
  resume: ResumeType;
  refresh: () => void;
};

export const ResumeListItem = ({ resume, refresh }: Props) => {
  // const navigate = useNavigate();
  // const { open } = useDialog<ResumeDto>("resume");
  // const { open: lockOpen } = useDialog<ResumeDto>("lock");
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const t = useTranslations();

  const { loading: renameLoading, doAsync: doRename } = useSessionDbUpdate();

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

  console.log(open);

  const dropdownMenu = (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild className="aspect-square">
        <Button size="icon" variant="ghost">
          <DotsThreeVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={(event) => {
            event.stopPropagation();
            onOpen();
          }}
        >
          <FolderOpen size={14} className="mr-2" />
          {t("main.item_open")}
        </DropdownMenuItem>
        {/* <DropdownMenuItem
          onClick={(event) => {
            event.stopPropagation();
            onUpdate();
          }}
        >
          <PencilSimple size={14} className="mr-2" />
          {t("main.item_rename")}
        </DropdownMenuItem> */}
        {/* <DropdownMenuItem> */}
        <RenameButton
          resumeData={resume}
          refresh={() => refresh()}
          afterClose={() => setOpen(false)}
          triggerNode={(textNode, onClick) => (
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick();
              }}
            >
              {textNode}
            </DropdownMenuItem>
          )}
        />
        <TranslationButton
          resumeData={resume}
          refresh={() => refresh()}
          afterClose={() => setOpen(false)}
          triggerNode={(textNode, onClick) => (
            <DropdownMenuItem
              className="text-primary"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick();
              }}
            >
              {textNode}
            </DropdownMenuItem>
          )}
        />
        <GenererateImageButtonContextMenu
          data={resume}
          refresh={() => refresh()}
          afterClose={() => setOpen(false)}
          triggerNode={(textNode, onClick) => (
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick();
              }}
            >
              {textNode}
            </DropdownMenuItem>
          )}
        />
        {/* </DropdownMenuItem> */}

        {/* <DropdownMenuItem
          onClick={(event) => {
            event.stopPropagation();
            onDuplicate();
          }}
        >
          <CopySimple size={14} className="mr-2" />
          {t("main.item_duplicate")}
        </DropdownMenuItem> */}
        {resume.locked ? (
          <DropdownMenuItem
            onClick={(event) => {
              event.stopPropagation();
              onLockChange();
            }}
          >
            <LockOpen size={14} className="mr-2" />
            {t("main.item_unlock")}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={(event) => {
              event.stopPropagation();
              onLockChange();
            }}
          >
            <Lock size={14} className="mr-2" />
            {t("main.item_lock")}
          </DropdownMenuItem>
        )}
        <ContextMenuSeparator />
        <DropdownMenuItem className="text-red-500">
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
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <BaseListItem
      className="group border border-solid border-secondary"
      title={resume.title}
      description={`${t("main.last_updated")} ${lastUpdated}`}
      end={dropdownMenu}
      onClick={onOpen}
    />
  );
};
