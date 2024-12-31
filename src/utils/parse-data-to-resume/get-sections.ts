/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  awardSchema,
  certificationSchema,
  educationSchema,
  experienceSchema,
  languageSchema,
  profileSchema,
  projectSchema,
  publicationSchema,
  referenceSchema,
  ResumeData,
  skillSchema,
  volunteerSchema,
} from "../resume-data-schema";
import { z } from "zod";

type NonNullableType = string | number | boolean | object;

const getKnowData = (unknowData: unknown) => {
  if (typeof unknowData === "object" && unknowData !== null) {
    return unknowData;
  }
  return null;
};

const getKnowDataByKey = (unknowData: unknown, key: string) => {
  let result: NonNullableType | null = null;
  if (
    typeof unknowData === "object" &&
    unknowData !== null &&
    key in unknowData
  ) {
    result = (unknowData as Record<string, unknown>)[key] as NonNullableType;
  }
  return result;
};

const getKnowDataByKeyAndDefaultValue = <T>(
  unknowData: unknown,
  key: string,
  defaultValue: T
) => {
  let result: T = defaultValue;
  if (
    typeof unknowData === "object" &&
    unknowData !== null &&
    Object.hasOwn(unknowData, key)
  ) {
    result = (unknowData as Record<string, unknown>)[key] as T;
  }
  return result;
};

const getSections = (
  defaultSections: ResumeData["sections"],
  unknowData: unknown
) => {
  const result: ResumeData["sections"] = JSON.parse(
    JSON.stringify(defaultSections)
  );

  const knowSections = getKnowData(unknowData);

  if (!knowSections) {
    return result;
  }

  // summary
  const knowSummary = getKnowDataByKey(knowSections, "summary");

  if (knowSummary) {
    const keys: (keyof ResumeData["sections"]["summary"])[] = [
      "name",
      "id",
      "content",
      "columns",
      "separateLinks",
      "visible",
    ];
    keys.forEach((key) => {
      (result.summary as any)[key] = getKnowDataByKeyAndDefaultValue(
        knowSummary,
        key,
        (result.summary as any)[key]
      );
    });
  }

  // awards
  const knowAwards = getKnowDataByKey(knowSections, "awards");

  if (knowAwards) {
    const keys: (keyof ResumeData["sections"]["awards"])[] = [
      "id",
      "name",
      "columns",
      "separateLinks",
      "visible",
    ];
    keys.forEach((key) => {
      (result.awards as any)[key] = getKnowDataByKeyAndDefaultValue(
        knowAwards,
        key,
        (result.awards as any)[key]
      );
    });
    const knowAwardsItems = getKnowDataByKeyAndDefaultValue(
      knowAwards,
      "items",
      []
    );
    if (Array.isArray(knowAwardsItems)) {
      result.awards.items = knowAwardsItems.map((item, index) => {
        const itemResult: z.infer<typeof awardSchema> = {
          id: index.toString(),
          visible: true,
          summary: getKnowDataByKeyAndDefaultValue(item, "summary", ""),
          title: getKnowDataByKeyAndDefaultValue(item, "title", ""),
          awarder: getKnowDataByKeyAndDefaultValue(item, "awarder", ""),
          date: getKnowDataByKeyAndDefaultValue(item, "date", ""),
          url: {
            label: "",
            href: "",
          },
        };
        return itemResult;
      });
    }
  }

  // certifications
  const knowCertifications = getKnowDataByKey(knowSections, "certifications");

  if (knowCertifications) {
    const keys: (keyof ResumeData["sections"]["certifications"])[] = [
      "id",
      "name",
      "columns",
      "separateLinks",
      "visible",
    ];
    keys.forEach((key) => {
      (result.certifications as any)[key] = getKnowDataByKeyAndDefaultValue(
        knowCertifications,
        key,
        (result.certifications as any)[key]
      );
    });
    const knowCertificationsItems = getKnowDataByKeyAndDefaultValue(
      knowCertifications,
      "items",
      []
    );
    if (Array.isArray(knowCertificationsItems)) {
      result.certifications.items = knowCertificationsItems.map(
        (item, index) => {
          const itemResult: z.infer<typeof certificationSchema> = {
            id: index.toString(),
            visible: true,
            summary: getKnowDataByKeyAndDefaultValue(item, "summary", ""),
            issuer: getKnowDataByKeyAndDefaultValue(item, "issuer", ""),
            date: getKnowDataByKeyAndDefaultValue(item, "date", ""),
            url: {
              label: "",
              href: "",
            },
            name: getKnowDataByKeyAndDefaultValue(item, "name", ""),
          };
          return itemResult;
        }
      );
    }
  }

  // education
  const knowEducation = getKnowDataByKey(knowSections, "education");

  if (knowEducation) {
    const keys: (keyof ResumeData["sections"]["education"])[] = [
      "id",
      "name",
      "columns",
      "separateLinks",
      "visible",
    ];
    keys.forEach((key) => {
      (result.education as any)[key] = getKnowDataByKeyAndDefaultValue(
        knowEducation,
        key,
        (result.education as any)[key]
      );
    });
    const knowEducationItems = getKnowDataByKeyAndDefaultValue(
      knowEducation,
      "items",
      []
    );
    if (Array.isArray(knowEducationItems)) {
      result.education.items = knowEducationItems.map((item, index) => {
        const itemResult: z.infer<typeof educationSchema> = {
          id: index.toString(),
          visible: true,
          summary: getKnowDataByKeyAndDefaultValue(item, "summary", ""),
          institution: getKnowDataByKeyAndDefaultValue(item, "institution", ""),
          area: getKnowDataByKeyAndDefaultValue(item, "area", ""),
          studyType: getKnowDataByKeyAndDefaultValue(item, "studyType", ""),
          date: getKnowDataByKeyAndDefaultValue(item, "date", ""),
          url: {
            label: "",
            href: "",
          },
          score: getKnowDataByKeyAndDefaultValue(item, "score", ""),
        };
        return itemResult;
      });
    }
  }

  // experience
  const knowExperience = getKnowDataByKey(knowSections, "experience");

  if (knowExperience) {
    const keys: (keyof ResumeData["sections"]["experience"])[] = [
      "id",
      "name",
      "columns",
      "separateLinks",
      "visible",
    ];
    keys.forEach((key) => {
      (result.experience as any)[key] = getKnowDataByKeyAndDefaultValue(
        knowExperience,
        key,
        (result.experience as any)[key]
      );
    });
    const knowExperienceItems = getKnowDataByKeyAndDefaultValue(
      knowExperience,
      "items",
      []
    );
    if (Array.isArray(knowExperienceItems)) {
      result.experience.items = knowExperienceItems.map((item, index) => {
        const itemResult: z.infer<typeof experienceSchema> = {
          id: index.toString(),
          visible: true,
          summary: getKnowDataByKeyAndDefaultValue(item, "summary", ""),
          company: getKnowDataByKeyAndDefaultValue(item, "company", ""),
          position: getKnowDataByKeyAndDefaultValue(item, "position", ""),
          location: getKnowDataByKeyAndDefaultValue(item, "location", ""),
          date: getKnowDataByKeyAndDefaultValue(item, "date", ""),
          url: {
            label: "",
            href: "",
          },
        };
        return itemResult;
      });
    }
  }

  // volunteer
  const knowVolunteer = getKnowDataByKey(knowSections, "volunteer");

  if (knowVolunteer) {
    const keys: (keyof ResumeData["sections"]["volunteer"])[] = [
      "id",
      "name",
      "columns",
      "separateLinks",
      "visible",
    ];
    keys.forEach((key) => {
      (result.volunteer as any)[key] = getKnowDataByKeyAndDefaultValue(
        knowVolunteer,
        key,
        (result.volunteer as any)[key]
      );
    });
    const knowVolunteerItems = getKnowDataByKeyAndDefaultValue(
      knowVolunteer,
      "items",
      []
    );
    if (Array.isArray(knowVolunteerItems)) {
      result.volunteer.items = knowVolunteerItems.map((item, index) => {
        const itemResult: z.infer<typeof volunteerSchema> = {
          id: index.toString(),
          visible: true,
          summary: getKnowDataByKeyAndDefaultValue(item, "summary", ""),
          organization: getKnowDataByKeyAndDefaultValue(
            item,
            "organization",
            ""
          ),
          position: getKnowDataByKeyAndDefaultValue(item, "position", ""),
          location: getKnowDataByKeyAndDefaultValue(item, "location", ""),
          date: getKnowDataByKeyAndDefaultValue(item, "date", ""),
          url: {
            label: "",
            href: "",
          },
        };
        return itemResult;
      });
    }
  }

  // interests
  const knowInterests = getKnowDataByKey(knowSections, "interests");

  if (knowInterests) {
    const keys: (keyof ResumeData["sections"]["interests"])[] = [
      "id",
      "name",
      "columns",
      "separateLinks",
      "visible",
    ];
    keys.forEach((key) => {
      (result.interests as any)[key] = getKnowDataByKeyAndDefaultValue(
        knowInterests,
        key,
        (result.interests as any)[key]
      );
    });
  }

  // languages
  const knowLanguages = getKnowDataByKey(knowSections, "languages");

  if (knowLanguages) {
    const keys: (keyof ResumeData["sections"]["languages"])[] = [
      "id",
      "name",
      "columns",
      "separateLinks",
      "visible",
    ];
    keys.forEach((key) => {
      (result.languages as any)[key] = getKnowDataByKeyAndDefaultValue(
        knowLanguages,
        key,
        (result.languages as any)[key]
      );
    });

    const knowLanguagesItems = getKnowDataByKeyAndDefaultValue(
      knowLanguages,
      "items",
      []
    );

    if (Array.isArray(knowLanguagesItems)) {
      result.languages.items = knowLanguagesItems.map((item, index) => {
        const itemResult: z.infer<typeof languageSchema> = {
          id: index.toString(),
          visible: true,
          name: getKnowDataByKeyAndDefaultValue(item, "name", ""),
          description: getKnowDataByKeyAndDefaultValue(item, "description", ""),
          level: getKnowDataByKeyAndDefaultValue(item, "level", ""),
        };
        return itemResult;
      });
    }
  }

  // profiles
  const knowProfiles = getKnowDataByKey(knowSections, "profiles");

  if (knowProfiles) {
    const keys: (keyof ResumeData["sections"]["profiles"])[] = [
      "id",
      "name",
      "columns",
      "separateLinks",
      "visible",
    ];
    keys.forEach((key) => {
      (result.profiles as any)[key] = getKnowDataByKeyAndDefaultValue(
        knowProfiles,
        key,
        (result.profiles as any)[key]
      );
    });

    const knowProfilesItems = getKnowDataByKeyAndDefaultValue(
      knowProfiles,
      "items",
      []
    );

    if (Array.isArray(knowProfilesItems)) {
      result.profiles.items = knowProfilesItems.map((item, index) => {
        const itemResult: z.infer<typeof profileSchema> = {
          id: index.toString(),
          visible: true,
          url: {
            label: "",
            href: "",
          },
          network: getKnowDataByKeyAndDefaultValue(item, "network", ""),
          username: getKnowDataByKeyAndDefaultValue(item, "username", ""),
        };
        return itemResult;
      });
    }
  }

  // projects
  const knowProjects = getKnowDataByKey(knowSections, "projects");
  console.log(knowSections, knowProjects);

  if (knowProjects) {
    const keys: (keyof ResumeData["sections"]["projects"])[] = [
      "id",
      "name",
      "columns",
      "separateLinks",
      "visible",
    ];
    keys.forEach((key) => {
      (result.projects as any)[key] = getKnowDataByKeyAndDefaultValue(
        knowProjects,
        key,
        (result.projects as any)[key]
      );
    });
    const knowProjectsItems = getKnowDataByKeyAndDefaultValue(
      knowProjects,
      "items",
      []
    );
    if (Array.isArray(knowProjectsItems)) {
      result.projects.items = knowProjectsItems.map((item, index) => {
        const itemResult: z.infer<typeof projectSchema> = {
          id: index.toString(),
          visible: true,
          summary: getKnowDataByKeyAndDefaultValue(item, "summary", ""),
          name: getKnowDataByKeyAndDefaultValue(item, "name", ""),
          date: getKnowDataByKeyAndDefaultValue(item, "date", ""),
          url: {
            label: "",
            href: "",
          },
          keywords: getKnowDataByKeyAndDefaultValue(item, "keywords", []),
          description: getKnowDataByKeyAndDefaultValue(item, "description", ""),
        };
        return itemResult;
      });
    }
  }

  // publications
  const knowPublications = getKnowDataByKey(knowSections, "publications");

  if (knowPublications) {
    const keys: (keyof ResumeData["sections"]["publications"])[] = [
      "id",
      "name",
      "columns",
      "separateLinks",
      "visible",
    ];
    keys.forEach((key) => {
      (result.publications as any)[key] = getKnowDataByKeyAndDefaultValue(
        knowPublications,
        key,
        (result.publications as any)[key]
      );
    });
    const knowPublicationsItems = getKnowDataByKeyAndDefaultValue(
      knowPublications,
      "items",
      []
    );
    if (Array.isArray(knowPublicationsItems)) {
      result.publications.items = knowPublicationsItems.map((item, index) => {
        const itemResult: z.infer<typeof publicationSchema> = {
          id: index.toString(),
          visible: true,
          summary: getKnowDataByKeyAndDefaultValue(item, "summary", ""),
          name: getKnowDataByKeyAndDefaultValue(item, "name", ""),
          publisher: getKnowDataByKeyAndDefaultValue(item, "publisher", ""),
          date: getKnowDataByKeyAndDefaultValue(item, "date", ""),
          url: {
            label: "",
            href: "",
          },
        };
        return itemResult;
      });
    }
  }

  // references
  const knowReferences = getKnowDataByKey(knowSections, "references");

  if (knowReferences) {
    const keys: (keyof ResumeData["sections"]["references"])[] = [
      "id",
      "name",
      "columns",
      "separateLinks",
      "visible",
    ];
    keys.forEach((key) => {
      (result.references as any)[key] = getKnowDataByKeyAndDefaultValue(
        knowReferences,
        key,
        (result.references as any)[key]
      );
    });

    const knowReferencesItems = getKnowDataByKeyAndDefaultValue(
      knowReferences,
      "items",
      []
    );

    if (Array.isArray(knowReferencesItems)) {
      result.references.items = knowReferencesItems.map((item, index) => {
        const itemResult: z.infer<typeof referenceSchema> = {
          id: index.toString(),
          visible: true,
          name: getKnowDataByKeyAndDefaultValue(item, "name", ""),
          summary: getKnowDataByKeyAndDefaultValue(item, "summary", ""),
          description: getKnowDataByKeyAndDefaultValue(item, "description", ""),
          url: {
            label: "",
            href: "",
          },
        };
        return itemResult;
      });
    }
  }

  // skills
  const knowSkills = getKnowDataByKey(knowSections, "skills");

  if (knowSkills) {
    const keys: (keyof ResumeData["sections"]["skills"])[] = [
      "id",
      "name",
      "columns",
      "separateLinks",
      "visible",
    ];
    keys.forEach((key) => {
      (result.skills as any)[key] = getKnowDataByKeyAndDefaultValue(
        knowSkills,
        key,
        (result.skills as any)[key]
      );
    });
    const knowSkillsItems = getKnowDataByKeyAndDefaultValue(
      knowSkills,
      "items",
      []
    );
    if (Array.isArray(knowSkillsItems)) {
      result.skills.items = knowSkillsItems.map((item, index) => {
        const itemResult: z.infer<typeof skillSchema> = {
          id: index.toString(),
          visible: true,
          name: getKnowDataByKeyAndDefaultValue(item, "name", ""),
          keywords: [],
          level: getKnowDataByKeyAndDefaultValue(item, "level", ""),
          description: getKnowDataByKeyAndDefaultValue(item, "description", ""),
        };
        itemResult.keywords = getKnowDataByKeyAndDefaultValue(
          item,
          "keywords",
          []
        );
        if (Array.isArray(itemResult.keywords)) {
          itemResult.keywords = itemResult.keywords.filter(
            (keywordItem) => typeof keywordItem === "string"
          );
        }
        return itemResult;
      });
    }
  }

  return result;
};

export default getSections;
