
import React, { useState, useCallback } from "react";
import { Widget } from "@/types";
import WidgetRenderer from "./WidgetRenderer";
import { DndContext, DragEndEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

interface SortableWidgetProps {
  widget: Widget;
  onEdit?: (widget: Widget) => void;
  onDelete?: (id: string) => void;
  isPreview?: boolean;
  isEditing: boolean;
}

const SortableWidget: React.FC<SortableWidgetProps> = ({ 
  widget, 
  onEdit, 
  onDelete, 
  isPreview,
  isEditing
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

  // Calculate column span for grid
  const colSpan = widget.gridSpan === 2 ? "sm:col-span-2" : "";
  
  // Default dimensions for widgets
  const defaultWidth = 300;
  const defaultHeight = 200;
  
  // Use saved dimensions or defaults
  const width = widget.width || defaultWidth;
  const height = widget.height || defaultHeight;

  if (!isEditing) {
    return (
      <div ref={setNodeRef} style={style} className={colSpan}>
        <WidgetRenderer 
          widget={widget} 
          isPreview={isPreview}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    );
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`${colSpan} relative`}
      {...attributes}
      {...listeners}
    >
      <div className="group cursor-move">
        <ResizableBox
          width={width}
          height={height}
          minConstraints={[150, 100]}
          maxConstraints={[600, 500]}
          resizeHandles={['se']}
          handle={
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-gray-200 rounded-sm opacity-50 group-hover:opacity-100 cursor-se-resize z-10" />
          }
          onResize={(e, data) => {
            // This would trigger a save in a real implementation
            console.log("Resized to:", data.size);
          }}
        >
          <WidgetRenderer 
            widget={widget} 
            isPreview={isPreview}
            onEdit={onEdit}
            onDelete={onDelete}
          />
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
  isEditing?: boolean;
}

const WidgetGrid: React.FC<WidgetGridProps> = ({ 
  widgets, 
  onEdit, 
  onDelete, 
  isPreview = false,
  onReorder,
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
      
      // Update positions in the new array
      const updatedWidgets = newWidgets.map((widget, index) => ({
        ...widget,
        position: index
      }));
      
      // Call the callback to save the new order
      if (onReorder) {
        onReorder(updatedWidgets);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {widgets.map((widget) => (
            <SortableWidget
              key={widget.id}
              widget={widget}
              onEdit={onEdit}
              onDelete={onDelete}
              isPreview={isPreview}
              isEditing={isEditing}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default WidgetGrid;
