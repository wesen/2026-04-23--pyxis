import type { ReactElement } from 'react';
import { Route, Routes } from 'react-router-dom';
import { resetMockState } from '../api/mockHandlers';

export function renderWithFreshMockState(element: ReactElement) {
  resetMockState();
  return element;
}

export function RoutedPage({ path, element }: { path: string; element: ReactElement }) {
  return (
    <Routes>
      <Route path={path} element={element} />
    </Routes>
  );
}
