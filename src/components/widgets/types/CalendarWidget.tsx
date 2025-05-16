
import React, { useState } from 'react';
import { Widget } from '@/types';
import BaseWidgetCard, { BaseWidgetCardProps } from '../BaseWidgetCard';
import { Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface CalendarWidgetProps extends Omit<BaseWidgetCardProps, 'children'> {}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({ widget, isPreview, onEdit, onDelete, style }) => {
  const { title, content } = widget;
  const { 
    calendarType,
    bookingUrl,
    availableDays,
    timeSlots,
    timezone,
    eventName
  } = content as {
    calendarType: string;
    bookingUrl: string;
    availableDays?: string[];
    timeSlots?: string[];
    timezone?: string;
    eventName?: string;
  };

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [showTimeSlots, setShowTimeSlots] = useState(false);

  // Generate a simplified calendar (1 week)
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const currentDay = today.getDay(); // 0-6 (Sunday-Saturday)
  
  // Mark some days as available
  const daysAvailable = availableDays ? 
    weekDays.map(day => availableDays.includes(day)) : 
    [false, true, true, true, true, true, false]; // Default: Mon-Fri available

  // Generate simplified time slots if none provided
  const defaultTimeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];
  const displayTimeSlots = timeSlots || defaultTimeSlots;

  if (isPreview) {
    return (
      <BaseWidgetCard widget={widget} onEdit={onEdit} onDelete={onDelete} isPreview={isPreview} style={style} className="overflow-hidden">
        <div className="p-4">
          <div className="flex items-center mb-2">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0 text-indigo-500" />
            <div>
              <h3 className="font-medium text-sm truncate">{title || 'Calendar'}</h3>
              {eventName && <p className="text-xs text-muted-foreground truncate">{eventName}</p>}
            </div>
          </div>
          <div className="mt-2 flex justify-between">
            {weekDays.map((day, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="text-xs text-gray-500">{day}</div>
                <div 
                  className={cn(
                    "h-6 w-6 rounded-full flex items-center justify-center text-xs mt-1",
                    index === currentDay ? "bg-indigo-500 text-white" : 
                      daysAvailable[index] ? "bg-indigo-100" : "bg-gray-100"
                  )}
                >
                  {index === currentDay ? today.getDate() : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      </BaseWidgetCard>
    );
  }

  return (
    <BaseWidgetCard 
      widget={widget} 
      onEdit={onEdit} 
      onDelete={onDelete} 
      isPreview={isPreview} 
      style={style} 
      className="overflow-hidden h-full"
    >
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
            <Calendar className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-base">
              {title || eventName || 'Book a time'}
            </h3>
            {timezone && <span className="text-sm text-gray-500">{timezone}</span>}
          </div>
        </div>
        
        {showTimeSlots ? (
          <motion.div 
            className="flex-grow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center mb-2">
              <Clock className="h-4 w-4 mr-1.5 text-gray-500" />
              <p className="text-sm font-medium">
                {format(selectedDate, 'MMM d, yyyy')}
              </p>
              <button 
                className="ml-auto text-xs text-indigo-600 hover:text-indigo-800"
                onClick={() => setShowTimeSlots(false)}
              >
                Back
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {displayTimeSlots.map((time, index) => (
                <motion.a
                  key={index}
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 bg-white border border-gray-200 rounded-md text-sm text-center hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    if (onEdit) e.preventDefault();
                  }}
                >
                  {time}
                </motion.a>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="flex-grow">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day, i) => (
                <div key={i} className="text-center text-xs font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 28 }, (_, i) => {
                const date = new Date(today);
                date.setDate(today.getDate() - today.getDay() + i);
                const isToday = date.toDateString() === today.toDateString();
                const isPast = date < today && !isToday;
                const isAvailable = daysAvailable[date.getDay()] && !isPast;
                
                return (
                  <motion.button
                    key={i}
                    disabled={!isAvailable}
                    className={cn(
                      "h-8 w-8 flex items-center justify-center rounded-full text-sm",
                      isToday ? "bg-indigo-500 text-white" : 
                        isPast ? "text-gray-300" :
                          isAvailable ? "bg-indigo-100 hover:bg-indigo-200 text-indigo-800" : 
                            "text-gray-400"
                    )}
                    whileHover={isAvailable ? { scale: 1.1 } : {}}
                    whileTap={isAvailable ? { scale: 0.95 } : {}}
                    onClick={() => {
                      if (isAvailable) {
                        setSelectedDate(date);
                        setShowTimeSlots(true);
                      }
                    }}
                  >
                    {date.getDate()}
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}
        
        <motion.a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-center rounded-md font-medium text-sm"
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
          onClick={(e) => {
            if (onEdit) e.preventDefault();
          }}
        >
          Book a session
        </motion.a>
      </div>
    </BaseWidgetCard>
  );
};

export default CalendarWidget;
