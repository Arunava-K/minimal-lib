
import React from 'react';
import { Widget } from '@/types';
import BaseWidgetCard, { BaseWidgetCardProps } from '../BaseWidgetCard';
import { Github, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface GithubWidgetProps extends Omit<BaseWidgetCardProps, 'children'> {}

// Function to generate a sample contribution heatmap
const generateContributionData = (seed: string) => {
  const data: number[] = [];
  // Use the widget ID as seed to generate consistent random data
  const seedNum = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  for (let i = 0; i < 365; i++) {
    // Use a deterministic algorithm based on seed and day
    const dayValue = ((seedNum * (i + 1)) % 100) / 100;
    
    if (dayValue < 0.6) {
      data.push(0); // No contributions
    } else if (dayValue < 0.8) {
      data.push(1); // Light activity
    } else if (dayValue < 0.9) {
      data.push(2); // Medium activity
    } else if (dayValue < 0.95) {
      data.push(3); // High activity
    } else {
      data.push(4); // Very high activity
    }
  }
  
  return data;
};

const GithubWidget: React.FC<GithubWidgetProps> = ({ widget, isPreview, onEdit, onDelete, style }) => {
  const { title, content } = widget;
  const { username, repoCount, followerCount, url } = content as {
    username: string;
    repoCount?: number;
    followerCount?: number;
    url: string;
  };

  // Generate contribution data based on widget ID for consistency
  const contributionData = generateContributionData(widget.id);
  
  // Group the data into weeks (7 days per row)
  const weeks = [];
  for (let i = 0; i < contributionData.length; i += 7) {
    weeks.push(contributionData.slice(i, i + 7));
  }
  
  // Only show the last 52 weeks (one year)
  const displayWeeks = weeks.slice(-52);

  // Colors for the contribution heatmap
  const colors = [
    'bg-gray-100', // No contributions
    'bg-green-100',
    'bg-green-300',
    'bg-green-500',
    'bg-green-700', // Most contributions
  ];

  if (isPreview) {
    return (
      <BaseWidgetCard widget={widget} onEdit={onEdit} onDelete={onDelete} isPreview={isPreview} style={style} className="overflow-hidden">
        <div className="p-4">
          <div className="flex items-center mb-2">
            <Github className="h-4 w-4 mr-2 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-sm truncate">{title || `Github: ${username}`}</h3>
              {followerCount && <p className="text-xs text-muted-foreground truncate">{followerCount} followers</p>}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-0.5">
            {displayWeeks.slice(0, 10).map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-0.5">
                {week.map((value, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`h-2 w-2 rounded-sm ${colors[value]}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </BaseWidgetCard>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full w-full no-underline text-current group/githubwidget"
      onClick={(e) => { 
        if (!onEdit) return; 
        e.preventDefault(); 
      }}
    >
      <BaseWidgetCard 
        widget={widget} 
        onEdit={onEdit} 
        onDelete={onDelete} 
        isPreview={isPreview} 
        style={style} 
        className="group-hover/githubwidget:ring-2 group-hover/githubwidget:ring-gray-800/30 overflow-hidden h-full"
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
              <Github className="h-6 w-6 text-gray-800" />
            </div>
            <div>
              <h3 className="font-semibold text-base group-hover/githubwidget:text-gray-800 transition-colors">
                {username}
              </h3>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                {repoCount && <span>{repoCount} repos</span>}
                {followerCount && <span>{followerCount} followers</span>}
              </div>
            </div>
          </div>
          
          <div className="mt-2">
            <p className="text-xs font-medium text-gray-500 mb-2">Contribution activity</p>
            <div className="flex flex-wrap gap-0.5">
              {displayWeeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-0.5">
                  {week.map((value, dayIndex) => (
                    <motion.div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`h-2 w-2 rounded-sm ${colors[value]}`}
                      whileHover={{ scale: 1.5 }}
                      transition={{ duration: 0.2 }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </BaseWidgetCard>
    </a>
  );
};

export default GithubWidget;
