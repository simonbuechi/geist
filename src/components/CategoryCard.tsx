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

  // Visual Theme Configuration per Category
  const getCategoryTheme = () => {
    switch (category) {
      case 'body':
        return {
          icon: <CategoryIcon category="body" className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
          gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
          border: 'border-emerald-200/80 dark:border-emerald-900/60',
          badgeBg: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300',
          hoverBorder: 'hover:border-emerald-400 dark:hover:border-emerald-800'
        };
      case 'mind':
        return {
          icon: <CategoryIcon category="mind" className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
          gradient: 'from-sky-500/10 via-blue-500/5 to-transparent',
          border: 'border-sky-200/80 dark:border-sky-900/60',
          badgeBg: 'bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300',
          hoverBorder: 'hover:border-sky-400 dark:hover:border-sky-800'
        };
      case 'soul':
        return {
          icon: <CategoryIcon category="soul" className="w-5 h-5 text-violet-600 dark:text-violet-400" />,
          gradient: 'from-violet-500/10 via-purple-500/5 to-transparent',
          border: 'border-violet-200/80 dark:border-violet-900/60',
          badgeBg: 'bg-violet-100 dark:bg-violet-950/80 text-violet-800 dark:text-violet-300',
          hoverBorder: 'hover:border-violet-400 dark:hover:border-violet-800'
        };
    }
  };

  const theme = getCategoryTheme();
  const goodCount = categoryGoals.filter(g => g.status === 'good').length;

  return (
    <div className={`flex flex-col h-full rounded-3xl bg-white dark:bg-[#161c19] border ${theme.border} ${theme.hoverBorder} shadow-sm transition-all overflow-hidden`}>
      {/* Category Header */}
      <div className={`p-5 bg-gradient-to-b ${theme.gradient} border-b border-stone-200/60 dark:border-stone-800/60 flex items-start justify-between gap-3`}>
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-2xl bg-white dark:bg-stone-800 shadow-2xs border border-stone-200/60 dark:border-stone-700/60`}>
            {theme.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-serif font-bold tracking-tight text-stone-900 dark:text-stone-50">
                {categoryInfo.title}
              </h2>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${theme.badgeBg}`}>
                {categoryGoals.length} {categoryGoals.length === 1 ? 'Ziel' : 'Ziele'}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 leading-relaxed font-sans">
              {categoryInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Quick Add Button */}
        <button
          onClick={() => setIsAdding(!isAdding)}
          title={t.actions.addGoal}
          className={`p-2 rounded-xl transition-all ${
            isAdding
              ? 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>

      {/* Goals List */}
      <div className="p-4 flex-1 flex flex-col gap-2.5 overflow-y-auto">
        {/* Inline Add Form */}
        {isAdding && (
          <form onSubmit={handleAddGoal} className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/90 border border-dashed border-stone-300 dark:border-stone-700 flex flex-col gap-2 animate-slide-up">
            <textarea
              value={newGoalText}
              onChange={(e) => setNewGoalText(e.target.value)}
              placeholder={categoryInfo.placeholder}
              rows={2}
              autoFocus
              className="w-full text-sm p-2.5 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
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
                className="px-3 py-1.5 rounded-lg text-xs text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              >
                {t.actions.cancel}
              </button>
              <button
                type="submit"
                disabled={!newGoalText.trim()}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-medium transition-colors shadow-2xs flex items-center gap-1"
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
        <div className="p-3 bg-stone-50/50 dark:bg-stone-900/40 border-t border-stone-100 dark:border-stone-800/50 flex items-center justify-between">
          <button
            onClick={() => setIsAdding(true)}
            className="text-xs font-medium text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.actions.addGoal}</span>
          </button>
          {goodCount > 0 && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              {goodCount} / {categoryGoals.length} {t.stats.goalsCompleted}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
