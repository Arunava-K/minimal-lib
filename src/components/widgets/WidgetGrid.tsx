import React, { useState, useCallback } from "react";
import { Widget } from "@/types";
import WidgetRenderer from "./WidgetRenderer";
import { DndContext, DragEndEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { cn } from "@/lib/utils";

interface SortableWidgetProps {
  widget: Widget;
  onEdit?: (widget: Widget) => void;
  onDelete?: (id: string) => void;
  isPreview?: boolean;
  isEditing: boolean;
  onResize?: (id: string, width: number, height: number) => void;
}

const SortableWidget: React.FC<SortableWidgetProps> = ({ 
  widget, 
  onEdit, 
  onDelete, 
  isPreview,
  isEditing,
  onResize
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: widget.id,
    disabled: !isEditing,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  // Default dimensions for widgets
  const defaultWidth = widget.width || 300;
  const defaultHeight = widget.height || 200;

  const handleResize = (e: any, { size }: { size: { width: number; height: number } }) => {
    if (onResize) {
      onResize(widget.id, size.width, size.height);
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={cn(
        "relative transition-all duration-300",
        isEditing ? "hover:ring-2 ring-blue-500 ring-offset-2" : ""
      )}
      {...attributes}
      {...listeners}
    >
      <div className={cn(
        "group relative",
        isEditing ? "cursor-move" : ""
      )}>
        <ResizableBox
          width={defaultWidth}
          height={defaultHeight}
          minConstraints={[200, 100]}
          maxConstraints={[600, 600]}
          resizeHandles={isEditing ? ['se'] : []}
          onResize={handleResize}
          handle={
            isEditing ? (
              <div className="absolute bottom-2 right-2 w-4 h-4 bg-blue-500 rounded-sm opacity-50 group-hover:opacity-100 cursor-se-resize z-10" />
            ) : undefined
          }
        >
          <div className="h-full">
            <WidgetRenderer 
              widget={widget} 
              isPreview={isPreview}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        </ResizableBox>
      </div>
    </div>
  );
};

interface WidgetGridProps {
  widgets: Widget[];
  onEdit?: (widget: Widget) => void;
  onDelete?: (id: string) => void;
  isPreview?: boolean;
  onReorder?: (widgets: Widget[]) => void;
  onResize?: (id: string, width: number, height: number) => void;
  isEditing?: boolean;
}

const WidgetGrid: React.FC<WidgetGridProps> = ({ 
  widgets, 
  onEdit, 
  onDelete, 
  isPreview = false,
  onReorder,
  onResize,
  isEditing = false
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveId(null);
    
    if (over && active.id !== over.id) {
      const oldIndex = widgets.findIndex(item => item.id === active.id);
      const newIndex = widgets.findIndex(item => item.id === over.id);
      
      const newWidgets = arrayMove(widgets, oldIndex, newIndex);
      
      if (onReorder) {
        onReorder(newWidgets);
      }
    }
  }, [widgets, onReorder]);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={widgets.map(w => w.id)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {widgets.map((widget) => (
            <SortableWidget
              key={widget.id}
              widget={widget}
              onEdit={onEdit}
              onDelete={onDelete}
              isPreview={isPreview}
              isEditing={isEditing}
              onResize={onResize}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default WidgetGrid;