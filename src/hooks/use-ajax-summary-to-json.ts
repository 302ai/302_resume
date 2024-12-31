import { z } from "zod";

import useAsyncFunction from "./use-async-function";
import { apiKy } from "@/api";
import { appConfigAtom, store } from "@/stores";
import { env } from "@/env";

const apiUrl = "v1/chat/completions";

const resSchema = z.object({
  choices: z.array(
    z.object({
      message: z.object({
        content: z.string(),
      }),
    })
  ),
});

const prompt = `
-Organize and analyze all text content, and fill in the corresponding module in the personal information column of the resume. It is necessary to combine the titles and subheadings of each module and accurately fill in the corresponding subheading position.

This is an excellent example:
User description:
During my school years, I systematically studied theories and practices related to art history and education, and developed solid abilities in art analysis and project planning. The main courses include Chinese and foreign art history, art introduction, paleography and ancient Chinese, etc., to deepen the understanding of the interaction between culture and art. Good at photography and play badminton. Proficient in using various office software, adept at raising, discovering, and solving problems in work, with strong analytical skills; Good teamwork ability, optimistic and cheerful personality, strong execution ability, and proficient communication skills; I am meticulous and conscientious in my work, and will complete my assigned tasks well, striving for perfection. Won the first prize in the national competition of the 5th National College Computer Ability Challenge (Word subject) in 2023.

Personal information after filling in:
Education: During my school years, I systematically studied theories and practices related to art history and education, cultivating solid abilities in art analysis and project planning. The main courses include Chinese and foreign art history, art introduction, paleography and ancient Chinese, etc., to deepen the understanding of the interaction between culture and art.

Certificate: Won the first prize in the 2023 5th National College Computer Ability Challenge (Word subject) National Competition.

Interests: good at photography and play badminton.

Summary: Proficient in using various office software, adept at raising, discovering, and solving problems in work, with strong analytical skills; Good teamwork ability, optimistic and cheerful personality, strong execution ability, and proficient communication skills; I am meticulous and conscientious in my work, and will complete my assigned tasks well, striving for perfection.


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
layout: [Keyof<Resume.sections>, Keyof<Resume.sections>][];
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


You must return the results in JSON format, do not add any other content, and do not wrap them in code blocks with '\`\`\`JSON' and '\`\`\`'.

`;

const action = async (modelName: string, userInput: string) => {
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
            { role: "user", content: userInput },
          ],
        },
      })
      .json();

    const data = resSchema.parse(response);
    result = data.choices[0].message.content;
  } catch (error) {
    console.error(error);
  }
  return result;
};

const useAjaxSummaryToJson = () => {
  const model = store.get(appConfigAtom).modelName;

  const { loading, doAsync: doAjax } = useAsyncFunction({
    action: async (userInput: string) =>
      await action(model ?? env.NEXT_PUBLIC_DEFAULT_MODEL_NAME, userInput),
  });

  return {
    loading,
    doAjax,
  };
};

export default useAjaxSummaryToJson;
