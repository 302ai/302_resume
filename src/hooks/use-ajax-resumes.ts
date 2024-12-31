import { ResumeSchemaData } from "@/lib/reative-resume/dto/resume";
import { useState } from "react";

export type ResumeVisibilityType = "private" | "public";
export type ResumeType = ResumeSchemaData;

// 模拟从API获取简历数据
// Mock fetching resume data from API
const fetchResumes = async () => {
  // 这里应该是真实的API调用
  // This should be a real API call
  const mockData: ResumeType[] = [];

  // 模拟API延迟
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return mockData;
};

export const useAjaxResumes = () => {
  const [resumes, setResumes] = useState<ResumeType[] | null>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const doAjax = async () => {
    setLoading(true);
    let result: ResumeType[] | null = null;
    try {
      const data = await fetchResumes();
      result = data;
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
    setResumes(result);
    return result;
  };

  return { resumes, loading, error, doAjax };
};
