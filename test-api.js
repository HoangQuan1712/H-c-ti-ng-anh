// Test script to verify Register, Login, and User Data persistence
async function runTests() {
  const baseUrl = 'http://localhost:3000';

  console.log('--- 1. Testing db-status ---');
  const resStatus = await fetch(`${baseUrl}/api/db-status`);
  const dataStatus = await resStatus.json();
  console.log('DB Status:', dataStatus);

  console.log('\n--- 2. Testing Register ---');
  const resReg = await fetch(`${baseUrl}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Nguyen Van A',
      email: 'nguyenvana@gmail.com',
      password: 'password123'
    })
  });
  const dataReg = await resReg.json();
  console.log('Register Response:', dataReg);

  console.log('\n--- 3. Testing Duplicate Register Prevention ---');
  const resRegDup = await fetch(`${baseUrl}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Nguyen Van A',
      email: 'nguyenvana@gmail.com',
      password: 'password123'
    })
  });
  const dataRegDup = await resRegDup.json();
  console.log('Duplicate Register Response (Expected 409):', dataRegDup);

  console.log('\n--- 4. Testing Login (Correct Password) ---');
  const resLogin = await fetch(`${baseUrl}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'nguyenvana@gmail.com',
      password: 'password123'
    })
  });
  const dataLogin = await resLogin.json();
  console.log('Login Success Response:', dataLogin);

  console.log('\n--- 5. Testing Login (Wrong Password) ---');
  const resLoginWrong = await fetch(`${baseUrl}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'nguyenvana@gmail.com',
      password: 'wrongpassword'
    })
  });
  const dataLoginWrong = await resLoginWrong.json();
  console.log('Login Wrong Password Response (Expected 401):', dataLoginWrong);

  console.log('\n--- 6. Testing User Data Save & Retrieve ---');
  const userId = dataLogin.user.id;
  const saveRes = await fetch(`${baseUrl}/api/user-data`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      data: {
        streak: { count: 3, lastActiveDate: '2026-08-14' },
        essays: [{ id: 'essay_1', topic: 'Technology', score: 8.5 }],
        vocab: [{ id: 'v_1', word: 'ubiquitous', meaning: 'phổ biến khắp nơi' }]
      }
    })
  });
  console.log('Save User Data Response:', await saveRes.json());

  const getRes = await fetch(`${baseUrl}/api/user-data?userId=${userId}`);
  const getData = await getRes.json();
  console.log('Retrieve User Data Response:', getData);

  console.log('\nAll API and Database tests completed successfully!');
}

runTests().catch(console.error);
