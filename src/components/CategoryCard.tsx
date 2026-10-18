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
import { RoughButton } from './RoughButton';
import { RoughHoverBorder } from './RoughHoverBorder';
import { RoughNotationHighlight } from './RoughNotationHighlight';

interface CategoryCardProps {
  category: Category;
}

interface DimensionTheme {
  headerWash: string;
  roughFill: string;
  roughDarkFill: string;
  hachureAngle: number;
  seed: number;
  accentText: string;
  badgeClasses: string;
  tapeClasses: string;
  focusRing: string;
  saveFill: string;
  saveDarkFill: string;
}

const unifiedTheme: Omit<DimensionTheme, 'seed' | 'hachureAngle'> = {
  headerWash: 'bg-[#F3EDE2]/75 dark:bg-[#2A2521]/75',
  roughFill: '#C8A986',
  roughDarkFill: '#C8A986',
  accentText: 'text-[#5C524B] dark:text-[#C5B9AE]',
  badgeClasses:
    'bg-[#EAE2D3]/90 dark:bg-[#2F2A26]/90 text-[#5C524B] dark:text-[#C5B9AE] border-[#8C7E72]/35 dark:border-[#7A6F66]/40',
  tapeClasses: 'bg-[#D8C6B0]/45 dark:bg-[#8C7E72]/30 border-[#8C7E72]/25',
  focusRing: 'focus:ring-[#8A6A46]/30 focus:border-[#8A6A46]',
  saveFill: '#C46345',
  saveDarkFill: '#B8583B',
};

const dimensionThemes: Record<Category, DimensionTheme> = {
  body: {
    ...unifiedTheme,
    hachureAngle: -38,
    seed: 101,
  },
  mind: {
    ...unifiedTheme,
    hachureAngle: -38,
    seed: 102,
  },
  soul: {
    ...unifiedTheme,
    hachureAngle: -38,
    seed: 103,
  },
};

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
  const [isEmptyHovered, setIsEmptyHovered] = useState(false);

  const categoryGoals = currentWeekPlan.goals.filter(g => g.category === category);
  const categoryInfo = t.categories[category];
  const currentTheme = dimensionThemes[category];
  const goodCount = categoryGoals.filter(g => g.status === 'good').length;
  const isFinished = Boolean(currentWeekPlan.reviewedAt);

  const handleAddGoal = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (newGoalText.trim()) {
      addGoal(category, newGoalText.trim());
      setNewGoalText('');
      setIsAdding(false);
    }
  };

  return (
    <section
      aria-label={categoryInfo.title}
      className="relative flex flex-col h-full notebook-sheet rounded-xs pt-1 overflow-visible"
    >
      {/* Playful artisanal washi-tape strip pinning the notebook page */}
      <div
        className={`absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-3.5 border ${currentTheme.tapeClasses} rotate-[-1.5deg] pointer-events-none z-20 shadow-2xs`}
        aria-hidden="true"
      />

      {/* Hand-sketched rough.js perimeter border for the notebook page */}
      <RoughBorder
        color="#5C4F45"
        darkColor="#9A8D82"
        width={1.25}
        roughness={1.35}
        bowing={1.1}
        opacity={0.45}
      />

      {/* Category Notebook Header Band with Colored-Pencil Hachure */}
      <div className={`relative px-4 py-3.5 sm:px-5 sm:py-4 flex items-center justify-between gap-2.5 overflow-visible ${currentTheme.headerWash}`}>
        <RoughBackground
          fill={currentTheme.roughFill}
          darkFill={currentTheme.roughDarkFill}
          fillStyle="hachure"
          hachureAngle={currentTheme.hachureAngle}
          hachureGap={6.5}
          fillWeight={1.0}
          roughness={1.3}
          opacity={0.14}
          drawBottomLine={true}
          bottomLineColor="#6E6258"
          darkBottomLineColor="#8A7E74"
          seed={currentTheme.seed}
        />

        <div className="relative z-10 flex items-center gap-3.5 overflow-visible">
          <div className="shrink-0 flex items-center justify-center">
            <CategoryIcon
              category={category}
              variant="base"
              size={80}
              className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_1px_2px_rgba(68,56,46,0.14)]"
            />
          </div>
          <div className="flex items-center gap-2.5 overflow-visible">
            <RoughNotationHighlight
              type="box"
              trigger="click"
              color="#9123A6"
              darkColor="#D7195F"
              strokeWidth={1.6}
              padding={[3, 6, 6, 6]}
              className="cursor-pointer"
            >
              <h2 className="text-xl sm:text-2xl font-hand font-bold tracking-normal bg-gradient-to-r from-[#9123A6] to-[#D7195F] bg-clip-text text-transparent leading-[1.7] pt-0.5 pb-1.5 px-1 select-none">
                {categoryInfo.title}
              </h2>
            </RoughNotationHighlight>
            <span
              className={`text-2xs px-2 py-0.5 rounded-full font-sans font-semibold border ${currentTheme.badgeClasses}`}
            >
              {categoryGoals.length}
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
            {isAdding ? <X className="w-4 h-4 stroke-[2]" /> : <Plus className="w-4 h-4 stroke-[2.2]" />}
          </IconButton>
        )}
      </div>

      {/* Notebook Ruled Page Body */}
      <div className="px-4 py-3 sm:px-5 sm:py-4 flex-1 flex flex-col gap-1 overflow-y-auto relative z-10">
        {/* Inline Add Form - Tucked-in Note Style */}
        {isAdding && !isFinished && (
          <form
            onSubmit={handleAddGoal}
            className="relative p-3.5 mb-2 rounded-xs bg-[#F7F1E7] dark:bg-[#2B2521] border border-dashed border-[#7A6A5E]/40 dark:border-[#A89B8F]/30 flex flex-col gap-2.5 animate-slide-up shadow-pencil-sm overflow-visible"
          >
            <RoughBackground
              fill={currentTheme.roughFill}
              darkFill={currentTheme.roughDarkFill}
              fillStyle="hachure"
              hachureAngle={-30}
              hachureGap={8}
              fillWeight={0.9}
              roughness={1.2}
              opacity={0.09}
              seed={currentTheme.seed + 50}
            />

            <textarea
              value={newGoalText}
              onChange={(e) => setNewGoalText(e.target.value)}
              placeholder={categoryInfo.placeholder}
              rows={2}
              autoFocus
              className={`relative z-10 w-full text-sm p-2.5 rounded-xs border border-[#7A6A5E]/30 dark:border-[#A89B8F]/25 bg-[#FCF9F4] dark:bg-[#1E1A17] text-[#332B25] dark:text-[#EAE2D9] placeholder-[#9A8D82] focus:outline-none focus:ring-1 ${currentTheme.focusRing} font-sans leading-relaxed`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddGoal();
                }
              }}
            />
            <div className="relative z-10 flex items-center justify-end gap-2">
              <RoughButton
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAdding(false)}
              >
                <span>{t.actions.cancel}</span>
              </RoughButton>
              <RoughButton
                type="submit"
                variant="primary"
                size="sm"
                disabled={!newGoalText.trim()}
                seed={55}
              >
                <Check className="w-3.5 h-3.5 stroke-[2.3]" />
                <span>{t.actions.save}</span>
              </RoughButton>
            </div>
          </form>
        )}

        {categoryGoals.length === 0 && !isAdding ? (
          isFinished ? (
            <div className="flex-1 min-h-[130px] flex flex-col items-center justify-center p-6 text-center">
              <p className="text-sm text-[#9A8D82] dark:text-[#70655B] font-sans italic max-w-[210px]">
                {t.emptyCategory}
              </p>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              onMouseEnter={() => setIsEmptyHovered(true)}
              onMouseLeave={() => setIsEmptyHovered(false)}
              className="flex-1 min-h-[150px] w-full flex flex-col items-center justify-center p-6 my-1 border-0 rounded-2xl cursor-pointer group text-center"
            >
              <div className="relative w-10 h-10 rounded-full bg-transparent flex items-center justify-center text-[#332B25] dark:text-[#EAE2D9] mb-2 overflow-visible">
                <RoughBackground
                  shape="circle"
                  fillStyle="zigzag"
                  fill={currentTheme.roughFill}
                  darkFill={currentTheme.roughDarkFill}
                  stroke="transparent"
                  darkStroke="transparent"
                  strokeWidth={0}
                  hachureAngle={-41}
                  hachureGap={2.8}
                  fillWeight={1.4}
                  roughness={1.1}
                  opacity={0.55}
                  seed={currentTheme.seed + 20}
                  className="rounded-full"
                />
                <RoughHoverBorder
                  active={isEmptyHovered}
                  color="#8A6A46"
                  darkColor="#DFC4A4"
                  strokeWidth={1.5}
                  padding={1}
                />
                <Plus className="w-4 h-4 stroke-[2.2] relative z-10" />
              </div>
              <p className="text-xs sm:text-sm text-[#6E6258] dark:text-[#A89B8F] font-sans max-w-[210px]">
                {t.emptyCategory}
              </p>
            </button>
          )
        ) : (
          <div className="flex flex-col">
            {categoryGoals.map((goal, idx) => (
              <GoalItem
                key={goal.id}
                goal={goal}
                category={category}
                isReadOnly={isFinished}
                isLast={idx === categoryGoals.length - 1}
                onUpdate={(desc) => updateGoal(goal.id, desc)}
                onDelete={() => deleteGoal(goal.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Notebook Sheet Footer (shown when goals are reviewed and completed) */}
      {!isAdding && categoryGoals.length > 0 && goodCount > 0 && (
        <div className="px-4 py-2 bg-[#F7F1E7]/65 dark:bg-[#1E1A17]/60 border-t border-dashed border-[#8C7D71]/25 dark:border-[#A89B8F]/15 flex items-center justify-end text-2xs">
          <span className={`text-2xs font-sans font-semibold ${currentTheme.accentText}`}>
            {goodCount} / {categoryGoals.length} {t.stats.goalsCompleted}
          </span>
        </div>
      )}
    </section>
  );
};
