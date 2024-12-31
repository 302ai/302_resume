import { ResumeType } from "@/hooks/use-ajax-resumes";
import { store } from "@/stores";
import { languageAtom } from "@/stores";
import { useTranslations } from "next-intl";

const defaultData: ResumeType = {
  id: "",
  title: "",
  slug: "",
  data: {
    basics: {
      url: {
        href: "",
        label: "",
      },
      name: "",
      email: "",
      phone: "",
      picture: {
        url: "",
        size: 64,
        effects: {
          border: false,
          hidden: false,
          grayscale: false,
        },
        aspectRatio: 0.75,
        borderRadius: 0,
      },
      headline: "",
      location: "",
      customFields: [],
    },
    metadata: {
      css: {
        value:
          ".section {\n\toutline: 1px solid #000;\n\toutline-offset: 4px;\n}",
        visible: false,
      },
      page: {
        format: "a4",
        margin: 18,
        options: {
          breakLine: true,
          pageNumbers: true,
        },
      },
      notes: "",
      theme: {
        text: "#000000",
        primary: "#dc2626",
        background: "#ffffff",
      },
      layout: [
        [
          [
            "profiles",
            "summary",
            "experience",
            "education",
            "projects",
            "volunteer",
            "references",
          ],
          [
            "skills",
            "interests",
            "certifications",
            "awards",
            "publications",
            "languages",
          ],
        ],
      ],
      template: "azurill",
      typography: {
        font: {
          size: 14,
          family: "IBM Plex Serif",
          subset: "latin",
          variants: ["regular", "italic", "600"],
        },
        hideIcons: false,
        lineHeight: 1.5,
        underlineLinks: true,
      },
    },
    sections: {
      awards: {
        id: "awards",
        name: "Awards",
        items: [],
        columns: 1,
        visible: true,
        separateLinks: true,
      },
      custom: {},
      skills: {
        id: "skills",
        name: "Skills",
        items: [],
        columns: 1,
        visible: true,
        separateLinks: true,
      },
      summary: {
        id: "summary",
        name: "Summary",
        columns: 1,
        content: "<p></p>",
        visible: true,
        separateLinks: true,
      },
      profiles: {
        id: "profiles",
        name: "Profiles",
        items: [],
        columns: 1,
        visible: true,
        separateLinks: true,
      },
      projects: {
        id: "projects",
        name: "Projects",
        items: [],
        columns: 1,
        visible: true,
        separateLinks: true,
      },
      education: {
        id: "education",
        name: "Education",
        items: [],
        columns: 1,
        visible: true,
        separateLinks: true,
      },
      interests: {
        id: "interests",
        name: "Interests",
        items: [],
        columns: 1,
        visible: true,
        separateLinks: true,
      },
      languages: {
        id: "languages",
        name: "Languages",
        items: [],
        columns: 1,
        visible: true,
        separateLinks: true,
      },
      volunteer: {
        id: "volunteer",
        name: "Volunteering",
        items: [],
        columns: 1,
        visible: true,
        separateLinks: true,
      },
      experience: {
        id: "experience",
        name: "Experience",
        items: [],
        columns: 1,
        visible: true,
        separateLinks: true,
      },
      references: {
        id: "references",
        name: "References",
        items: [],
        columns: 1,
        visible: true,
        separateLinks: true,
      },
      publications: {
        id: "publications",
        name: "Publications",
        items: [],
        columns: 1,
        visible: true,
        separateLinks: true,
      },
      certifications: {
        id: "certifications",
        name: "Certifications",
        items: [],
        columns: 1,
        visible: true,
        separateLinks: true,
      },
    },
  },
  visibility: "private",
  locked: false,
  userId: "",
  createdAt: "",
  updatedAt: "",
};

const useDefaultResumeData = () => {
  const uiLanguage = store.get(languageAtom);

  const t = useTranslations();

  const getter = () => {
    const result: ResumeType = JSON.parse(JSON.stringify(defaultData));
    if (uiLanguage === "en") {
      return result;
    }
    result.data.sections.awards.name = t("main.default_resume_data.award");
    result.data.sections.skills.name = t("main.default_resume_data.skills");
    result.data.sections.summary.name = t("main.default_resume_data.summary");
    result.data.sections.profiles.name = t("main.default_resume_data.profiles");
    result.data.sections.projects.name = t("main.default_resume_data.projects");
    result.data.sections.education.name = t(
      "main.default_resume_data.education"
    );
    result.data.sections.interests.name = t(
      "main.default_resume_data.interests"
    );
    result.data.sections.languages.name = t(
      "main.default_resume_data.languages"
    );
    result.data.sections.volunteer.name = t(
      "main.default_resume_data.volunteer"
    );
    result.data.sections.experience.name = t(
      "main.default_resume_data.experience"
    );
    result.data.sections.references.name = t(
      "main.default_resume_data.references"
    );
    result.data.sections.publications.name = t(
      "main.default_resume_data.publications"
    );
    result.data.sections.certifications.name = t(
      "main.default_resume_data.certifications"
    );

    return result;
  };

  return {
    getter,
  };
};
export default useDefaultResumeData;
