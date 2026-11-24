import { useState } from "react";

import { Button, Input } from "@components/ui";

interface NewPriceTargetFormProps {
  // Tuple of [upside, downside]
  onSave: (newValues: [number?, number?]) => void;
  onCancel: () => void;
}

export const NewPriceTargetForm = ({
  onSave,
  onCancel,
}: NewPriceTargetFormProps) => {
  const [values, setValues] = useState<[number?, number?]>([]);

  return (
    <section className="ml-auto flex items-end justify-end gap-4">
      <Input
        className="w-36"
        type="number"
        placeholder="Upside"
        step=".01"
        onChange={(e) => setValues([parseFloat(e.target.value), values[1]])}
        data-testid="price-target-upside"
      />
      <Input
        className="w-36"
        type="number"
        placeholder="Downside"
        step=".01"
        onChange={(e) => setValues([values[0], parseFloat(e.target.value)])}
        data-testid="price-target-downside"
      />
      <Button className="h-10" onClick={onCancel}>
        Cancel
      </Button>
      <Button
        className="h-10"
        onClick={() => onSave(values)}
        data-testid="price-target-create"
      >
        Create
      </Button>
    </section>
  );
};
