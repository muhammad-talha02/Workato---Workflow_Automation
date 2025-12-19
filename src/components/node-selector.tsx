"use client";

import { createId } from "@paralleldrive/cuid2";
import { useReactFlow } from "@xyflow/react";

import { GlobeIcon, MousePointerIcon } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { NodeType } from "@/generated/prisma/enums";
import { ReactNode, useCallback } from "react";
import Image from "next/image";
import { Separator } from "./ui/separator";
import { toast } from "sonner";

// import {NodeType} from "@/generated/prisma/browser"

export type NodeTypeOption = {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | string;
};

const triggerNodes: NodeTypeOption[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: "Manual Trigger",
    description:
      "Runs the flow on clicking a button. Good for geting starting quickly",
    icon: MousePointerIcon,
  },
  {
    type: NodeType.GOOGLE_FORM_TRIGGER,
    label: "Google Form",
    description: "Runs the flow when a google form is submit",
    icon: "/logos/googleform.svg",
  },
  {
    type: NodeType.STRIPE_TRIGGER,
    label: "Stripe Event",
    description: "Runs the flow when a stripe event is captured",
    icon: "/logos/stripe.svg",
  },
];

const executionNodes: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP Request",
    description: "Makes and HTTP request",
    icon: GlobeIcon,
  },
  {
    type: NodeType.GEMINI,
    label: "Gemini",
    description: "Use google gemini to create text",
    icon: "/logos/gemini.svg",
  },
];

interface NodeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export const NodeTypeSelector = ({
  icon,
  label,
  type,
  description,
  onClick,
}: NodeTypeOption & { onClick: () => void }) => {
  const Icon = icon;
  return (
    <div
      className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary"
      key={type}
      onClick={onClick}
    >
      <div className="flex items-center gap-6 w-full overflow-hidden">
        {typeof Icon === "string" ? (
          <Image
            src={Icon}
            alt={label}
            width={20}
            height={20}
            className="size-5 object-contain rounded-sm"
          />
        ) : (
          <Icon className="size-5" />
        )}
        <div className="flex flex-col items-start text-left">
          <span className="font-medium text-sm">{label}</span>
          <span className="text-xs text-muted-foreground">{description}</span>
        </div>
      </div>
    </div>
  );
};

export const NodeSelector = ({
  children,
  onOpenChange,
  open,
}: NodeSelectorProps) => {
  const { getNodes, setNodes, screenToFlowPosition } = useReactFlow();

  const handleNodesSelect = useCallback(
    (selection: NodeTypeOption) => {
      if (selection.type === NodeType.MANUAL_TRIGGER) {
        const nodes = getNodes();

        const hasManualTrigger = nodes.some(
          (node) => node.type === NodeType.MANUAL_TRIGGER
        );
        if (hasManualTrigger) {
          toast.error("Only one manual trigger is allowed per workflow");
          return;
        }
      }
      setNodes((nodes) => {
        const hasInitialTrigger = nodes.some(
          (node) => node.type === NodeType.INITIAL
        );
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const flowPosition = screenToFlowPosition({
          x: centerX + (Math.random() - 0.5) * 200,
          y: centerY + (Math.random() - 0.5) * 200,
        });

        const newNode = {
          id: createId(),
          data: {},
          position: flowPosition,
          type: selection.type,
        };

        if (hasInitialTrigger) {
          return [newNode];
        }
        return [...nodes, newNode];
      });
      onOpenChange(false);
    },
    [getNodes, setNodes, screenToFlowPosition, onOpenChange]
  );

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>What trigger this workflow?</SheetTitle>
          <SheetDescription>
            A Trigger is a step that starts your workflow.
          </SheetDescription>
        </SheetHeader>
        <div className="">
          {triggerNodes?.map((nodeType) => (
            <NodeTypeSelector
              key={nodeType.type}
              {...nodeType}
              onClick={() => handleNodesSelect(nodeType)}
            />
          ))}
        </div>
        <Separator />
        <div className="">
          {executionNodes?.map((nodeType) => (
            <NodeTypeSelector
              key={nodeType.type}
              {...nodeType}
              onClick={() => handleNodesSelect(nodeType)}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
