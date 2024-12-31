import { update } from "@/lib/db";
import useAsyncFunction from "../use-async-function";
import { ResumeSchemaData } from "@/lib/reative-resume/dto/resume";

const action = async (data: ResumeSchemaData) => {
  return await update(data);
};

const useSessionDbUpdate = () => {
  const { loading, doAsync } = useAsyncFunction({
    action: action,
  });
  return {
    loading,
    doAsync,
  };
};

export default useSessionDbUpdate;
