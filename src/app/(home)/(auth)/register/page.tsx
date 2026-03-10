import { Register } from '@/components/auth/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register Page ',
  description: 'This is Register Page',
};

export default function RegisterPage() {
  return (
    <div className="w-full h-full">
      <Register />
    </div>
  );
}
