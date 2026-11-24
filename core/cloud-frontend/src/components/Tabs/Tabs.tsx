import { Tabs as ShadTabs, TabsList, TabsTrigger } from "@components/ui/tabs";

export interface TabOption {
  title: string;
  id: string;
}

export interface TabsProps {
  options: TabOption[];
  selectedTab: string;
  onTabChange: (value: string) => void;
  testId?: string;
}

export const Tabs = ({
  options,
  selectedTab,
  onTabChange,
  testId,
}: TabsProps) => {
  return (
    <ShadTabs value={selectedTab ?? options[0].id} onValueChange={onTabChange}>
      <TabsList data-testid={testId}>
        {options.map(({ id, title }) => (
          <TabsTrigger value={id} key={id} data-testid={id}>
            {title}
          </TabsTrigger>
        ))}
      </TabsList>
    </ShadTabs>
  );
};
