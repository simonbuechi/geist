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
import { RoughBackground } from './RoughBackground';
import { IconButton } from './IconButton';

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

  // Unified theme configuration across Körper, Geist, Seele using warm beige / light brown palette
  const unifiedTheme = {
    accentColor: 'text-[#8A5034] dark:text-[#E8A588]',
    roughColor: '#7A6A5E',
    headerBorder: 'border-b border-[#7A6A5E]/20 dark:border-[#EDE5DD]/15',
    stickyBg: 'bg-[#FAF5ED] dark:bg-[#2C241E]',
    cardBorder: 'border-[#7A6A5E]/25 dark:border-[#EDE5DD]/20',
    badgeBg: 'bg-[#E8DDCF]/90 dark:bg-[#382E26]/90 text-[#5C4F45] dark:text-[#D5C7BC]',
    quickAddBg: 'text-[#5C4F45] dark:text-[#D5C7BC]',
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
    <div className="relative flex flex-col h-full bg-transparent rounded-none transition-all gap-2.5">
      {/* Category Header Card with clean readable background */}
      <div className="relative p-3 sm:p-3.5 rounded-none bg-[#FDFBF7] dark:bg-[#28221D] border border-[#7A6A5E]/25 dark:border-[#EDE5DD]/20 shadow-pencil-sm flex items-center justify-between gap-2.5 overflow-hidden">
        <RoughBorder
          borderRadius={0}
          width={1.0}
          opacity={0.3}
          color="#6E5F54"
          darkColor="#EDE5DD"
        />
        <div className="relative z-10 flex items-center gap-2.5 sm:gap-3">
          <div className="shrink-0 flex items-center justify-center">
            <CategoryIcon category={category} variant="base" size={56} className="w-12 h-12 sm:w-14 sm:h-14" />
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-hand font-bold tracking-wide text-[#4A3E36] dark:text-[#EDE5DD]">
              {categoryInfo.title}
            </h2>
            <span className={`text-2xs px-2 py-0.5 rounded-none font-sans font-semibold border border-[#7A6A5E]/20 dark:border-[#EDE5DD]/15 shadow-pencil-sm ${currentTheme.badgeBg}`}>
              {categoryGoals.length} {categoryGoals.length === 1 ? 'Ziel' : 'Ziele'}
            </span>
          </div>
        </div>

        {/* Quick Add Button - only for unfinished weeks */}
        {!isFinished && (
          <IconButton
            onClick={() => setIsAdding(!isAdding)}
            title={isAdding ? t.actions.cancel : t.actions.addGoal}
            aria-label={isAdding ? t.actions.cancel : t.actions.addGoal}
            variant={isAdding ? 'subtle' : 'default'}
            size="md"
            className="relative z-10"
          >
            {isAdding ? <X className="w-4 h-4 stroke-[2]" /> : <Plus className="w-4 h-4 stroke-[2]" />}
          </IconButton>
        )}
      </div>

      {/* Goals List */}
      <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto relative z-10">
        {/* Inline Add Form - Notebook Sticky Note Style with Tactile Cross-Hatch Pencil Background */}
        {isAdding && !isFinished && (
          <form onSubmit={handleAddGoal} className={`relative p-3.5 rounded-none ${currentTheme.stickyBg} border border-dashed border-[#7A6A5E]/30 dark:border-[#EDE5DD]/25 flex flex-col gap-2.5 animate-slide-up shadow-pencil-sm overflow-hidden`}>
            {/* Tactile sticky note cross-hatch texture */}
            <RoughBackground
              fill="#D4A759"
              darkFill="#D4A759"
              fillStyle="cross-hatch"
              hachureAngle={-30}
              hachureGap={6.5}
              fillWeight={1.0}
              roughness={1.2}
              opacity={0.14}
              seed={99}
            />

            <textarea
              value={newGoalText}
              onChange={(e) => setNewGoalText(e.target.value)}
              placeholder={categoryInfo.placeholder}
              rows={2}
              autoFocus
              className={`relative z-10 w-full text-sm p-3 rounded-none border border-[#7A6A5E]/25 dark:border-[#EDE5DD]/20 bg-[#FAF6F0] dark:bg-[#241E19] text-[#4A3E36] dark:text-[#EDE5DD] placeholder-[#8C7D71] focus:outline-none focus:ring-1 ${currentTheme.focusRing} font-sans`}
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
                className="px-3.5 py-1.5 rounded-none text-xs text-[#7D6E63] dark:text-[#BA9F83] transition-all font-medium"
              >
                {t.actions.cancel}
              </button>
              <button
                type="submit"
                disabled={!newGoalText.trim()}
                className="group relative px-4 py-1.5 rounded-none border-0 shadow-pencil-sm sketch-btn-press disabled:opacity-50 text-sm font-hand font-bold text-white flex items-center gap-1.5 transition-all overflow-hidden"
              >
                {/* Tactile cross-hatch rough background */}
                <RoughBackground
                  fill="#D7195F"
                  darkFill="#C51756"
                  fillStyle="cross-hatch"
                  hachureAngle={-41}
                  hachureGap={3.2}
                  fillWeight={1.2}
                  roughness={1.1}
                  opacity={0.94}
                  seed={55}
                />
                <Check className="w-3.5 h-3.5 stroke-[2.2] relative z-10" />
                <span className="relative z-10 drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]">{t.actions.save}</span>
              </button>
            </div>
          </form>
        )}

        {categoryGoals.length === 0 && !isAdding ? (
          isFinished ? (
            <div className="flex-1 min-h-[120px] flex flex-col items-center justify-center p-6 border border-dashed border-[#7A6A5E]/20 dark:border-[#EDE5DD]/15 rounded-none text-center bg-[#FDFBF7] dark:bg-[#28221D] shadow-pencil-sm">
              <p className="text-sm sm:text-base text-[#7D6E63] dark:text-[#BA9F83] font-hand italic max-w-[200px]">
                {t.emptyCategory}
              </p>
            </div>
          ) : (
            <div 
              onClick={() => setIsAdding(true)}
              className="flex-1 min-h-[140px] flex flex-col items-center justify-center p-6 border border-dashed border-[#7A6A5E]/30 dark:border-[#EDE5DD]/25 rounded-none cursor-pointer group transition-all text-center bg-[#FDFBF7] dark:bg-[#28221D] shadow-pencil-sm hover:border-[#D7195F]/50"
            >
              <div className="relative w-10 h-10 rounded-full bg-transparent flex items-center justify-center text-[#7D6E63] dark:text-[#BA9F83] transition-all mb-2 overflow-hidden">
                <RoughBackground
                  shape="circle"
                  fillStyle="zigzag"
                  fill="#7A6A5E"
                  darkFill="#EDE5DD"
                  hachureAngle={-41}
                  hachureGap={2.4}
                  fillWeight={1.8}
                  roughness={1.0}
                  opacity={0.55}
                  seed={22}
                />
                <Plus className="w-5 h-5 stroke-[2] relative z-10" />
              </div>
              <p className="text-sm sm:text-base text-[#7D6E63] dark:text-[#BA9F83] font-hand font-medium max-w-[200px]">
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

      {/* Footer / Stats Bar (shown when goals are reviewed and completed) */}
      {!isAdding && categoryGoals.length > 0 && goodCount > 0 && (
        <div className="px-3.5 py-1.5 bg-[#FDFBF7] dark:bg-[#28221D] border border-[#7A6A5E]/20 dark:border-[#EDE5DD]/15 shadow-pencil-sm flex items-center justify-end text-2xs rounded-none">
          <span className={`text-2xs font-sans font-semibold ${currentTheme.accentColor}`}>
            {goodCount} / {categoryGoals.length} {t.stats.goalsCompleted}
          </span>
        </div>
      )}
    </div>
  );
};
