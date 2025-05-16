
import React from "react";
import { Widget } from "@/types";
import { motion } from "framer-motion";
import WidgetRenderer from "./WidgetRenderer";
import { cn } from "@/lib/utils";

interface BentoGridProps {
  widgets: Widget[];
  onEdit?: (widget: Widget) => void;
  onDelete?: (id: string) => void;
  isPreview?: boolean;
  onReorder?: (widgets: Widget[]) => void;
  onResize?: (id: string, width: number, height: number) => void;
  isEditing?: boolean;
}

const BentoGrid: React.FC<BentoGridProps> = ({
  widgets,
  onEdit,
  onDelete,
  isPreview = false,
  isEditing = false,
}) => {
  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  // Item animation
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  return (
    <motion.div
      className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 auto-rows-max"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {widgets.map((widget) => {
        // Determine column span based on gridSpan property
        const colSpanClass = widget.gridSpan === 2 
          ? "sm:col-span-2" 
          : "col-span-1";
          
        // Determine height based on rowSpan property
        const heightClass = widget.rowSpan === 2 
          ? "row-span-2" 
          : "row-span-1";
        
        return (
          <motion.div
            key={widget.id}
            className={cn(
              colSpanClass,
              heightClass,
              "transform transition-all duration-300 hover:z-10"
            )}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
            layout
          >
            <div className="h-full rounded-2xl overflow-hidden">
              <WidgetRenderer
                widget={widget}
                isPreview={isPreview}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default BentoGrid;
