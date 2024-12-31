import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

const ButtonText = (props: { loading: boolean; children: ReactNode }) => {
  const { loading, children } = props;

  return (
    <>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </>
  );
};

export default ButtonText;
