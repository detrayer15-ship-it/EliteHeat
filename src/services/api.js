export async function getHealth() {
  const res = await fetch(import.meta.env.VITE_API_URL + '/api/health');
  return res.json();
}
export async function createCourse(payload) {
  const res = await fetch(import.meta.env.VITE_API_URL + '/api/courses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}
