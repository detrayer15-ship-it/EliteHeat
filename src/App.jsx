import { useState } from 'react';
import { getHealth, createCourse } from './services/api';

export default function App() {
  const [status, setStatus] = useState('');
  return (
    <div>
      <button onClick={async () => { const r = await getHealth(); setStatus(r.status); }}>
        Check API Health
      </button>
      <div>API status: {status}</div>

      <button onClick={async () => {
        const c = await createCourse({ title: 'Test course' });
        alert('Created: ' + JSON.stringify(c));
      }}>
        Create Course
      </button>
    </div>
  );
}
