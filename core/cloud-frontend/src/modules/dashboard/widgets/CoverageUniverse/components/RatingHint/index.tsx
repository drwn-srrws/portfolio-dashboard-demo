export interface RatingHintProps {
  name: string;
  comment?: string | null;
  updatedAt: string;
}

export const RatingHint = ({ name, comment, updatedAt }: RatingHintProps) => (
  <div className="m-0 flex flex-col gap-2 rounded-md p-[3px] text-white">
    <p className="text-base">{name}</p>
    {comment && <p className="text-sm">{comment}</p>}
    <p className="text-sm text-neutral-400">Modified on: {updatedAt}</p>
  </div>
);
