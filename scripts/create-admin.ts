import { auth } from '../lib/auth';

async function createAdmin() {
  try {
    const user = await auth.api.signUpEmail({
      body: {
        email: 'admin@rouhi.com',
        password: 'securepassword123',
        name: 'Admin',
      },
    });
    console.log('Admin user created successfully:', user);
  } catch (err) {
    console.error('Error creating admin:', err);
  }
}

createAdmin();
