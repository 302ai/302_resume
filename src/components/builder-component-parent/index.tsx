"use client";

import { env } from "@/env";
import { ResumeType } from "@/hooks/use-ajax-resumes";
import { getById, save, update } from "@/lib/db";
import { appConfigAtom } from "@/stores/slices/config_store";
import { store } from "@/stores";
import { useRouter } from "@/i18n/routing";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import dayjs from "dayjs";
import {
  resumeSchema,
  ResumeSchemaData,
} from "@/lib/reative-resume/dto/resume";
import { createScopedLogger } from "@/utils";
import { useIsDark } from "@/hooks/global/use-is-dark";
import { Loader2 } from "lucide-react";

interface Props {
  id: string;
}
export type Actions =
  | "INIT"
  | "TO_LINK"
  | "SAVE_TO_DB"
  | "INIT_SUB_OPENAI"
  | "CREATE_NEW_RESUME";

interface ActionData {
  type: Actions;
  payload: any;
}

const getActionData = (event: MessageEvent) => {
  let result: ActionData | null = null;
  if ("type" in event.data) {
    result = event.data;
  }
  return result;
};

const getIframeLocale = (locale: string) => {
  const lang = {
    zh: "zh-CN",
    en: "en-US",
    ja: "ja-JP",
  };
  return locale in lang ? lang[locale as keyof typeof lang] : lang["en"];
};

export default function BuilderComponentParent({ id }: Props) {
  const builderUrl = env.NEXT_PUBLIC_RESUME_BUILDER_URL;
  const t = useTranslations();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const locale = useLocale();

  const iframeLocale = getIframeLocale(locale);

  const [data, setData] = useState<ResumeType | null>(null);

  const [loading, setLoading] = useState(false);

  const { isDark } = useIsDark();

  const renderData = data ? data.data : null;

  const navigate = useRouter();

  const saveTimer = useRef<NodeJS.Timeout | null>(null);

  const logger = createScopedLogger("Home");

  const saveToDB = async (newData: any) => {
    if (!newData || !data) {
      return;
    }
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    saveTimer.current = setTimeout(async () => {
      const resultData: ResumeType = {
        ...data,
        id: id,
        data: newData,
      };
      await update(resultData);
    }, 1000);
  };

  const handleMessage = async (event: MessageEvent) => {
    // 检查消息来源是否为预期的builder URL
    if (event.origin !== builderUrl) {
      return;
    }
    const data = getActionData(event);
    if (!data) {
      return;
    }
    // 子页面初始化完成，发送数据
    if (data.type === "INIT") {
      updateIframeData();
      return;
    }
    if (data.type === "INIT_SUB_OPENAI") {
      updateIframeOpenAI();
      return;
    }
    if (data.type === "TO_LINK") {
      navigate.push(data.payload);
      return;
    }
    if (data.type === "SAVE_TO_DB") {
      saveToDB(data.payload);
      return;
    }
    if (data.type === "CREATE_NEW_RESUME") {
      console.log("parent", data.payload);

      let result: ResumeSchemaData | null = null;
      try {
        result = resumeSchema.parse(data.payload);
      } catch (error) {
        logger.error(error);
      }
      if (!result) {
        return;
      }
      result.id = Date.now().toString();
      result.title = result.title + " " + t("main.copy_resume_title");
      result.createdAt = dayjs().valueOf().toString();
      result.updatedAt = dayjs().valueOf().toString();
      await save(result);
      const url = `/${locale}/builder/${result.id}`;
      const fullUrl = `${window.location.origin}${url}`;
      const a = document.createElement("a");
      a.href = fullUrl;
      a.target = "_blank";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // navigate.replace(url);
      return;
    }
  };

  const initData = async () => {
    const data = await getById(id);
    if (data) {
      setData(data);
    }
  };

  // 发送数据到子页面
  const updateIframeData = async () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const postData = {
        type: "INIT_SUB",
        payload: data,
      };
      iframeRef.current.contentWindow.postMessage(postData, builderUrl);
    }
  };
  const updateIframeOpenAI = async () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const { apiKey, modelName } = store.get(appConfigAtom);
      const postData = {
        type: "INIT_SUB_OPENAI",
        payload: {
          baseUrl: env.NEXT_PUBLIC_API_URL,
          apiKey: apiKey,
          modelName: modelName,
        },
      };
      iframeRef.current.contentWindow.postMessage(postData, builderUrl);
    }
  };
  useEffect(() => {
    initData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!renderData) {
      return;
    }
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderData]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, [isDark]);
  return (
    <div className="relative flex size-full flex-1 flex-col overflow-hidden">
      {renderData && !loading ? (
        <iframe
          ref={iframeRef}
          className="h-full w-full flex-1"
          src={`${builderUrl}/builder/${id}?locale=${iframeLocale}&parentUrl=${window.location.origin}`}
        />
      ) : (
        <div className="flex h-full w-full flex-1 items-center justify-center">
          <div className="size-10 animate-spin rounded-full border-4 border-b-white border-l-transparent border-r-transparent border-t-transparent">
            <Loader2 className="size-full animate-spin" />
          </div>
        </div>
      )}
    </div>
  );
}
