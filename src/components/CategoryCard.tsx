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

  // Unified Visual Theme Configuration using Primary Colors (Button Palette)
  const theme = {
    icon: <CategoryIcon category={category} size={18} className="w-4 h-4 text-[#9123A6] dark:text-[#f472b6]" />,
    gradient: 'from-[#9123A6]/10 via-[#D7195F]/5 to-transparent',
    border: 'border-stone-200/80 dark:border-stone-800/80',
    hoverBorder: 'hover:border-[#9123A6]/40 dark:hover:border-[#9123A6]/40',
    badgeBg: 'bg-pink-100/70 dark:bg-pink-950/60 text-[#9123A6] dark:text-[#f8d2e8]'
  };

  const goodCount = categoryGoals.filter(g => g.status === 'good').length;

  return (
    <div className={`flex flex-col h-full rounded-3xl bg-white dark:bg-[#161c19] border ${theme.border} ${theme.hoverBorder} shadow-2xs transition-all overflow-hidden`}>
      {/* Category Header */}
      <div className={`p-3.5 sm:p-4 bg-gradient-to-b ${theme.gradient} border-b border-stone-200/60 dark:border-stone-800/60 flex items-center justify-between gap-2.5`}>
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-white dark:bg-stone-800 shadow-2xs border border-stone-200/60 dark:border-stone-700/60 shrink-0">
            {theme.icon}
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-serif font-semibold tracking-tight text-stone-900 dark:text-stone-50">
              {categoryInfo.title}
            </h2>
            <span className={`text-2xs px-2 py-0.5 rounded-full font-medium ${theme.badgeBg}`}>
              {categoryGoals.length} {categoryGoals.length === 1 ? 'Ziel' : 'Ziele'}
            </span>
          </div>
        </div>

        {/* Quick Add Button */}
        <button
          onClick={() => setIsAdding(!isAdding)}
          title={t.actions.addGoal}
          aria-label={t.actions.addGoal}
          className={`p-1.5 rounded-lg transition-all active:scale-90 shrink-0 ${
            isAdding
              ? 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          {isAdding ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Goals List */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col gap-2.5 overflow-y-auto">
        {/* Inline Add Form */}
        {isAdding && (
          <form onSubmit={handleAddGoal} className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/90 border border-dashed border-stone-300 dark:border-stone-700 flex flex-col gap-2.5 animate-slide-up">
            <textarea
              value={newGoalText}
              onChange={(e) => setNewGoalText(e.target.value)}
              placeholder={categoryInfo.placeholder}
              rows={2}
              autoFocus
              className="w-full text-sm p-2.5 sm:p-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#9123A6]/30 focus:border-[#9123A6]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddGoal();
                }
              }}
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3.5 py-2 sm:py-1.5 rounded-xl text-xs text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 active:scale-95 transition-all"
              >
                {t.actions.cancel}
              </button>
              <button
                type="submit"
                disabled={!newGoalText.trim()}
                className="px-4 py-2 sm:py-1.5 rounded-xl bg-gradient-to-r from-[#9123A6] to-[#D7195F] hover:from-[#7e1c91] hover:to-[#c21453] disabled:opacity-50 text-white text-xs font-medium active:scale-95 transition-all shadow-2xs flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{t.actions.save}</span>
              </button>
            </div>
          </form>
        )}

        {categoryGoals.length === 0 && !isAdding ? (
          <div 
            onClick={() => setIsAdding(true)}
            className="flex-1 min-h-[140px] flex flex-col items-center justify-center p-6 border-2 border-dashed border-stone-200 dark:border-stone-800/80 rounded-2xl cursor-pointer hover:border-stone-300 dark:hover:border-stone-700 group transition-all text-center"
          >
            <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-200 group-hover:scale-110 transition-all mb-2">
              <Plus className="w-5 h-5" />
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-sans max-w-[200px]">
              {t.emptyCategory}
            </p>
          </div>
        ) : (
          categoryGoals.map(goal => (
            <GoalItem
              key={goal.id}
              goal={goal}
              onUpdate={(desc) => updateGoal(goal.id, desc)}
              onDelete={() => deleteGoal(goal.id)}
            />
          ))
        )}
      </div>

      {/* Footer / Quick Add Trigger Bar */}
      {!isAdding && categoryGoals.length > 0 && (
        <div className="px-3 py-2 bg-stone-50/50 dark:bg-stone-900/40 border-t border-stone-100 dark:border-stone-800/50 flex items-center justify-between text-2xs">
          <button
            onClick={() => setIsAdding(true)}
            className="py-1 px-1.5 -ml-1 text-2xs font-medium text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white rounded-lg active:bg-stone-200/60 dark:active:bg-stone-800 flex items-center gap-1 active:scale-95 transition-all"
          >
            <Plus className="w-3 h-3" />
            <span>{t.actions.addGoal}</span>
          </button>
          {goodCount > 0 && (
            <span className="text-2xs text-[#9123A6] dark:text-[#f472b6] font-medium">
              {goodCount} / {categoryGoals.length} {t.stats.goalsCompleted}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
