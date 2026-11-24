import { Card } from "@/components/ui/card";
import { Icon } from "@/components/Icon/Icon";
import { Link } from "react-router-dom";
import { useConfig } from "@/providers/ConfigProvider";
import { usePageVisitRecorder } from "@/hooks/usePageVisitRecorder";
import { useIsMobile } from "@/hooks/useMobile";

export const RecentlyViewed = () => {
  const { recentPages } = usePageVisitRecorder();
  const { defaultRecentlyViewedPages } = useConfig();
  const isMobile = useIsMobile();

  const hasRecentPages = recentPages.length > 0;
  const pageLimit = isMobile ? 5 : 6;
  const mostViewedPages = hasRecentPages
    ? recentPages
        .sort((a, b) => (b?.visitCount || 0) - (a?.visitCount || 0))
        .slice(0, pageLimit)
    : defaultRecentlyViewedPages.slice(0, pageLimit);

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-base font-medium ml-5">
        {hasRecentPages ? "Recently viewed pages:" : "Popular pages:"}
      </h2>
      <div className="flex gap-x-4 gap-y-0 md:gap-8">
        {mostViewedPages.map((item, index) => (
          <Link to={item.url} key={`${item.url}-${index}`}>
            <Card className="flex cursor-pointer flex-col items-center justify-center gap-3 px-2 py-3 md:p-4 transition-colors hover:bg-neutral-800 max-w-[60px] border-none">
              <div className="bg-neutral-800 rounded-lg p-2 flex items-center justify-center border border-neutral-700">
                <Icon name={item.icon || "ChartPie"} size={22} />
              </div>
              <span className="text-sm text-neutral-50 text-center">
                {item.title}
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
