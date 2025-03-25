import {redirect} from 'next/navigation';
import {getCurrentUser} from '@/lib/auth';

export default async function Home() {
    const user = await getCurrentUser()

    if (!user) {
        return redirect('/login')
    }

    if (user.role === 'customer') {
        return redirect('/my-orders')
    }
    if (user.role === 'admin') {
        return redirect('/admin')
    }
    if (user.role === 'manager') {
        return redirect('/manager')
    }

  return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold">Добро пожаловать в ERP-систему</h1>
        <p className="mt-4">Ваша роль: {user?.role}</p>
      </div>
  );
}