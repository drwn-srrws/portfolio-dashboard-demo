export const capitalize = (s: string) => {
  const str = String(s);
  return `${str?.charAt(0)?.toUpperCase()}${str?.slice(1)}`;
};

export const splitCamelCase = (s: string) =>
  s.replace(/([a-z])([A-Z])/g, "$1 $2");

export const toDecimalStr = (s: string) => {
  if (!s) return undefined;
  const n = parseFloat(s);
  return isNaN(n) ? undefined : n.toFixed(2);
};

export const formatName = (person: { first_name: string; last_name: string }) =>
  `${person.last_name} ${person.first_name}`;

export const snakeCaseToTitleCase = (s: string) =>
  s.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

export const truncate = (text = "", max = 30) =>
  text.length > max ? text.slice(0, max) + "..." : text;

export const toTitleCase = (str: string): string => {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
