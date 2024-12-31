import { ResumeSchemaData } from "@/lib/reative-resume/dto/resume";

const getClearCustomFields = (data: ResumeSchemaData) => {
  const result: ResumeSchemaData = {
    ...data,
  };
  result.data.basics.customFields = data.data.basics.customFields.filter(
    (item) => !!item.value
  );
  return result;
};

export default getClearCustomFields;
