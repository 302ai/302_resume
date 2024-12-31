import { z } from "zod";

export const defaultLayout = [
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
];

// Schema
export const metadataSchema = z.object({
  template: z.string().default("rhyhorn"),
  layout: z.array(z.array(z.array(z.string()))).default(defaultLayout), // pages -> columns -> sections
  css: z.object({
    value: z
      .string()
      .default(
        ".section {\n\toutline: 1px solid #000;\n\toutline-offset: 4px;\n}"
      ),
    visible: z.boolean().default(false),
  }),
  page: z.object({
    margin: z.number().default(18),
    format: z.enum(["a4", "letter"]).default("a4"),
    options: z.object({
      breakLine: z.boolean().default(true),
      pageNumbers: z.boolean().default(true),
    }),
  }),
  theme: z.object({
    background: z.string().default("#ffffff"),
    text: z.string().default("#000000"),
    primary: z.string().default("#dc2626"),
  }),
  typography: z.object({
    font: z.object({
      family: z.string().default("IBM Plex Serif"),
      subset: z.string().default("latin"),
      variants: z.array(z.string()).default(["regular"]),
      size: z.number().default(14),
    }),
    lineHeight: z.number().default(1.5),
    hideIcons: z.boolean().default(false),
    underlineLinks: z.boolean().default(true),
  }),
  notes: z.string().default(""),
});

// Type
export type Metadata = z.infer<typeof metadataSchema>;

// Defaults
export const defaultMetadata: Metadata = {
  css: {
    value: ".section {\n\toutline: 1px solid #000;\n\toutline-offset: 4px;\n}",
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
  template: "rhyhorn",
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
};
