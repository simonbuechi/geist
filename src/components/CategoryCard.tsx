import React, { useState } from 'react';
import { 
  Plus, 
  Check, 
  X
} from 'lucide-react';
import type { Category } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useGoals } from '../context/GoalsContext';
import { GoalItem } from './GoalItem';
import { CategoryIcon } from './CategoryIcon';
import { RoughBorder } from './RoughBorder';
import { RoughNotationHighlight } from './RoughNotationHighlight';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const { t } = useLanguage();
  const { 
    currentWeekPlan, 
    addGoal, 
    updateGoal, 
    deleteGoal 
  } = useGoals();

  const [isAdding, setIsAdding] = useState(false);
  const [newGoalText, setNewGoalText] = useState('');

  // Filter goals for this category
  const categoryGoals = currentWeekPlan.goals.filter(g => g.category === category);
  const categoryInfo = t.categories[category];

  const handleAddGoal = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (newGoalText.trim()) {
      addGoal(category, newGoalText.trim());
      setNewGoalText('');
      setIsAdding(false);
    }
  };

  // Unified theme configuration across Körper, Geist, Seele using primary color (#D7195F)
  const unifiedTheme = {
    accentColor: 'text-[#D7195F] dark:text-[#F472B6]',
    roughColor: '#D7195F',
    headerBg: 'bg-[#FAF2F5] dark:bg-[#2A1C22]',
    headerBorder: 'border-b border-[#D7195F]/20 dark:border-[#F472B6]/20',
    stickyBg: 'bg-[#FDF7FA] dark:bg-[#26171E]',
    cardBorder: 'border-[#D7195F]/35 hover:border-[#D7195F]/60 dark:border-[#F472B6]/25 dark:hover:border-[#F472B6]/45',
    badgeBg: 'bg-[#FAF0F4] dark:bg-[#3E1C27] text-[#D7195F] dark:text-[#F5C7D4]',
    quickAddBg: 'hover:bg-[#FAF0F4] text-[#D7195F] dark:text-[#F472B6]',
    btnBg: 'bg-gradient-to-r from-[#9123A6] to-[#D7195F] hover:opacity-95 text-white',
    focusRing: 'focus:ring-[#D7195F]/25 focus:border-[#D7195F]',
  };

  const themeMap = {
    body: unifiedTheme,
    mind: unifiedTheme,
    soul: unifiedTheme,
  };

  const currentTheme = themeMap[category];
  const goodCount = categoryGoals.filter(g => g.status === 'good').length;
  const isFinished = Boolean(currentWeekPlan.reviewedAt);

  return (
    <div className="relative flex flex-col h-full bg-[#FFFEFB] dark:bg-[#221E1B] rounded-none shadow-pencil transition-all">
      {/* Rough.js Hand-Sketched Contour Border in Light Grey like the other boxes */}
      <RoughBorder
        color="#574A40"
        darkColor="#EDE5DD"
        width={1.4}
        roughness={1.5}
        bowing={1.2}
        opacity={0.4}
      />

      {/* Category Header with Warm Tinted Background Color */}
      <div className={`relative p-3.5 sm:p-4 flex items-center justify-between gap-2.5 overflow-hidden ${currentTheme.headerBg} ${currentTheme.headerBorder}`}>
        <div className="relative z-10 flex items-center gap-2.5 sm:gap-3">
          <div className="shrink-0 flex items-center justify-center">
            <CategoryIcon category={category} variant="base" size={40} className="w-9 h-9 sm:w-10 sm:h-10" />
          </div>
          <div className="flex items-center gap-2">
            <RoughNotationHighlight
              trigger="both"
              animationDuration={450}
              padding={[1, 5, 2, 5]}
              className="cursor-pointer"
            >
              <h2 className="text-xl sm:text-2xl font-hand font-bold tracking-wide text-[#2D2621] dark:text-[#EDE5DD]">
                {categoryInfo.title}
              </h2>
            </RoughNotationHighlight>
            <span className={`text-2xs px-2 py-0.5 rounded-none font-sans font-semibold ${currentTheme.badgeBg}`}>
              {categoryGoals.length} {categoryGoals.length === 1 ? 'Ziel' : 'Ziele'}
            </span>
          </div>
        </div>

        {/* Quick Add Button - only for unfinished weeks */}
        {!isFinished && (
          <button
            onClick={() => setIsAdding(!isAdding)}
            title={t.actions.addGoal}
            aria-label={t.actions.addGoal}
            className={`relative z-10 p-1.5 rounded-full transition-all sketch-btn-press shrink-0 ${
              isAdding
                ? 'bg-[#EFE6DA] dark:bg-[#3D342E] text-[#2D2621] dark:text-[#EDE5DD]'
                : `${currentTheme.quickAddBg} bg-white/90 dark:bg-[#2D2621] shadow-pencil-sm`
            }`}
          >
            <RoughBorder shape="circle" width={1.0} opacity={0.4} />
            <span className="relative z-10 block">{isAdding ? <X className="w-4 h-4 stroke-[2]" /> : <Plus className="w-4 h-4 stroke-[2]" />}</span>
          </button>
        )}
      </div>

      {/* Goals List */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col gap-2.5 overflow-y-auto">
        {/* Inline Add Form - Notebook Sticky Note Style with Warm Tinted Background (only for active weeks) */}
        {isAdding && !isFinished && (
          <form onSubmit={handleAddGoal} className={`relative p-3.5 rounded-none ${currentTheme.stickyBg} border border-dashed border-[#574A40]/30 dark:border-[#EDE5DD]/25 flex flex-col gap-2.5 animate-slide-up shadow-pencil-sm overflow-hidden`}>
            <textarea
              value={newGoalText}
              onChange={(e) => setNewGoalText(e.target.value)}
              placeholder={categoryInfo.placeholder}
              rows={2}
              autoFocus
              className={`relative z-10 w-full text-sm p-3 rounded-none border border-[#574A40]/30 dark:border-[#EDE5DD]/25 bg-white/95 dark:bg-[#1E1B18] text-[#2D2621] dark:text-[#EDE5DD] placeholder-[#8A796D] focus:outline-none focus:ring-1 ${currentTheme.focusRing} font-sans`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddGoal();
                }
              }}
            />
            <div className="relative z-10 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3.5 py-1.5 rounded-none text-xs text-[#6A5C52] dark:text-[#BA9F83] hover:bg-[#EFE6DA] dark:hover:bg-[#382E28] transition-all font-medium"
              >
                {t.actions.cancel}
              </button>
              <button
                type="submit"
                disabled={!newGoalText.trim()}
                className={`relative px-4 py-1.5 rounded-none ${currentTheme.btnBg} shadow-pencil-sm sketch-btn-press disabled:opacity-50 text-sm font-hand font-bold flex items-center gap-1.5 transition-all`}
              >
                <RoughBorder borderRadius={0} width={1.0} opacity={0.4} />
                <Check className="w-3.5 h-3.5 stroke-[2.2] relative z-10" />
                <span className="relative z-10">{t.actions.save}</span>
              </button>
            </div>
          </form>
        )}

        {categoryGoals.length === 0 && !isAdding ? (
          isFinished ? (
            <div className="flex-1 min-h-[120px] flex flex-col items-center justify-center p-6 border border-dashed border-[#574A40]/20 dark:border-[#EDE5DD]/15 rounded-none text-center">
              <p className="text-sm sm:text-base text-[#8A796D] dark:text-[#BA9F83] font-hand italic max-w-[200px]">
                {t.emptyCategory}
              </p>
            </div>
          ) : (
            <div 
              onClick={() => setIsAdding(true)}
              className="flex-1 min-h-[140px] flex flex-col items-center justify-center p-6 border border-dashed border-[#574A40]/30 dark:border-[#EDE5DD]/25 rounded-none cursor-pointer hover:border-[#574A40]/60 dark:hover:border-[#EDE5DD]/50 group transition-all text-center"
            >
              <div className="w-10 h-10 rounded-full bg-[#FAF6F0] dark:bg-[#2D2621] border border-[#574A40]/25 dark:border-[#EDE5DD]/20 flex items-center justify-center text-[#8A796D] dark:text-[#BA9F83] group-hover:text-[#2D2621] dark:group-hover:text-[#EDE5DD] group-hover:scale-110 transition-all mb-2 shadow-pencil-sm">
                <Plus className="w-5 h-5 stroke-[2]" />
              </div>
              <p className="text-sm sm:text-base text-[#6A5C52] dark:text-[#BA9F83] font-hand font-medium max-w-[200px]">
                {t.emptyCategory}
              </p>
            </div>
          )
        ) : (
          categoryGoals.map(goal => (
            <GoalItem
              key={goal.id}
              goal={goal}
              category={category}
              isReadOnly={isFinished}
              onUpdate={(desc) => updateGoal(goal.id, desc)}
              onDelete={() => deleteGoal(goal.id)}
            />
          ))
        )}
      </div>

      {/* Footer / Quick Add Trigger Bar */}
      {!isAdding && categoryGoals.length > 0 && (
        <div className="px-3.5 py-2 bg-[#FAF6F0]/80 dark:bg-[#1E1B18]/70 border-t border-[#574A40]/15 dark:border-[#EDE5DD]/10 flex items-center justify-between text-2xs">
          {!isFinished ? (
            <button
              onClick={() => setIsAdding(true)}
              className="py-1 px-2 -ml-1 text-sm font-hand font-bold text-[#6A5C52] dark:text-[#BA9F83] hover:text-[#2D2621] dark:hover:text-[#EDE5DD] rounded-none active:bg-[#EFE6DA] dark:active:bg-[#2D2621] flex items-center gap-1 transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{t.actions.addGoal}</span>
            </button>
          ) : (
            <div />
          )}
          {goodCount > 0 && (
            <span className={`text-2xs font-sans font-semibold ${currentTheme.accentColor} ml-auto`}>
              {goodCount} / {categoryGoals.length} {t.stats.goalsCompleted}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
