const demoResumeJson = {
  basics: {
    url: {
      href: "http://mywebsite.com",
      label: "",
    },
    name: "my full name here xxx",
    email: "myemail@email.com",
    phone: "phone number here",
    picture: {
      url: "",
      size: 64,
      effects: {
        border: false,
        hidden: false,
        grayscale: false,
      },
      aspectRatio: 1,
      borderRadius: 0,
    },
    headline: "my title here xxx",
    location: "China",
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
      name: "奖项",
      items: [
        {
          id: "x28t2p2w4ndoqtxf9dqb5i6k",
          visible: true,
          title: "1000m number 1",
          awarder: "china organization",
          date: "2023/08",
          summary: "<p>1000m long run </p>",
          url: {
            label: "",
            href: "https://localhost",
          },
        },
      ],
      columns: 1,
      visible: true,
      separateLinks: true,
    },
    custom: {},
    skills: {
      id: "skills",
      name: "技能",
      items: [
        {
          id: "m43dc3p3vlngye91mtmryp6s",
          visible: true,
          name: "python",
          description: "python description",
          level: "1",
          keywords: ["keyword"],
        },
      ],
      columns: 1,
      visible: true,
      separateLinks: true,
    },
    summary: {
      id: "summary",
      name: "总结",
      columns: 1,
      content: "<p>summary content here</p>",
      visible: true,
      separateLinks: true,
    },
    profiles: {
      id: "profiles",
      name: "个人资料",
      items: [
        {
          id: "itvhd1e5rdmf158gv44re04f",
          visible: true,
          network: "Linkedin.com",
          username: "john",
          icon: "",
          url: {
            label: "",
            href: "https://mylinkedin.com",
          },
        },
      ],
      columns: 1,
      visible: true,
      separateLinks: true,
    },
    projects: {
      id: "projects",
      name: "项目",
      items: [
        {
          id: "bxl1y6og8apkry281gd67qx4",
          visible: true,
          name: "china website",
          description: "website",
          date: "1998/08",
          summary: "<p>china website description content</p>",
          keywords: [],
          url: {
            label: "",
            href: "https://china-website.com",
          },
        },
      ],
      columns: 1,
      visible: true,
      separateLinks: true,
    },
    education: {
      id: "education",
      name: "教育",
      items: [
        {
          id: "djtxfcupwwrwo2dw7t0adlex",
          visible: true,
          institution: "my school",
          studyType: "website",
          area: "nodejs",
          score: "9.2",
          date: "2023/08",
          summary: "<p>my school summary content</p>",
          url: {
            label: "",
            href: "https://locahost",
          },
        },
      ],
      columns: 1,
      visible: true,
      separateLinks: true,
    },
    interests: {
      id: "interests",
      name: "兴趣",
      items: [
        {
          id: "zn2z6v7xx4xnynlbjfzqpoo6",
          visible: true,
          name: "basketball",
          keywords: ["outdoor activity"],
        },
      ],
      columns: 1,
      visible: true,
      separateLinks: true,
    },
    languages: {
      id: "languages",
      name: "语言",
      items: [
        {
          id: "h5e8u3wamh9p7piyiy03r4ib",
          visible: true,
          name: "english",
          description: "cet-4",
          level: "4",
        },
      ],
      columns: 1,
      visible: true,
      separateLinks: true,
    },
    volunteer: {
      id: "volunteer",
      name: "志愿服务",
      items: [
        {
          id: "ax2k7tjmd3kx2yy4ntw1rq9z",
          visible: true,
          organization: "dog care",
          position: "washer",
          location: "",
          date: "2023/01",
          summary: "",
          url: {
            label: "",
            href: "",
          },
        },
      ],
      columns: 1,
      visible: true,
      separateLinks: true,
    },
    experience: {
      id: "experience",
      name: "经历",
      items: [
        {
          id: "yyn5bn6xdghb593gptyoopv8",
          visible: true,
          company: "mycompany",
          position: "website developer",
          location: "China",
          date: "2023/09",
          summary: "<p>my company summary content</p>",
          url: {
            label: "",
            href: "https://mycompany.com",
          },
        },
      ],
      columns: 1,
      visible: true,
      separateLinks: true,
    },
    references: {
      id: "references",
      name: "推荐人",
      items: [
        {
          id: "s18cpxbhlfgv0erproebf14v",
          visible: true,
          name: "someone's name here",
          description: "",
          summary: "",
          url: {
            label: "",
            href: "",
          },
        },
      ],
      columns: 1,
      visible: true,
      separateLinks: true,
    },
    publications: {
      id: "publications",
      name: "出版物",
      items: [
        {
          id: "i3td1gm0jwvc6fd5jhksmv4l",
          visible: true,
          name: "book name",
          publisher: "",
          date: "",
          summary: "",
          url: {
            label: "",
            href: "",
          },
        },
      ],
      columns: 1,
      visible: true,
      separateLinks: true,
    },
    certifications: {
      id: "certifications",
      name: "证书",
      items: [
        {
          id: "n1ocl3seawz7m0xd54te3fzl",
          visible: true,
          name: "cet4",
          issuer: "test of english",
          date: "2022/09",
          summary: "<p>englishs cet-4</p>",
          url: {
            label: "",
            href: "https://cet-4.com",
          },
        },
      ],
      columns: 1,
      visible: true,
      separateLinks: true,
    },
  },
};

export default demoResumeJson;
