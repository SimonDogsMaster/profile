import { siteContent } from "@/content/site";

export type StackIcon = (typeof siteContent.stackIcons)[number];

export type PointerPosition = { x: number; y: number } | null;
