import React, { useState, useMemo } from 'react';
import {
  Check,
  X,
  Trash2,
  Edit3,
  Quote
} from 'lucide-react';
import type { Goal, Category } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { CategoryIcon } from './CategoryIcon';
import { IconButton } from './IconButton';
import { RoughDivider } from './RoughDivider';

interface GoalItemProps {
  goal: Goal;
  category?: Category;
  isReadOnly?: boolean;
  isLast?: boolean;
  onUpdate: (desc: string) => void;
  onDelete: () => void;
}

const dimensionAccents: Record<Category, { bulletBorder: string; bulletFill: string; quoteColor: string }> = {
  body: {
    bulletBorder: 'border-[#C46345] dark:border-[#E2876B]',
    bulletFill: 'bg-[#C46345]/15 dark:bg-[#E2876B]/20',
    quoteColor: 'text-[#C46345] dark:text-[#E2876B]',
  },
  mind: {
    bulletBorder: 'border-[#557659] dark:border-[#89B08E]',
    bulletFill: 'bg-[#557659]/15 dark:bg-[#89B08E]/20',
    quoteColor: 'text-[#557659] dark:text-[#89B08E]',
  },
  soul: {
    bulletBorder: 'border-[#9E5870] dark:border-[#D48BA3]',
    bulletFill: 'bg-[#9E5870]/15 dark:bg-[#D48BA3]/20',
    quoteColor: 'text-[#9E5870] dark:text-[#D48BA3]',
  },
};

export const GoalItem: React.FC<GoalItemProps> = ({
  goal,
  category = goal.category,
  isReadOnly = false,
  isLast = false,
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

  const cat = category || goal.category;
  const accent = dimensionAccents[cat];

  // Deterministic seed from goal id for unique hand-drawn divider line
  const dividerSeed = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < goal.id.length; i++) {
      hash = (hash << 5) - hash + goal.id.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) % 1000 + 1;
  }, [goal.id]);

  const getStatusBadge = () => {
    switch (goal.status) {
      case 'good':
        return {
          icon: <CategoryIcon category={cat} status="good" size={24} className="w-6 h-6 object-contain" />,
          label: t.status.good,
          classes:
            'bg-[#EAF3EA] dark:bg-[#213224] text-[#355E39] dark:text-[#9RC4A0] dark:text-[#A3CFA7] border border-[#6E9B72]/50 dark:border-[#4E7A52]/60',
        };
      case 'partly':
        return {
          icon: <CategoryIcon category={cat} status="partly" size={24} className="w-6 h-6 object-contain" />,
          label: t.status.partly,
          classes:
            'bg-[#FDF5E6] dark:bg-[#332817] text-[#8A5A14] dark:text-[#F0CF90] border border-[#D4A359]/50 dark:border-[#7A5B22]/60',
        };
      case 'poor':
        return {
          icon: <CategoryIcon category={cat} status="poor" size={24} className="w-6 h-6 object-contain" />,
          label: t.status.poor,
          classes:
            'bg-[#FBECE9] dark:bg-[#361D19] text-[#963628] dark:text-[#F2A79E] border border-[#D98C82]/50 dark:border-[#7A3329]/60',
        };
      default:
        return null;
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="group relative pt-2.5 pb-1 px-1 transition-colors hover:bg-[#F7F1E6]/55 dark:hover:bg-[#2B2520]/50">
      <div className="flex items-start justify-between gap-2.5 relative z-10 pb-2">
        {/* Left Journal Bullet / Status Marker + Goal Text */}
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
              className="w-full text-sm px-3 py-1.5 rounded-xs border border-[#7A6A5E]/35 dark:border-[#EAE2D9]/25 bg-[#F8F3EB] dark:bg-[#1C1916] text-[#332B25] dark:text-[#EAE2D9] font-serif focus:outline-none focus:ring-1 focus:ring-[#C46345]"
            />
            <IconButton
              onClick={handleSaveEdit}
              title={t.actions.save}
              aria-label={t.actions.save}
              variant="primary"
              size="sm"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.2]" />
            </IconButton>
            <IconButton
              onClick={() => setIsEditing(false)}
              title={t.actions.cancel}
              aria-label={t.actions.cancel}
              variant="subtle"
              size="sm"
            >
              <X className="w-3.5 h-3.5 stroke-[2.2]" />
            </IconButton>
          </div>
        ) : (
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
            {/* Hand-drawn bullet journal dot or status icon */}
            <div className="mt-1.5 shrink-0 flex items-center justify-center">
              {statusBadge ? (
                <span className="inline-flex items-center justify-center">
                  {statusBadge.icon}
                </span>
              ) : (
                <span
                  className={`w-2.5 h-2.5 rounded-full border-[1.5px] ${accent.bulletBorder} ${accent.bulletFill} inline-block transition-transform group-hover:scale-110`}
                  aria-hidden="true"
                />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[14.5px] sm:text-[15px] font-serif font-normal leading-relaxed text-[#332B25] dark:text-[#EAE2D9] break-words">
                {goal.description}
              </p>

              {/* Optional Review Status Stamp or Handwritten Reflection Note */}
              {(statusBadge || goal.comment) && (
                <div className="flex flex-col gap-1 mt-1.5">
                  {statusBadge && (
                    <div className="flex items-center">
                      <span
                        className={`px-2 py-0.5 rounded-xs inline-flex items-center gap-1 font-sans font-medium text-2xs ${statusBadge.classes}`}
                      >
                        <span>{statusBadge.label}</span>
                      </span>
                    </div>
                  )}
                  {goal.comment && (
                    <div className="flex items-start gap-1.5 text-[#6E6258] dark:text-[#A89B8F] font-hand text-base sm:text-lg leading-snug pt-0.5">
                      <Quote className={`w-3 h-3 ${accent.quoteColor} shrink-0 mt-1 opacity-75`} />
                      <span>{goal.comment}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action icons (Edit / Delete) - hidden for finished/read-only weeks */}
        {!isEditing && !isReadOnly && (
          <div className="flex items-center gap-1 shrink-0 opacity-75 sm:opacity-65 group-hover:opacity-100 transition-opacity">
            <IconButton
              onClick={() => setIsEditing(true)}
              title={t.actions.edit}
              aria-label={t.actions.edit}
              variant="ghost"
              size="sm"
            >
              <Edit3 className="w-3.5 h-3.5 stroke-[1.9]" />
            </IconButton>
            <IconButton
              onClick={() => {
                if (window.confirm(t.actions.deleteConfirm)) {
                  onDelete();
                }
              }}
              title={t.actions.delete}
              aria-label={t.actions.delete}
              variant="danger"
              size="sm"
            >
              <Trash2 className="w-3.5 h-3.5 stroke-[1.9]" />
            </IconButton>
          </div>
        )}
      </div>

      {/* Hand-sketched pencil rule line separating notebook rows */}
      {!isLast && (
        <RoughDivider
          color="#8C7D71"
          darkColor="#70655B"
          strokeWidth={0.85}
          roughness={1.15}
          bowing={0.65}
          opacity={0.28}
          seed={dividerSeed}
        />
      )}
    </div>
  );
};
