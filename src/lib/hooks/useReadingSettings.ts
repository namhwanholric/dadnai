'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  DEFAULT_READING_SETTINGS,
  STORAGE_EVENT,
  loadSettings,
  saveSettings,
  type ReadingSettings,
} from '@/lib/storage';

/** 설정값을 실제 문서에 반영한다. 읽기 화면 밖에서도 테마가 일관되도록 <html>에 건다. */
function applyToDocument(settings: ReadingSettings) {
  const root = document.documentElement;
  root.setAttribute('data-theme', settings.theme);
  root.style.setProperty('--reader-font-size', `${settings.fontSize}px`);
  root.style.setProperty('--reader-line-height', String(settings.lineHeight));
  root.style.setProperty('--reader-measure', `${settings.measure}rem`);
}

/**
 * 읽기 설정 훅.
 * 서버 렌더링 결과와 어긋나지 않도록 첫 렌더에서는 기본값을 쓰고,
 * 마운트 직후 localStorage 값으로 교체한다. (실제 화면은 ThemeBootstrap 이 미리 맞춰 둔다)
 */
export function useReadingSettings() {
  const [settings, setSettings] = useState<ReadingSettings>(DEFAULT_READING_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadSettings();
    setSettings(stored);
    applyToDocument(stored);
    setHydrated(true);

    // 다른 컴포넌트(예: 헤더 테마 버튼)가 설정을 바꿨을 때 따라간다.
    const sync = () => setSettings(loadSettings());
    window.addEventListener(STORAGE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(STORAGE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const update = useCallback((patch: Partial<ReadingSettings>) => {
    setSettings((current) => {
      const next = { ...current, ...patch };
      applyToDocument(next);
      saveSettings(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    applyToDocument(DEFAULT_READING_SETTINGS);
    saveSettings(DEFAULT_READING_SETTINGS);
    setSettings(DEFAULT_READING_SETTINGS);
  }, []);

  return { settings, update, reset, hydrated };
}
