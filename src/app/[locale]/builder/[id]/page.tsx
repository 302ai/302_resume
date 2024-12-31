"use client";

import BuilderComponentParent from "@/components/builder-component-parent";
import { useParams } from "next/navigation";

// import BuilderComponent from "@/components/builder-component";

export default function BuilderPage() {
  const params = useParams();
  const id = params.id as string; // 获取动态路由参数 id

  return (
    <>
      <BuilderComponentParent id={id} />
    </>
  );
}
