import { IconNameType } from "@/components/Icon/Icon";

export const findTrackablePage = (
  trackablePages: { url: string; title: string; icon?: IconNameType }[],
  url: string
) => {
  if (url === "/") {
    return null;
  }

  return trackablePages.find((page) => page.url.includes(url));
};
