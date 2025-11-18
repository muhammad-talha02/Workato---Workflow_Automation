"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export const AddNodeButton = () => {
  return (
    <Button
      size={"icon"}
      variant={"outline"}
      className="bg-background"
      onClick={() => {}}
    >
      <PlusIcon />
    </Button>
  );
};

AddNodeButton.displayName = "AddNodeButton";
