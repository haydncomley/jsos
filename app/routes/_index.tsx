import type { MetaFunction } from "@remix-run/node";
import { Desktop } from "~/lib/components/desktop";

export const meta: MetaFunction = () => {
  return [
    { title: "jsOS" },
    { name: "description", content: "A Remix + React powered, web based desktop environment." },
  ];
};

export default function Index() {
  return (
    <main>
      <Desktop></Desktop>
    </main>
  );
}