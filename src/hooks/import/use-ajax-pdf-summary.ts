import { logger } from "@/utils";
import useAsyncFunction from "../use-async-function";
import { apiKy } from "@/api";
import { z } from "zod";
import { appConfigAtom, store } from "@/stores";
import { env } from "@/env";

const apiUrl = "v1/chat/completions";

const resSchema = z.object({
  // choices[0].message.content
  choices: z.array(
    z.object({
      message: z.object({
        content: z.string(),
      }),
    })
  ),
});

const prompt = `
 -Fill in the corresponding section of the personal information column with the text content. When filling in personal information with extracted text content, it is necessary to combine the subheadings of each section and the content under each subheading, and accurately fill in the corresponding subheading position in the personal information. Do not add icons.
-If there is text content in the personal information column that does not have a corresponding position to fill in, such as age, gender, WeChat ID, then you need to fill in these text contents in the custom section, that is, the position of customFields, where the name and corresponding value need to be filled in correctly.
-The extracted text content cannot be modified, added or deleted without authorization, and the personal information filled in must be consistent with the extracted text content. Taking work experience as an example, if there are subheadings such as work performance and personal contributions in the extracted content, you need to fill in these contents in the summary of work experience and put them together with the work content. The rest of the parts are the same.
-Ensure the integrity of the extracted content. Taking the project experience as an example, the extracted text content is:
Project Introduction: The company's self-developed core project, which has three major operational partnerships with China Mobile, China Unicom, and China Telecom, operates communication product businesses. The project supports 50 functions+
Business front-end functionality. Classify business capabilities: select beautiful accounts, data packages, broadband, data/phone recharge, video membership. Main function: It can be customized according to business needs
Request to create standardized and personalized landing pages, which use TERR data structure and code traversal to combine various components to form a complete landing page, with more than ten different industries built-in
The template of the service integrates business capabilities into a complete functional system, producing corresponding functional effect pages for different businesses, and allowing for high flexibility in creating personalized pages
Landing page, improving the work efficiency of advertising professionals, compatible with mobile and PC devices. The landing page is launched to: Tiktok, Toutiao, Kwai and other live platforms.
Fill in the description in the project experience as follows:
The company's self-developed core project, which has three major operational cooperation relationships with China Mobile, China Unicom, and China Telecom, operates communication product businesses. The project supports 50 functions+
Business front-end functionality. Classify business capabilities: select beautiful accounts, data packages, broadband, data/phone recharge, video membership. Main function: It can be customized according to business needs
Request to create standardized and personalized landing pages, which use TERR data structure and code traversal to combine various components to form a complete landing page, with more than ten different industries built-in
The template of the service integrates business capabilities into a complete functional system, producing corresponding functional effect pages for different businesses, and allowing for high flexibility in creating personalized pages
Landing page, improving the work efficiency of advertising professionals, compatible with mobile and PC devices. The landing page is launched to: Tiktok, Toutiao, Kwai and other live platforms.
-It is necessary to check whether the text content meets the required description of the filled position. If it does not match, the text content should be filled in the appropriate position.
Taking educational experience as an example: parsed text content:
Educational experience: During my school years, I systematically studied theories and practices related to art history and education, and developed solid abilities in art analysis and project planning. The main courses include Chinese and foreign art history, art introduction, paleography and ancient Chinese, etc., to deepen the understanding of the interaction between culture and art. Good at photography and play badminton.
Personal information after filling in:
Educational experience: During my school years, I systematically studied theories and practices related to art history and education, and developed solid abilities in art analysis and project planning. The main courses include Chinese and foreign art history, art introduction, paleography and ancient Chinese, etc., to deepen the understanding of the interaction between culture and art.
Specialty: good at photography and play badminton.
Output JSON in this format
interface Resume {
basics: {
name: string;
headline: string;
email: string;
phone: string;
location: string;
url: {
label: string;
href: string;
};
customFields: Array<{
id: string;
icon: string;
name: string;
value: string;
}>;
picture: {
url: string;
size: number;
aspectRatio: number;
borderRadius: number;
effects: {
hidden: boolean;
border: boolean;
grayscale: boolean;
};
};
};
sections: {
summary: {
name: "Summary";
columns: number;
separateLinks: boolean;
visible: boolean;
id: "summary";
content: string;
};
awards: Section<AwardItem, "Awards">;
certifications: Section<CertificationItem, "Certifications">;
education: Section<EducationItem, "Education">;
experience: Section<ExperienceItem, "Experience">;
volunteer: Section<VolunteerItem, "Volunteering">;
interests: Section<InterestItem, "Interests">;
languages: Section<LanguageItem, "Languages">;
profiles: Section<ProfileItem, "Profiles">;
projects: Section<ProjectItem, "Projects">;
publications: Section<PublicationItem, "Publications">;
references: Section<ReferenceItem, "References">;
skills: Section<SkillItem, "Skills">;
custom: Record<string, unknown>;
};
metadata: {
template: "azurill" | "bronzor" | "chikorita" | "ditto" | "gengar" | "glalie" | "kakuna" | "leafish" | "nosepass" | "onyx" | "pikachu" | "rhyhorn";
// Required, 3 levels: page, side(left or right), item(section name), all non-empty section items must be used
// Currently only one page to display
// eg. [[["profiles","summary","experience","education","projects","volunteer","references"],["interests","certifications","awards","languages"]]]
layout: [[Keyof<Resume.sections>, Keyof<Resume.sections>][]];
css: {
value: string;
visible: boolean;
};
page: {
margin: number;
format: "a4" | "letter";
options: {
breakLine: boolean;
pageNumbers: boolean;
};
};
theme: {
background: string;
text: string;
primary: string;
};
typography: {
font: {
family: string;
subset: string;
variants: string[];
size: number;
};
lineHeight: number;
hideIcons: boolean;
underlineLinks: boolean;
};
notes: string;
};
}
interface Section<T, N extends string> {
name: N;
columns: number;
separateLinks: boolean;
visible: boolean;
id: string;
items: T[];
}
interface BaseItem {
id: string;
visible: boolean;
}
interface AwardItem extends BaseItem {
title: string;
awarder: string;
date: string;
summary: string;
url: {
label: string;
href: string;
};
}
interface CertificationItem extends BaseItem {
name: string;
issuer: string;
date: string;
summary: string;
url: {
label: string;
href: string;
};
}
interface EducationItem extends BaseItem {
institution: string;
studyType: string;
area: string;
score: string;
date: string;
summary: string;
url: {
label: string;
href: string;
};
}
interface ExperienceItem extends BaseItem {
company: string;
position: string;
location: string;
date: string;
summary: string;
url: {
label: string;
href: string;
};
}
interface VolunteerItem extends BaseItem {
organization: string;
position: string;
location: string;
date: string;
summary: string;
url: {
label: string;
href: string;
};
}
interface InterestItem extends BaseItem {
name: string;
keywords: string[];
}
interface LanguageItem extends BaseItem {
name: string;
description: string;
level: number;
}
interface ProfileItem extends BaseItem {
network: string;
username: string;
icon: string;
url: {
label: string;
href: string;
};
}
interface ProjectItem extends BaseItem {
name: string;
description: string;
date: string;
summary: string;
keywords: string[];
url: {
label: string;
href: string;
};
}
interface PublicationItem extends BaseItem {
name: string;
publisher: string;
date: string;
summary: string;
url: {
label: string;
href: string;
};
}
interface ReferenceItem extends BaseItem {
name: string;
description: string;
summary: string;
url: {
label: string;
href: string;
};
}
interface SkillItem extends BaseItem {
name: string;
description: string;
level: number;
keywords: string[];
}
You must return the results in JSON format, do not add any other content, and do not wrap them in code blocks with 'JSON' and ''.
`;

const action = async (markdownStr: string, modelName: string) => {
  let result: string | null = null;

  try {
    const response = await apiKy
      .post(apiUrl, {
        json: {
          model: modelName,
          "X-No-Cache": true,
          "X-Wait-For-Selector": "#content",
          messages: [
            { role: "system", content: prompt },
            { role: "user", content: markdownStr },
          ],
        },
      })
      .json();

    const data = resSchema.parse(response);
    result = data.choices[0].message.content;
  } catch (error) {
    logger.error(error);
  }
  return result;
};

const useAjaxPdfSummary = () => {
  const { modelName } = store.get(appConfigAtom);
  const { loading, doAsync: doAjax } = useAsyncFunction({
    action: async (markdownStr: string) =>
      await action(
        markdownStr,
        modelName || env.NEXT_PUBLIC_DEFAULT_MODEL_NAME
      ),
  });

  return {
    loading,
    doAjax,
  };
};

export default useAjaxPdfSummary;
