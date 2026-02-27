import { Login } from '@/components/auth/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Next.js SignIn Page ',
  description: 'This is Next.js Signin Page TailAdmin Dashboard Template',
};

export default function SignIn() {
  return (
    <div className="w-full h-full">
      <Login />
    </div>
  );
}
