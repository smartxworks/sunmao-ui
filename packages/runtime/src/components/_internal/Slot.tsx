import React from "react";
import { SlotsMap } from "../../App";

const Slot: React.FC<{ slotsMap: SlotsMap | undefined; slot: string }> = ({
  slotsMap,
  slot,
}) => {
  return (
    <>
      {(slotsMap?.get(slot) || []).map((ImplWrapper, idx) => (
        <ImplWrapper key={idx} />
      ))}
    </>
  );
};

export default Slot;
