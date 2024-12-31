import { AnimatePresence, motion } from "framer-motion";

import { BaseListItem } from "./_components/base-item";
// import { ResumeListItem } from "./_components/resume-item";
import { ResumeType } from "@/hooks/reactive-resume/resumes";
import { sortByDate } from "@/utils/reactive-resume/date";
import { ResumeListItem } from "./_components/resume-item";

export const ListView = ({
  resumes,
  loading,
  afterDelete,
}: {
  resumes: ResumeType[] | null;
  loading: boolean;
  afterDelete: () => void;
}) => {
  return (
    <div className="grid gap-y-2">
      {loading &&
        Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="duration-300 animate-in fade-in"
            style={{
              animationFillMode: "backwards",
              animationDelay: `${i * 300}ms`,
            }}
          >
            <BaseListItem className="bg-secondary/40" />
          </div>
        ))}

      {resumes && (
        <AnimatePresence>
          {resumes
            .sort((a, b) => sortByDate(a, b, "updatedAt"))
            .map((resume, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -50 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: (index + 2) * 0.1 },
                }}
                exit={{
                  opacity: 0,
                  filter: "blur(8px)",
                  transition: { duration: 0.5 },
                }}
              >
                <ResumeListItem resume={resume} refresh={afterDelete} />
              </motion.div>
            ))}
        </AnimatePresence>
      )}
    </div>
  );
};
