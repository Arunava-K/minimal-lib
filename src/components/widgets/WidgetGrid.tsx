
import React, { useState, useCallback, useEffect } from "react";
import { Widget } from "@/types";
import WidgetRenderer from "./WidgetRenderer";
import { DndContext, DragEndEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion"; // Added Framer Motion import

const PRESET_SIZES = [
  { width: 200, height: 200 },
  { width: 400, height: 400 },
  { width: 200, height: 400 },
  { width: 400, height: 200 },
];

const snapToClosestPreset = (currentWidth: number, currentHeight: number) => {
  let closest = PRESET_SIZES[0];
  let minDiff = Infinity;

  for (const preset of PRESET_SIZES) {
    const diff = Math.abs(preset.width - currentWidth) + Math.abs(preset.height - currentHeight);
    if (diff < minDiff) {
      minDiff = diff;
      closest = preset;
    }
  }
  return closest;
};

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
  const [localSize, setLocalSize] = useState({
    width: widget.width || PRESET_SIZES[0].width,
    height: widget.height || PRESET_SIZES[0].height
  });

  // Sync localSize with widget props if they change from parent
  useEffect(() => {
    const newWidth = widget.width || PRESET_SIZES[0].width;
    const newHeight = widget.height || PRESET_SIZES[0].height;
    // Only update if there's an actual change to avoid potential loops or unnecessary renders
    if (localSize.width !== newWidth || localSize.height !== newHeight) {
      setLocalSize({ width: newWidth, height: newHeight });
    }
  }, [widget.width, widget.height]); // Dependencies: only props that drive this state from outside

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
    width: localSize.width,
    height: localSize.height,
  };

  // Removed defaultWidth, defaultHeight, and original handleResize

  return (
    <motion.div
      layout
      ref={setNodeRef} 
      style={style} 
      className={cn(
        "relative",
        isEditing ? "hover:ring-2 ring-blue-500 ring-offset-2" : ""
      )}
      {...attributes}
      {...listeners}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <motion.div 
        className={cn(
          "group relative",
          isEditing ? "cursor-move" : ""
        )}
        // Removed layout and transition from this inner motion.div
      >
        <ResizableBox
          width={localSize.width}
          height={localSize.height}
          minConstraints={[200, 200]} // Min of presets
          maxConstraints={[400, 400]} // Max of presets
          resizeHandles={isEditing ? ['se'] : []} // Standard bottom-right handle
          onResize={(e, { size }) => {
            setLocalSize(size);
          }}
          onResizeStop={(e, { size }) => {
            if (onResize) {
              const snappedSize = snapToClosestPreset(size.width, size.height);
              setLocalSize(snappedSize);
              onResize(widget.id, snappedSize.width, snappedSize.height);
            }
          }}
        >
          <motion.div 
            className="h-full overflow-hidden"
            // Removed layout and transition from this inner motion.div
          >
            <WidgetRenderer 
              widget={widget} 
              isPreview={isPreview}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </motion.div>
        </ResizableBox>
      </motion.div>
    </motion.div>
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
        <motion.div 
          layout
          className="flex flex-wrap gap-6 p-6 max-w-[800px] mx-auto" // Added max-width and centering
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
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
        </motion.div>
      </SortableContext>
    </DndContext>
  );
};

export default WidgetGrid;
