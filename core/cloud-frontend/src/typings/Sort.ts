export interface Sort<T extends string> {
  key: T;
  order: "asc" | "desc";
}
