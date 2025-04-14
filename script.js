// Example: signup logic
document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const userType = document.getElementById('userType').value;

  try {
    const userCred = await auth.createUserWithEmailAndPassword(email, password);
    await db.collection('users').doc(userCred.user.uid).set({
      name, phone, email, userType, createdAt: new Date()
    });
    alert('Signed up!');
    window.location.href = 'index.html';
  } catch (error) {
    alert(error.message);
  }
});
