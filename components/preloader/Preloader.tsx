"use client";
import { cn } from "@/lib/utils";

export default function Preloader() {
  return (
    <section>
      <div className="preloader-backdrop"></div>
      <div className={cn()}></div>
    </section>
  );
}
