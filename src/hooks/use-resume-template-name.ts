import { Template } from "@/components/main-component/create-button-ai.tsx/template-options";
import { useTranslations } from "next-intl";

const useResumeTemplateName = () => {
  const t = useTranslations();

  const nameMap = {
    azurill: t("main.create_resume_ai_dialog.templates.azurill"),
    bronzor: t("main.create_resume_ai_dialog.templates.bronzor"),
    chikorita: t("main.create_resume_ai_dialog.templates.chikorita"),
    ditto: t("main.create_resume_ai_dialog.templates.ditto"),
    gengar: t("main.create_resume_ai_dialog.templates.gengar"),
    glalie: t("main.create_resume_ai_dialog.templates.glalie"),
    kakuna: t("main.create_resume_ai_dialog.templates.kakuna"),
    leafish: t("main.create_resume_ai_dialog.templates.leafish"),
    nosepass: t("main.create_resume_ai_dialog.templates.nosepass"),
    onyx: t("main.create_resume_ai_dialog.templates.onyx"),
    pikachu: t("main.create_resume_ai_dialog.templates.pikachu"),
    rhyhorn: t("main.create_resume_ai_dialog.templates.rhyhorn"),
  };

  const getTemplateName = (template: Template) => {
    return nameMap[template];
  };

  return {
    getTemplateName,
  };
};

export default useResumeTemplateName;
