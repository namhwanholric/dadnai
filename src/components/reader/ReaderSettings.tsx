'use client';

import { Icon } from '@/components/Icon';
import { Sheet } from '@/components/Sheet';
import { THEME_OPTIONS } from '@/components/ThemeToggle';
import { useReadingSettings } from '@/lib/hooks/useReadingSettings';
import { READING_LIMITS } from '@/lib/storage';

interface Props {
  open: boolean;
  onClose: () => void;
}

/** 글자 크기 · 줄 간격 · 본문 폭 · 서체 · 화면 밝기 */
export function ReaderSettings({ open, onClose }: Props) {
  const { settings, update, reset } = useReadingSettings();

  return (
    <Sheet open={open} onClose={onClose} title="읽기 설정">
      <div className="space-y-6">
        {/* 화면 밝기 */}
        <fieldset>
          <legend className="mb-2.5 text-[12.5px] font-semibold text-ink-subtle">화면</legend>
          <div className="grid grid-cols-3 gap-2">
            {THEME_OPTIONS.map((option) => {
              const active = settings.theme === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => update({ theme: option.value })}
                  aria-pressed={active}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-[12px] font-medium transition-colors ${
                    active
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-line bg-surface text-ink-muted hover:text-ink'
                  }`}
                >
                  <Icon name={option.icon} size={19} />
                  {option.label.replace(' 화면', '')}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* 서체 */}
        <fieldset>
          <legend className="mb-2.5 text-[12.5px] font-semibold text-ink-subtle">서체</legend>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { value: 'sans', label: '고딕', sample: '가나다 Aa' },
                { value: 'serif', label: '명조', sample: '가나다 Aa' },
              ] as const
            ).map((option) => {
              const active = settings.font === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => update({ font: option.value })}
                  aria-pressed={active}
                  className={`rounded-xl border px-3 py-3 transition-colors ${
                    active
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-line bg-surface text-ink-muted hover:text-ink'
                  }`}
                >
                  <span
                    className={`block text-[16px] ${option.value === 'serif' ? 'font-serif' : 'font-sans'}`}
                  >
                    {option.sample}
                  </span>
                  <span className="mt-0.5 block text-[11.5px]">{option.label}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <Stepper
          label="글자 크기"
          value={settings.fontSize}
          display={`${settings.fontSize}px`}
          min={READING_LIMITS.fontSize.min}
          max={READING_LIMITS.fontSize.max}
          step={READING_LIMITS.fontSize.step}
          onChange={(fontSize) => update({ fontSize })}
        />

        <Stepper
          label="줄 간격"
          value={settings.lineHeight}
          display={settings.lineHeight.toFixed(1)}
          min={READING_LIMITS.lineHeight.min}
          max={READING_LIMITS.lineHeight.max}
          step={READING_LIMITS.lineHeight.step}
          onChange={(lineHeight) => update({ lineHeight: Math.round(lineHeight * 10) / 10 })}
        />

        <Stepper
          label="본문 폭"
          value={settings.measure}
          display={`${settings.measure}rem`}
          min={READING_LIMITS.measure.min}
          max={READING_LIMITS.measure.max}
          step={READING_LIMITS.measure.step}
          onChange={(measure) => update({ measure })}
        />

        {/* 미리보기 */}
        <div>
          <p className="mb-2 text-[12.5px] font-semibold text-ink-subtle">미리보기</p>
          <div
            className="reader-body rounded-xl border border-line bg-surface/50 p-4"
            data-font={settings.font}
            style={{ maxWidth: '100%' }}
          >
            <p>
              종이 울리지 않았다. 이랑은 줄을 놓고 한 걸음 물러섰다. 탑 안의 공기가 아주 천천히,
              그러나 분명하게 식어 가고 있었다.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={reset}
          className="w-full rounded-xl border border-line bg-surface py-3 text-[13px] font-medium text-ink-muted transition-colors hover:text-ink"
        >
          기본값으로 되돌리기
        </button>

        <p className="text-[11.5px] leading-relaxed text-ink-subtle">
          설정은 이 브라우저에 저장되어 다음에 올 때도 그대로 유지됩니다.
        </p>
      </div>
    </Sheet>
  );
}

interface StepperProps {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

function Stepper({ label, value, display, min, max, step, onChange }: StepperProps) {
  const clamp = (next: number) => Math.min(max, Math.max(min, next));

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-[12.5px] font-semibold text-ink-subtle">{label}</span>
        <span className="text-[12.5px] tabular-nums text-ink-muted">{display}</span>
      </div>
      <div className="flex items-center gap-2.5">
        <StepButton
          label={`${label} 줄이기`}
          disabled={value <= min}
          onClick={() => onChange(clamp(value - step))}
        >
          −
        </StepButton>
        <input
          type="range"
          aria-label={label}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(clamp(Number(event.target.value)))}
          className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-raised accent-[var(--c-accent)]"
        />
        <StepButton
          label={`${label} 늘리기`}
          disabled={value >= max}
          onClick={() => onChange(clamp(value + step))}
        >
          +
        </StepButton>
      </div>
    </div>
  );
}

function StepButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-9 shrink-0 place-items-center rounded-lg border border-line bg-surface text-[17px] leading-none text-ink transition-colors hover:border-accent/50 hover:text-accent disabled:opacity-35 disabled:hover:border-line disabled:hover:text-ink"
    >
      {children}
    </button>
  );
}
