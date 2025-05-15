
import React from "react";
import { Widget } from "@/types";
import WidgetRenderer from "./WidgetRenderer";

interface WidgetGridProps {
  widgets: Widget[];
  onEdit?: (widget: Widget) => void;
  onDelete?: (id: string) => void;
  isPreview?: boolean;
}

const WidgetGrid: React.FC<WidgetGridProps> = ({ widgets, onEdit, onDelete, isPreview = false }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {widgets.map((widget) => {
        const span = widget.gridSpan === 2 ? "sm:col-span-2" : "";
        return (
          <div key={widget.id} className={span}>
            <WidgetRenderer 
              widget={widget} 
              isPreview={isPreview}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        );
      })}
    </div>
  );
};

export default WidgetGrid;
