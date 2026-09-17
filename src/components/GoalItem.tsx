import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Trash2, 
  Edit3, 
  Quote
} from 'lucide-react';
import type { Goal, Category } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { RoughBorder } from './RoughBorder';
import { CategoryIcon } from './CategoryIcon';

interface GoalItemProps {
  goal: Goal;
  category?: Category;
  isReadOnly?: boolean;
  onUpdate: (desc: string) => void;
  onDelete: () => void;
}

export const GoalItem: React.FC<GoalItemProps> = ({
  goal,
  category = goal.category,
  isReadOnly = false,
  onUpdate,
  onDelete
}) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(goal.description);

  const handleSaveEdit = () => {
    if (editText.trim() && editText !== goal.description) {
      onUpdate(editText.trim());
    }
    setIsEditing(false);
  };

  const getStatusBadge = () => {
    const cat = category || goal.category;
    switch (goal.status) {
      case 'good':
        return {
          icon: <CategoryIcon category={cat} status="good" size={15} className="w-3.5 h-3.5 object-contain" />,
          label: t.status.good,
          classes: 'bg-[#EEF5ED] dark:bg-[#203322] text-[#2F612C] dark:text-[#A6D6A2] border border-[#7CA379]/60 dark:border-[#537A50]/60'
        };
      case 'partly':
        return {
          icon: <CategoryIcon category={cat} status="partly" size={15} className="w-3.5 h-3.5 object-contain" />,
          label: t.status.partly,
          classes: 'bg-[#FDF7EA] dark:bg-[#342714] text-[#8C5212] dark:text-[#F3D190] border border-[#D4A759]/60 dark:border-[#7A5B22]/60'
        };
      case 'poor':
        return {
          icon: <CategoryIcon category={cat} status="poor" size={15} className="w-3.5 h-3.5 object-contain" />,
          label: t.status.poor,
          classes: 'bg-[#FDF0EE] dark:bg-[#361914] text-[#9E352B] dark:text-[#F3A59C] border border-[#DFA098]/60 dark:border-[#7A3329]/60'
        };
      default:
        return null;
    }
  };

  const statusBadge = getStatusBadge();



  return (
    <div className="group relative p-3 sm:p-3.5 rounded-none bg-white/95 dark:bg-[#1E1B18]/90 sketch-border-sm shadow-pencil-sm hover:shadow-pencil transition-all flex flex-col gap-1.5">
      <RoughBorder borderRadius={0} width={1.0} opacity={0.35} />
      <div className="flex items-start justify-between gap-2.5 relative z-10">
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
              className="w-full text-sm px-3 py-1.5 rounded-none border border-[#574A40]/30 dark:border-[#EDE5DD]/25 bg-white dark:bg-[#25201C] text-[#2D2621] dark:text-[#EDE5DD] focus:outline-none focus:ring-1 focus:ring-[#D7195F]"
            />
            <button
              onClick={handleSaveEdit}
              className="relative p-1.5 rounded-full bg-[#2D2621] dark:bg-[#EDE5DD] text-white dark:text-[#2D2621] hover:opacity-90 sketch-btn-press transition-all shrink-0"
              title={t.actions.save}
              aria-label={t.actions.save}
            >
              <RoughBorder shape="circle" width={0.9} />
              <Check className="w-4 h-4 stroke-[2.2] relative z-10" />
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="relative p-1.5 rounded-full bg-[#EFE6DA] dark:bg-[#3D342E] text-[#2D2621] dark:text-[#EDE5DD] hover:bg-[#E2D6C5] dark:hover:bg-[#4D423B] sketch-btn-press transition-all shrink-0"
              title={t.actions.cancel}
              aria-label={t.actions.cancel}
            >
              <RoughBorder shape="circle" width={0.9} />
              <X className="w-4 h-4 stroke-[2.2] relative z-10" />
            </button>
          </div>
        ) : (
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-sans font-normal leading-relaxed text-[#2D2621] dark:text-[#EDE5DD] break-words">
              {goal.description}
            </p>
          </div>
        )}

        {/* Action icons (Edit / Delete) - hidden for finished/read-only weeks */}
        {!isEditing && !isReadOnly && (
          <div className="flex items-center gap-0.5 opacity-75 sm:opacity-30 sm:group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 text-[#8A796D] hover:text-[#2D2621] dark:hover:text-[#EDE5DD] hover:bg-[#FAF6F0] dark:hover:bg-[#2A2420] active:scale-90 transition-all rounded-full"
              title={t.actions.edit}
              aria-label={t.actions.edit}
            >
              <Edit3 className="w-3.5 h-3.5 stroke-[2]" />
            </button>
            <button
              onClick={() => {
                if (window.confirm(t.actions.deleteConfirm)) {
                  onDelete();
                }
              }}
              className="p-1.5 text-[#8A796D] hover:text-[#B83E32] dark:hover:text-[#F3A59C] hover:bg-[#FDF0EE] dark:hover:bg-[#361914] active:scale-90 transition-all rounded-full"
              title={t.actions.delete}
              aria-label={t.actions.delete}
            >
              <Trash2 className="w-3.5 h-3.5 stroke-[2]" />
            </button>
          </div>
        )}
      </div>

      {/* Optional Note or Status Indicator if goal was reviewed */}
      {(statusBadge || goal.comment) && (
        <div className="flex flex-col gap-1 pt-1.5 border-t border-[#574A40]/15 dark:border-[#EDE5DD]/10 text-2xs">
          {statusBadge && (
            <div className="flex items-center">
              <span className={`px-2 py-0.5 rounded-none inline-flex items-center gap-1 font-sans font-medium text-2xs sketch-border-sm ${statusBadge.classes}`}>
                {statusBadge.icon}
                <span>{statusBadge.label}</span>
              </span>
            </div>
          )}
          {goal.comment && (
            <div className="flex items-start gap-1.5 text-[#6A5C52] dark:text-[#BA9F83] font-hand font-medium text-xs sm:text-sm pt-0.5">
              <Quote className="w-3 h-3 text-[#A88C70] shrink-0 mt-0.5" />
              <span>{goal.comment}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
