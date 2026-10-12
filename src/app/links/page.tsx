import type { Metadata } from "next";
import LinksClient from "./LinksClient";

export const metadata: Metadata = {
  title: "링크 목록 | 마이링크 (MyLink)",
  description: "크리에이터의 추천 및 전체 링크 목록을 확인하세요.",
};

export default function LinksPage() {
  return <LinksClient />;
}
