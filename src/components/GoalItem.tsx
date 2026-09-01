import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  MinusCircle, 
  XCircle,
  Quote
} from 'lucide-react';
import type { Goal } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface GoalItemProps {
  goal: Goal;
  onUpdate: (description: string) => void;
  onDelete: () => void;
}

export const GoalItem: React.FC<GoalItemProps> = ({
  goal,
  onUpdate,
  onDelete
}) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(goal.description);

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onUpdate(editText.trim());
      setIsEditing(false);
    }
  };

  // Read-only status badge (only shown if already reviewed)
  const getStatusBadge = () => {
    switch (goal.status) {
      case 'good':
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
          label: t.status.good,
          classes: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
        };
      case 'partly':
        return {
          icon: <MinusCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
          label: t.status.partly,
          classes: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
        };
      case 'poor':
        return {
          icon: <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />,
          label: t.status.poor,
          classes: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60'
        };
      default:
        return null;
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="group relative p-3.5 rounded-2xl bg-white/80 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800/80 hover:border-stone-300 dark:hover:border-stone-700 shadow-2xs hover:shadow-xs transition-all flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        {/* Description / Edit Mode */}
        {isEditing ? (
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveEdit();
                if (e.key === 'Escape') setIsEditing(false);
              }}
              autoFocus
              className="w-full text-sm px-3 py-1.5 sm:py-2 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
            />
            <button
              onClick={handleSaveEdit}
              className="p-2 sm:p-1.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:opacity-90 active:scale-95 transition-all shrink-0"
              title={t.actions.save}
              aria-label={t.actions.save}
            >
              <Check className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="p-2 sm:p-1.5 rounded-xl bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-600 active:scale-95 transition-all shrink-0"
              title={t.actions.cancel}
              aria-label={t.actions.cancel}
            >
              <X className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            </button>
          </div>
        ) : (
          <p className="text-xs sm:text-sm font-normal leading-relaxed text-stone-800 dark:text-stone-200 flex-1 break-words">
            {goal.description}
          </p>
        )}

        {/* Action icons (Edit / Delete) */}
        {!isEditing && (
          <div className="flex items-center gap-0.5 opacity-80 sm:opacity-40 sm:group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 active:scale-90 transition-all rounded-lg"
              title={t.actions.edit}
              aria-label={t.actions.edit}
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                if (window.confirm(t.actions.deleteConfirm)) {
                  onDelete();
                }
              }}
              className="p-1.5 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 active:scale-90 transition-all rounded-lg"
              title={t.actions.delete}
              aria-label={t.actions.delete}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Optional Note or Status Indicator if goal was reviewed */}
      {(statusBadge || goal.comment) && (
        <div className="flex flex-col gap-1 pt-1.5 border-t border-stone-100 dark:border-stone-800/60 text-2xs">
          {statusBadge && (
            <div className="flex items-center">
              <span className={`px-1.5 py-0.5 rounded-md border inline-flex items-center gap-1 font-medium ${statusBadge.classes}`}>
                {statusBadge.icon}
                <span>{statusBadge.label}</span>
              </span>
            </div>
          )}
          {goal.comment && (
            <div className="flex items-start gap-1 text-stone-500 dark:text-stone-400 italic font-serif text-2xs">
              <Quote className="w-2.5 h-2.5 text-stone-400 shrink-0 mt-0.5" />
              <span>{goal.comment}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
