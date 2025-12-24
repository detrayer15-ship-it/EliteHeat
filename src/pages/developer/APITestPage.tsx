/**
 * Пример компонента для тестирования API
 * Используйте этот компонент для проверки работы всех API функций
 */

import { useState } from 'react';
import { useGeminiChat, useCourses, useSubmissions } from '@/api/hooks';
import { login, register, getCurrentUser } from '@/api';

export default function APITestPage() {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const { sendMessage: sendAIMessage } = useGeminiChat();
  const { getAllCourses } = useCourses();
  const { getMySubmissions } = useSubmissions();

  // Тест 1: Регистрация
  const testRegister = async () => {
    setLoading(true);
    try {
      const response = await register({
        name: 'Test User',
        email: `test${Date.now()}@test.com`,
        password: 'test123',
        city: 'Алматы',
        role: 'student'
      });
      setTestResult(`✅ Регистрация успешна!\nПользователь: ${response.user?.name}\nEmail: ${response.user?.email}`);
    } catch (error: any) {
      setTestResult(`❌ Ошибка регистрации: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  // Тест 2: Вход
  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await login({
        email: 'test@test.com',
        password: 'test123'
      });
      setTestResult(`✅ Вход успешен!\nПользователь: ${response.user?.name}\nРоль: ${response.user?.role}`);
    } catch (error: any) {
      setTestResult(`❌ Ошибка входа: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  // Тест 3: Получить текущего пользователя
  const testGetCurrentUser = async () => {
    setLoading(true);
    try {
      const response = await getCurrentUser();
      setTestResult(`✅ Текущий пользователь:\nИмя: ${response.user?.name}\nEmail: ${response.user?.email}\nРоль: ${response.user?.role}`);
    } catch (error: any) {
      setTestResult(`❌ Ошибка: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  // Тест 4: Gemini AI
  const testGeminiAI = async () => {
    setLoading(true);
    try {
      const response = await sendAIMessage('Привет! Расскажи кратко что такое React?');
      setTestResult(`✅ Gemini AI ответил:\n\n${response}`);
    } catch (error: any) {
      setTestResult(`❌ Ошибка Gemini AI: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  // Тест 5: Получить курсы
  const testGetCourses = async () => {
    setLoading(true);
    try {
      const response = await getAllCourses();
      const courses = response.data || [];
      setTestResult(`✅ Получено курсов: ${courses.length}\n\n${courses.map((c: any) => `- ${c.title}`).join('\n')}`);
    } catch (error: any) {
      setTestResult(`❌ Ошибка получения курсов: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  // Тест 6: Получить мои submissions
  const testGetSubmissions = async () => {
    setLoading(true);
    try {
      const response = await getMySubmissions();
      const submissions = response.data || [];
      setTestResult(`✅ Получено заданий: ${submissions.length}\n\n${submissions.map((s: any) => `- ${s.assignmentTitle || s.id}: ${s.status}`).join('\n')}`);
    } catch (error: any) {
      setTestResult(`❌ Ошибка получения заданий: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '40px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>
        🧪 API Test Page
      </h1>
      
      <p style={{ marginBottom: '30px', color: '#666' }}>
        Используйте эту страницу для тестирования всех API функций
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '30px'
      }}>
        <button
          onClick={testRegister}
          disabled={loading}
          style={{
            padding: '15px 20px',
            fontSize: '16px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          1️⃣ Тест Регистрации
        </button>

        <button
          onClick={testLogin}
          disabled={loading}
          style={{
            padding: '15px 20px',
            fontSize: '16px',
            background: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          2️⃣ Тест Входа
        </button>

        <button
          onClick={testGetCurrentUser}
          disabled={loading}
          style={{
            padding: '15px 20px',
            fontSize: '16px',
            background: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          3️⃣ Текущий Пользователь
        </button>

        <button
          onClick={testGeminiAI}
          disabled={loading}
          style={{
            padding: '15px 20px',
            fontSize: '16px',
            background: '#9C27B0',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          4️⃣ Gemini AI
        </button>

        <button
          onClick={testGetCourses}
          disabled={loading}
          style={{
            padding: '15px 20px',
            fontSize: '16px',
            background: '#00BCD4',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          5️⃣ Получить Курсы
        </button>

        <button
          onClick={testGetSubmissions}
          disabled={loading}
          style={{
            padding: '15px 20px',
            fontSize: '16px',
            background: '#E91E63',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          6️⃣ Мои Задания
        </button>
      </div>

      {loading && (
        <div style={{
          padding: '20px',
          background: '#FFF3CD',
          border: '1px solid #FFC107',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          ⏳ Загрузка...
        </div>
      )}

      {testResult && (
        <div style={{
          padding: '20px',
          background: testResult.startsWith('✅') ? '#D4EDDA' : '#F8D7DA',
          border: `1px solid ${testResult.startsWith('✅') ? '#28A745' : '#DC3545'}`,
          borderRadius: '8px',
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace',
          fontSize: '14px'
        }}>
          {testResult}
        </div>
      )}

      <div style={{
        marginTop: '40px',
        padding: '20px',
        background: '#E3F2FD',
        borderRadius: '8px'
      }}>
        <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>📝 Инструкции:</h2>
        <ol style={{ lineHeight: '1.8' }}>
          <li>Убедитесь что backend запущен: <code>npm run dev:memory</code></li>
          <li>Нажимайте кнопки по порядку для тестирования</li>
          <li>Проверьте консоль браузера (F12) для подробных логов</li>
          <li>Результаты появятся ниже кнопок</li>
        </ol>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '20px',
        background: '#FFF3E0',
        borderRadius: '8px'
      }}>
        <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>⚙️ Настройки:</h2>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Backend URL:</strong> {import.meta.env.VITE_API_URL || 'http://localhost:3000'}</li>
          <li><strong>Gemini API:</strong> {import.meta.env.VITE_GEMINI_API_KEY ? '✅ Настроен' : '❌ Не настроен'}</li>
          <li><strong>Токен:</strong> {localStorage.getItem('authToken') ? '✅ Есть' : '❌ Нет'}</li>
        </ul>
      </div>
    </div>
  );
}
