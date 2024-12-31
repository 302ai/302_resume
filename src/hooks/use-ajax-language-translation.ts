import { z } from "zod";
import useAsyncFunction from "./use-async-function";
import { appConfigAtom, store } from "@/stores";
import { env } from "@/env";
import { apiKy } from "@/api";

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

const getPromptMsg = (language: string, content: string) => `
Translate all text content into ${language}.

-This text is intended for resume filling, and the translation should achieve professional level quality and ----conform to the language habits of the target language usage region.
-It is strictly prohibited to omit any text elements, and words or sentences cannot be filtered out without translation.
-You support multilingual translation. Pay attention to the logic and rigor of translation. Pay special attention to the translation of names, email addresses, regions, company names, and product names.
-Do not change the attribute layout of the template, and do not translate anything related to attributes.
-Except for basic personal information, the "id" in other parts are not translated.

This is an example of translating into Japanese:
"summary": {
"name": "Summary",
"columns": 1,
"separateLinks": false,
"visible": true,
"id": "summary",
"content": "大学毕业于计算机应用专业，熟悉前沿前端框架技术，熟悉开发流程和开发过程遇到的问题具备扎实的理论基础及丰富的实操经验，有优秀的编码能力和代码规范能力，能解决前端较为复杂的问题，不断钻研前端前沿的技术，不断学习来丰富自己的技术栈和解决问题的能力，能够快速开展工作。"
}

The translated output is:
"summary": {
"name": "まとめ",
"columns": 1,
"separateLinks": false,
"visible": true,
"id": "summary",
"content": "大学はコンピュータ応用学科を卒業し、最先端のフレームワーク技術を熟知し、開発プロセスと開発過程に遭遇した問題を熟知し、堅実な理論基礎と豊富な実技経験を備え、優れた符号化能力とコード規範能力があり、先端の複雑な問題を解決し、先端先端先端の技術を絶えず研究し、絶えず自分の技術スタックを豊かにし、問題を解決する能力を学び、迅速に仕事を展開することができる。"
}
Input content:\`\`\`json
${content}
\`\`\`
You must return the results in JSON format, do not add any other content, and do not wrap them in code blocks with '\`\`\`JSON' and '\`\`\`'.
`;

const action = async (jsonStr: string, modelName: string, language: string) => {
  let result: string | null = null;

  for (let i = 0; i < 3; i++) {
    try {
      const response = await apiKy
        .post(apiUrl, {
          json: {
            model: modelName,
            "X-No-Cache": true,
            "X-Wait-For-Selector": "#content",
            messages: [
              { role: "system", content: getPromptMsg(language, jsonStr) },
              // { role: "user", content: getPromptMsg(language, jsonStr) },
            ],
          },
        })
        .json();

      const data = resSchema.parse(response);
      result = data.choices[0].message.content;
      break;
    } catch (error) {
      console.error(error);
    }
  }

  return result;
};

const useAjaxLanguageTranslation = () => {
  const { modelName } = store.get(appConfigAtom);

  const { loading, doAsync: doAjax } = useAsyncFunction({
    action: async (jsonStr: string, language: string) =>
      await action(
        jsonStr,
        modelName ?? env.NEXT_PUBLIC_DEFAULT_MODEL_NAME,
        language
      ),
  });

  return {
    loading,
    doAjax,
  };
};

export default useAjaxLanguageTranslation;
