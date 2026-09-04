import { useMemo, useState } from "react";
import { Card } from "./ui/Card.jsx";
import { getISTDate, getISTDateString, formatISTDate } from "../lib/timezone.js";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";

export function ActivityHeatmap({ results }) {
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [viewStart, setViewStart] = useState(() => {
    const today = getISTDate();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364);
    const dayOfWeek = startDate.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(startDate.getDate() - daysToMonday);
    return startDate;
  });
  
  // Process activity data with detailed information
  const activityData = useMemo(() => {
    if (!results || results.length === 0) return new Map();
    
    const activity = new Map();
    results.forEach(result => {
      const dateStr = getISTDateString(result.id);
      if (!activity.has(dateStr)) {
        activity.set(dateStr, {
          tests: 0,
          questions: 0,
          totalScore: 0,
          totalPossible: 0,
          focusTime: 0
        });
      }
      const current = activity.get(dateStr);
      current.tests++;
      current.questions += result.total || 0;
      current.totalScore += result.score || 0;
      current.totalPossible += result.total || 0;
    });
    return activity;
  }, [results]);
  
  // Generate heatmap grid for last 52 weeks (1 year) - GitHub style
  const heatmapData = useMemo(() => {
    const today = getISTDate();
    const startDate = new Date(viewStart);
    
    const grid = [];
    const monthLabels = [];
    let lastMonth = -1;
    
    for (let week = 0; week < 52; week++) {
      for (let day = 0; day < 7; day++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + (week * 7 + day));
        const dateStr = date.toDateString();
        const activity = activityData.get(dateStr) || { tests: 0, questions: 0, totalScore: 0, totalPossible: 0, focusTime: 0 };
        
        // Track month labels (GitHub style - show at first week of each month)
        const currentMonth = date.getMonth();
        if (currentMonth !== lastMonth && day === 0) {
          monthLabels.push({ week, month: currentMonth, year: date.getFullYear() });
          lastMonth = currentMonth;
        }
        
        // Determine activity level (0-4) - GitHub style
        let level = 0;
        if (activity.tests > 0) {
          if (activity.tests >= 10) level = 4;
          else if (activity.tests >= 6) level = 3;
          else if (activity.tests >= 3) level = 2;
          else level = 1;
        }
        
        const isToday = date.toDateString() === today.toDateString();
        const isFuture = date > today;
        
        grid.push({
          date,
          dateStr,
          activity,
          level,
          isToday,
          isFuture,
          week,
          day
        });
      }
    }
    
    return { grid, monthLabels, today, startDate };
  }, [activityData, viewStart]);
  
  const getActivityColor = (level) => {
    switch (level) {
      case 0: return 'bg-[var(--activity-0)]';
      case 1: return 'bg-[var(--activity-1)]';
      case 2: return 'bg-[var(--activity-2)]';
      case 3: return 'bg-[var(--activity-3)]';
      case 4: return 'bg-[var(--activity-4)]';
      default: return 'bg-[var(--activity-0)]';
    }
  };
  
  const handleDayClick = (dateData) => {
    if (dateData.activity.tests > 0) {
      setSelectedDate(dateData);
    } else {
      setSelectedDate(null);
    }
  };
  
  const closeTooltip = () => {
    setShowTooltip(false);
    setHoveredDate(null);
  };
  
  const handleDayHover = (dateData, event) => {
    if (dateData.activity.tests > 0) {
      setHoveredDate(dateData);
      setTooltipPosition({ x: event.clientX, y: event.clientY });
      setShowTooltip(true);
    } else {
      setHoveredDate(null);
      setShowTooltip(false);
    }
  };
  
  const getDisplayDate = (dateData) => hoveredDate || selectedDate;
  
  const navigate = (direction) => {
    const newStart = new Date(viewStart);
    newStart.setDate(newStart.getDate() + (direction * 28)); // Move by 4 weeks
    setViewStart(newStart);
  };
  
  const goToToday = () => {
    const today = getISTDate();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364);
    const dayOfWeek = startDate.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(startDate.getDate() - daysToMonday);
    setViewStart(startDate);
  };
  
  const monthNames = ["January", "February", "March", "April", "May", "June", 
                      "July", "August", "September", "October", "November", "December"];
  
  const monthOptions = useMemo(() => {
    const options = [];
    const currentYear = viewStart.getFullYear();
    for (let y = currentYear - 1; y <= currentYear + 1; y++) {
      monthNames.forEach((name, index) => {
        options.push(
          <option key={`${y}-${index}`} value={`${index}-${y}`}>
            {name} {y}
          </option>
        );
      });
    }
    return options;
  }, [viewStart.getFullYear()]);
  
  return (
    <Card className="p-4" style={{ background: 'var(--card-bg)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="text-[var(--text-primary)] font-semibold text-sm">Activity Calendar</div>
          <Info size={14} className="text-[var(--text-muted)]" />
        </div>
        <div className="text-[10px] text-[var(--text-muted)]">
          All dates in IST (GMT +5:30)
        </div>
      </div>
      
      {/* Navigation Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate(-1)}
            className="p-1.5 hover:bg-[var(--hover-bg)] rounded transition-colors"
            title="Previous period"
          >
            <ChevronLeft size={16} className="text-[var(--text-muted)]" />
          </button>
          <button 
            onClick={() => navigate(1)}
            className="p-1.5 hover:bg-[var(--hover-bg)] rounded transition-colors"
            title="Next period"
          >
            <ChevronRight size={16} className="text-[var(--text-muted)]" />
          </button>
          <select 
            value={`${heatmapData.startDate.getMonth()}-${heatmapData.startDate.getFullYear()}`}
            onChange={(e) => {
              const [month, year] = e.target.value.split('-').map(Number);
              const newStart = new Date(year, month, 1);
              const dayOfWeek = newStart.getDay();
              const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
              newStart.setDate(newStart.getDate() - daysToMonday);
              setViewStart(newStart);
            }}
            className="bg-[var(--elevated-bg)] border border-[var(--border)] rounded px-2 py-1 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--danger-text)]"
          >
            {monthOptions}
          </select>
        </div>
        <button 
          onClick={goToToday}
          className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          Today
        </button>
      </div>
      
      {/* Month labels - GitHub style */}
      <div className="flex text-[10px] text-[var(--text-muted)] mb-2 pl-8">
        {heatmapData.monthLabels.map((label, index) => {
          const prevWeek = index > 0 ? heatmapData.monthLabels[index - 1].week : 0;
          const marginLeft = index === 0 ? 0 : (label.week - prevWeek) * 12;
          
          return (
            <span 
              key={`${label.year}-${label.month}`} 
              className="text-center"
              style={{ 
                marginLeft: `${marginLeft}px`,
                minWidth: '28px'
              }}
            >
              {formatISTDate(new Date(label.year, label.month), { month: 'short' })}
            </span>
          );
        })}
      </div>
      
      {/* Day labels and heatmap grid - GitHub style */}
      <div className="flex gap-1">
        {/* Weekday labels */}
        <div className="w-8 flex flex-col justify-between text-[10px] text-[var(--text-muted)] pr-2">
          <span className="h-3">Mon</span>
          <span className="h-3">Wed</span>
          <span className="h-3">Fri</span>
        </div>
        
        {/* Heatmap grid - 52 columns x 7 rows */}
        <div className="flex-1 grid grid-cols-52 gap-1">
          {heatmapData.grid.map((cell, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-sm cursor-pointer transition-all hover:scale-110 hover:opacity-80 ${
                cell.isFuture ? 'bg-transparent' : getActivityColor(cell.level)
              } ${cell.isToday ? 'ring-1 ring-[var(--danger-text)] ring-offset-1' : ''}`}
              onMouseEnter={(e) => handleDayHover(cell, e)}
              onMouseLeave={closeTooltip}
              onClick={() => handleDayClick(cell)}
            />
          ))}
        </div>
      </div>
      
      {/* Legend - GitHub style */}
      <div className="flex items-center justify-between mt-4 text-xs text-[var(--text-muted)]">
        <span>Less</span>
        <div className="flex gap-1 items-center">
          <div className="w-3 h-3 rounded-sm bg-[var(--activity-0)]" />
          <span className="text-[10px]">No Activity</span>
          <div className="w-3 h-3 rounded-sm bg-[var(--activity-1)] ml-2" />
          <span className="text-[10px]">1-2</span>
          <div className="w-3 h-3 rounded-sm bg-[var(--activity-2)] ml-2" />
          <span className="text-[10px]">3-5</span>
          <div className="w-3 h-3 rounded-sm bg-[var(--activity-3)] ml-2" />
          <span className="text-[10px]">6-10</span>
          <div className="w-3 h-3 rounded-sm bg-[var(--activity-4)] ml-2" />
          <span className="text-[10px]">10+</span>
        </div>
        <span>More</span>
      </div>
      
      <div className="flex items-center justify-between mt-2">
        <div className="text-[10px] text-[var(--text-muted)]">
          Hover on a day to see details.
        </div>
        <div className="text-[10px] text-[var(--text-muted)]">
          {heatmapData.grid.filter(cell => !cell.isFuture).length} days total
        </div>
      </div>
      
      {/* Floating Tooltip */}
      {showTooltip && hoveredDate && (
        <div 
          className="fixed bg-[var(--elevated-bg)] border border-[var(--border)] rounded-lg p-3 shadow-xl z-50 pointer-events-none"
          style={{ 
            left: `${tooltipPosition.x + 10}px`, 
            top: `${tooltipPosition.y + 10}px`,
            maxWidth: '250px'
          }}
        >
          <div className="text-[var(--text-primary)] font-semibold text-xs mb-2">
            {formatISTDate(hoveredDate.date, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[var(--text-muted)]">Tests:</span>
              <span className="text-[var(--text-primary)] font-semibold ml-1">{hoveredDate.activity.tests}</span>
            </div>
            <div>
              <span className="text-[var(--text-muted)]">Questions:</span>
              <span className="text-[var(--text-primary)] font-semibold ml-1">{hoveredDate.activity.questions}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Day details popup - GitHub style tooltip */}
      {selectedDate && (
        <div className="mt-4 p-3 bg-[var(--elevated-bg)] rounded-lg border border-[var(--border)]">
          <div className="text-[var(--text-primary)] font-semibold text-sm mb-2">
            {formatISTDate(selectedDate.date, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[var(--text-muted)]">Tests Completed:</span>
              <span className="text-[var(--text-primary)] font-semibold ml-1">{selectedDate.activity.tests}</span>
            </div>
            <div>
              <span className="text-[var(--text-muted)]">Questions Solved:</span>
              <span className="text-[var(--text-primary)] font-semibold ml-1">{selectedDate.activity.questions}</span>
            </div>
            {selectedDate.activity.totalPossible > 0 && (
              <>
                <div>
                  <span className="text-[var(--text-muted)]">Score:</span>
                  <span className="text-[var(--text-primary)] font-semibold ml-1">
                    {Math.round((selectedDate.activity.totalScore / selectedDate.activity.totalPossible) * 100)}%
                  </span>
                </div>
                <div>
                  <span className="text-[var(--text-muted)]">Accuracy:</span>
                  <span className="text-[var(--text-primary)] font-semibold ml-1">
                    {Math.round((selectedDate.activity.totalScore / selectedDate.activity.totalPossible) * 100)}%
                  </span>
                </div>
              </>
            )}
          </div>
          <button 
            className="mt-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            onClick={() => setSelectedDate(null)}
          >
            Close
          </button>
        </div>
      )}
    </Card>
  );
}