import { Button } from "@/components/ui/button";
import useAjaxCoverImage from "@/hooks/use-ajax-cover-image";
import { update } from "@/lib/db";
import { ResumeSchemaData } from "@/lib/reative-resume/dto/resume";
import { emitter } from "@/utils/mitt";
import { useTranslations } from "next-intl";
import { MdAutorenew } from "react-icons/md";
const GenererateImageButton = (props: {
  data: ResumeSchemaData;
  refresh: () => void;
}) => {
  const { data, refresh } = props;

  const t = useTranslations();

  const { doAjax, loading } = useAjaxCoverImage();

  const onClick = async () => {
    const coverImageUrl = await doAjax(data);
    if (!coverImageUrl) {
      emitter.emit("ToastError", {
        code: -1,
        message: t("main.generate_image_button_error"),
      });
      return;
    }
    update({
      ...data,
      coverUrl: coverImageUrl,
    });
    refresh();
  };
  return (
    <Button
      className="size-8 rounded-full"
      disabled={loading}
      variant="secondary"
      title={t("main.generate_image_button")}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
    >
      <MdAutorenew size={3} className={loading ? "animate-spin" : ""} />
    </Button>
  );
};

export default GenererateImageButton;
