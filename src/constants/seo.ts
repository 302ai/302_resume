export type SEOData = {
  supportLanguages: string[];
  fallbackLanguage: string;
  languages: Record<
    string,
    { title: string; description: string; image: string }
  >;
};

export const SEO_DATA: SEOData = {
  // TODO: Change to your own support languages
  supportLanguages: ["zh", "en", "ja"],
  fallbackLanguage: "en",
  // TODO: Change to your own SEO data
  languages: {
    zh: {
      title: "AI 简历制作",
      description: "使用AI制作高质量简历",
      image: "/images/global/desc_zh.png",
    },
    en: {
      title: "AI Resume Creation",
      description: "Using AI to create high-quality resumes",
      image: "/images/global/desc_en.png",
    },
    ja: {
      title: "AI履歴書作成",
      description: "AIを使った高品質履歴書の作成",
      image: "/images/global/desc_ja.png",
    },
  },
};
