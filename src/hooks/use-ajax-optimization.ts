import { z } from "zod";

import useAsyncFunction from "./use-async-function";
import { apiKy } from "@/api";
import { appConfigAtom, store } from "@/stores";
import { env } from "@/env";
import demoResumeJson from "@/lib/demo-resume-json";

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
You are a senior HR and have seen many excellent resumes. Now you need to optimize your resume based on the provided JD.

-Only optimize other personal information except for the "basic" section, and prohibit modifying the content of the "basic" section.
-JD generally includes job title, job description, and job requirements. Based on the provided job description and job requirements, optimize and polish personal information in a targeted manner on the original basis of the resume.
-Do not modify the attribute information of the template, only optimize the relevant content of personal information.
-The personal information for optimizing and polishing should be reasonable and not overly exaggerated.
-There can be some correlation between the contents of personal information to enhance the authenticity and credibility of resume content.

Taking the "educational experience" in the resume as an example:
Education experience: Bachelor's degree in Art History and Theory at Tianjin Academy of Fine Arts, September 2021 June 2025. This major mainly focuses on the basic theories, knowledge, and professional skills of art history and theory, art education, as well as related cultural, historical, and philosophical knowledge. The main courses include: History of Chinese and Foreign Art, Introduction to Art, Overview of Chinese and Foreign Painting Theory, Classical Chinese and Ancient Chinese, Fundamentals of Art Archaeology, Introduction to Calligraphy and Painting Appraisal, and Fundamentals of Art and Photography. Main practical teaching activities: including painting and sketching, photography and darkroom operations, examination of ancient art relics, and museum professional internships.

User input:
Job Description
1. Follow up on the implementation of activities, including but not limited to new promotion activities on store themes/categories, collaborate with stores/suppliers/business districts, etc.: 2. Assist in completing activity data analysis, assist in outputting analysis reports, including but not limited to activity execution data analysis, consumer analysis, activity participation analysis, etc;
3. Assist in following up on event atmosphere planning and implementation, material tracking, etc
To assist in achieving the desired outcome of the activity;
4. Assist in completing some industry research work:
5. Follow up with business supervisors/responsible persons to arrange other work;
Job requirements
1. During my school years, I had experience working in school teams/student unions, and had experience in event implementation/planning
2. Proficient in using Excel, PPT, etc., with priority given to mastering one or more common data extraction, analysis, and conversion tools;
3. Have data sensitivity, possess data mining and logical analysis abilities;
4. Passionate about planning work, creative, and interested in the retail industry;

Output result:
Educational experience

Tianjin Academy of Fine Arts
Department of Art History and Theory, Bachelor's degree
September 2021 to June 2025
During my school years, I systematically studied theories and practices related to art history and education, and developed solid abilities in art analysis and project planning. The main courses include Chinese and foreign art history, art introduction, paleography and ancient Chinese, etc., to deepen the understanding of the interaction between culture and art.

Related courses and practical experience:

Chinese and foreign art history: in-depth analysis of art works and their market trends, with certain data analysis skills.
Fundamentals of Art Archaeology: Participated in the examination of ancient art relics and accumulated practical experience in project organization and on-site research.
Fundamentals of Art and Photography: Through painting and photography practice, sensitivity to details and creative thinking have been cultivated.
Internship in Museum Major: Assisted in planning and executing exhibition activities, participated in material preparation and on-site management, and improved the ability to implement and execute activities.
skill:

Proficient in using office software such as Excel and PPT, with the ability to extract and analyze data, and able to support activity effectiveness evaluation.
Sensitive to data, possessing basic data mining and logical analysis skills, able to assist in completing activity data analysis and report output.
Passionate about event planning, possessing innovative thinking, paying attention to the dynamics of the retail industry, and actively participating in the organization of on campus and off campus activities.

You must return the result in JSON format, do not add any other content, do not wrapped in code block with '\`\`\`json' and '\`\`\`'.
`;

const action = async (
  jsonStr: string,
  modelName: string,
  userInput: string
) => {
  let result: string | null = null;

  try {
    const response = await apiKy
      .post(apiUrl, {
        json: {
          model: modelName,
          "X-No-Cache": true,
          "X-Wait-For-Selector": "#content",
          messages: [
            {
              role: "system",
              content: prompt + "\n" + JSON.stringify(demoResumeJson),
            },
            { role: "user", content: userInput },
            { role: "user", content: jsonStr },
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

const useAjaxOptimization = () => {
  const model = store.get(appConfigAtom).modelName;

  const { loading, doAsync: doAjax } = useAsyncFunction({
    action: async (jsonStr: string, userInput: string) =>
      await action(
        jsonStr,
        model ?? env.NEXT_PUBLIC_DEFAULT_MODEL_NAME,
        userInput
      ),
  });

  return {
    loading,
    doAjax,
  };
};

export default useAjaxOptimization;
