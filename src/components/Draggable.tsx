import React from "react";
import { useDraggable } from "@dnd-kit/core";

interface DraggableProps {
  id: string;
  parent: string;
  children: React.ReactNode;
}

export const Draggable: React.FC<DraggableProps> = ({ id, parent, children }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { parent },
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 border rounded-lg shadow-md mb-2 cursor-pointer text-xl touch-none"
    >
      {children}
    </div>
  );
};
