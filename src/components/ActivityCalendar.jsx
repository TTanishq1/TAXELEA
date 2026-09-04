import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "./ui/Card.jsx";
import { getISTDate, getISTDateString, formatISTDate } from "../lib/timezone.js";

export function ActivityCalendar({ results }) {
  const [currentDate, setCurrentDate] = useState(() => getISTDate());
  
  const activityData = useMemo(() => {
    if (!results || results.length === 0) return {};
    
    const activity = {};
    results.forEach(result => {
      const date = getISTDateString(result.id);
      activity[date] = (activity[date] || 0) + 1;
    });
    return activity;
  }, [results]);

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startDay = firstDay.getDay(); // 0 = Sunday
    const totalDays = lastDay.getDate();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      days.push({ day: null, date: null });
    }
    
    // Add days of the month
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toDateString();
      days.push({
        day,
        date: dateStr,
        hasActivity: activityData[dateStr] > 0,
        activityCount: activityData[dateStr] || 0
      });
    }
    
    return days;
  }, [currentDate, activityData]);

  const monthNames = ["January", "February", "March", "April", "May", "June", 
                      "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const isToday = (dateStr) => {
    return dateStr === getISTDate().toDateString();
  };

  const getActivityColor = (count) => {
    if (count === 0) return 'bg-[var(--activity-0)]';
    if (count === 1) return 'bg-[var(--activity-1)]';
    if (count === 2) return 'bg-[var(--activity-2)]';
    return 'bg-[var(--activity-3)]';
  };

  return (
    <Card className="p-3 sm:p-4" style={{ background: 'var(--card-bg)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[var(--text-primary)] font-semibold text-xs">Activity Calendar</div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigateMonth(-1)}
            className="p-1 hover:bg-[var(--hover-bg)] rounded transition-colors"
          >
            <ChevronLeft size={14} className="text-[var(--text-muted)]" />
          </button>
          <div className="text-[var(--text-primary)] font-semibold text-xs min-w-[120px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
          <button 
            onClick={() => navigateMonth(1)}
            className="p-1 hover:bg-[var(--hover-bg)] rounded transition-colors"
          >
            <ChevronRight size={14} className="text-[var(--text-muted)]" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0.5 mb-1.5">
        {dayNames.map((day, index) => (
          <div key={`day-${index}`} className="text-[8px] text-[var(--text-muted)] text-center font-medium">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {calendarDays.map((day, index) => (
          <div
            key={day.date || `empty-${index}`}
            className={`
              aspect-square flex items-center justify-center rounded text-[10px] font-medium relative
              ${day.day === null ? 'invisible' : 'cursor-pointer hover:bg-[var(--hover-bg)] transition-colors'}
              ${isToday(day.date) ? 'bg-[var(--danger-text)] text-white ring-1 ring-[var(--danger-text)]/50' : ''}
              ${day.hasActivity && !isToday(day.date) ? getActivityColor(day.activityCount) + ' text-white' : ''}
              ${!day.hasActivity && !isToday(day.date) && day.day !== null ? 'bg-[var(--elevated-bg)] text-[var(--text-muted)]' : ''}
            `}
          >
            {day.day !== null && (
              <>
                <span>{day.day}</span>
                {day.hasActivity && day.activityCount > 1 && (
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[var(--danger-text)] rounded-full flex items-center justify-center text-[7px] text-white font-bold">
                    {day.activityCount}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-3 pt-2 border-t border-[var(--border)]">
        <div className="flex items-center gap-1.5 text-[8px] text-[var(--text-muted)]">
          <div className="w-2 h-2 rounded bg-[var(--elevated-bg)]"></div>
          <span>No Activity</span>
        </div>
        <div className="flex items-center gap-1.5 text-[8px] text-[var(--text-muted)]">
          <div className="w-2 h-2 rounded bg-[var(--activity-1)]"></div>
          <span>Low</span>
        </div>
        <div className="flex items-center gap-1.5 text-[8px] text-[var(--text-muted)]">
          <div className="w-2 h-2 rounded bg-[var(--activity-2)]"></div>
          <span>Moderate</span>
        </div>
        <div className="flex items-center gap-1.5 text-[8px] text-[var(--text-muted)]">
          <div className="w-2 h-2 rounded bg-[var(--activity-3)]"></div>
          <span>High</span>
        </div>
      </div>
    </Card>
  );
}
