import React from "react";
import { useDroppable } from "@dnd-kit/core";

interface DroppableProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export const Droppable: React.FC<DroppableProps> = ({ id, title, children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      parent: id, // Assign the droppable ID as the parent
    },
  });

  const style = {
    backgroundColor: isOver ? "#f0fdf4" : "#d1d5db",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-parent={id} 
      className="flex flex-col gap-4 p-4 border rounded-lg md:w-1/2 min-h-[250px]"
    >
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      {children}
    </div>
  );
};
