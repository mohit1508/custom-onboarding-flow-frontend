import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Droppable } from "./Droppable";
import { Draggable } from "./Draggable";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AdminPanel: React.FC = () => {
  const [config, setConfig] = useState<{ [key: number]: string[] }>({ 2: [], 3: [] });
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      const response = await axios.get(`${backendUrl}/api/admin/config`);
      setConfig(response.data);
    };
    fetchConfig();
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
  
    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }
  
    const activeId = String(active.id);
    const overId = String(over.id);
  
    console.log("Active ID:", activeId);
    console.log("Over ID:", overId);
  
    const sourceStep = parseInt(active.data.current?.parent || "0", 10);
    const destStep = parseInt(over.data.current?.parent || "0", 10);
  
    console.log("Source Step:", sourceStep, "Destination Step:", destStep);
  
    if (!sourceStep || !destStep) return;
  
    // Prevent removing the last card from a step
    if (config[sourceStep]?.length === 1 && activeId === config[sourceStep][0]) {
      alert("Each step must have at least one card.");
      setActiveId(null);
      return;
    }
  
    const sourceItems = Array.from(config[sourceStep] || []);
    const destItems = Array.from(config[destStep] || []);
  
    // Handle drag-and-drop within the same step
    if (sourceStep === destStep) {
      const itemIndex = sourceItems.indexOf(activeId);
      const overIndex = sourceItems.indexOf(overId);
  
      // Reorder items within the same list
      sourceItems.splice(itemIndex, 1);
      sourceItems.splice(overIndex, 0, activeId);
  
      const updatedConfig = {
        ...config,
        [sourceStep]: sourceItems,
      };
  
      console.log("Updated Config (same step):", updatedConfig);
  
      setConfig(updatedConfig);
      setActiveId(null);
  
      // Save the updated configuration to the backend
      try {
        await axios.post(`${backendUrl}/api/admin/config`, { page: sourceStep, components: sourceItems });
      } catch (error) {
        console.error("Failed to save configuration:", error);
        alert("Failed to save changes. Please try again.");
      }
  
      return;
    }
  
    // Handle drag-and-drop between different steps
    const itemIndex = sourceItems.indexOf(activeId);
    const [movedItem] = sourceItems.splice(itemIndex, 1);
    const destIndex = destItems.indexOf(overId);
    destItems.splice(destIndex, 0, movedItem);
  
    const updatedConfig = {
      ...config,
      [sourceStep]: sourceItems,
      [destStep]: destItems,
    };
  
    console.log("Updated Config (different step):", updatedConfig);
  
    setConfig(updatedConfig);
    setActiveId(null);
  
    try {
      await axios.post(`${backendUrl}/api/admin/config`, { page: sourceStep, components: sourceItems });
      await axios.post(`${backendUrl}/api/admin/config`, { page: destStep, components: destItems });
    } catch (error) {
      console.error("Failed to save configuration:", error);
      alert("Failed to save changes. Please try again.");
    }
  };
  
  
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );

  return (
    <div className="flex flex-col gap-6 w-[1000px]">
      <h1 className="text-3xl font-semibold">Admin Panel</h1>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-8">
          {[2, 3].map((page) => (
            <Droppable key={page} id={`${page}`} title={`Step ${page}`}>
              <SortableContext items={config[page] || []} strategy={verticalListSortingStrategy}>
                {(config[page] || []).map((component) => (
                  <Draggable key={component} id={component} parent={`${page}`}>
                    {component}
                  </Draggable>
                ))}
              </SortableContext>
            </Droppable>
          ))}
        </div>
        <DragOverlay>
          {activeId ? (
            <div className="bg-white p-4 rounded-lg shadow-md">{activeId}</div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default AdminPanel;
