import { useQuery } from "@tanstack/react-query";
import { RESUMES_KEY } from "@/constants/reactive-resume/query-keys";
import { ResumeSchemaData } from "@/lib/reative-resume/dto/resume";

export type ResumeType = ResumeSchemaData;

export const fetchResumes = async () => {
  const result: ResumeType[] = [];
  return result;
  // const response = await axios.get<ResumeDto[], AxiosResponse<ResumeDto[]>>("/resume");

  // return response.data;
};

export const useResumes = () => {
  const {
    error,
    isPending: loading,
    data: resumes,
  } = useQuery({
    queryKey: RESUMES_KEY,
    queryFn: fetchResumes,
  });

  return { resumes, loading, error };
};
