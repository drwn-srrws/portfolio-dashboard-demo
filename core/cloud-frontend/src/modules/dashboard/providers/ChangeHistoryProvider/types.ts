export interface ChangeHistoryConfig<
  TEntity extends string,
  TFlags extends Record<string, boolean>,
> {
  entityToFlags: (entity: TEntity) => Array<keyof TFlags>;
  initialFlags: TFlags;
}
