
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
      className="w-full masonry-grid gap-6 columns-1 sm:columns-2 lg:columns-3 xl:columns-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {widgets.map((widget) => (
        <motion.div
          key={widget.id}
          className="break-inside-avoid mb-6"
          variants={itemVariants}
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}
          layout
        >
          <div 
            className="overflow-hidden rounded-2xl h-full" 
            style={{
              width: "100%",
              height: widget.height || (widget.rowSpan === 2 ? 400 : 200),
            }}
          >
            <WidgetRenderer
              widget={widget}
              isPreview={isPreview}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default BentoGrid;
