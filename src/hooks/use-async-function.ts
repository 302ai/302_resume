import { useState } from "react";

const useAsyncFunction = <T extends any[], U>(config: {
  action: (...param: T) => Promise<U>;
}) => {
  const { action } = config;

  const [loading, setLoading] = useState(false);

  const doAsync = async (...param: T) => {
    setLoading(true);
    const result = await action(...param);
    setLoading(false);
    return result;
  };
  return {
    loading,
    doAsync,
  };
};
export default useAsyncFunction;
