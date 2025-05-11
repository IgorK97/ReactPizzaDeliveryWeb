

import React, { Component, ErrorInfo, ReactNode } from 'react';

/**
 * Интрефейс пропсов для компонента ErrorBoundary
 */
interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Интрефейс состояния компонента ErrorBoundary
 */
interface State {
  hasError: boolean;
}

/**
 * Компонент-перехватчик ошибок
 */
class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  /**
   * Обновляет свое состояние при ошибке
   * @param e ошибка
   * @returns новое состояние State
   */
  static getDerivedStateFromError(e: Error): State {
    return { hasError: true };
  }

  /**
   * Логирование ошибки при ее получении
   * @param error ошибка
   * @param errorInfo дополнительная информация о ней
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Ошибка:', error, errorInfo);
  }

  /**
   * Рендер компонента
   * @returns ReactNode, то есть компонент
   */
  render() {
    if (this.state.hasError) {
      return this.props.fallback || <h2>Что-то пошло не так... Повторите попытку позже</h2>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
