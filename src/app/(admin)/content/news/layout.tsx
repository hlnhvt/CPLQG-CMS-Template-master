import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý tin tức",
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
