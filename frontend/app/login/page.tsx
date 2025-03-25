import {AuthForm} from '@/components/auth-form';
import Link from 'next/link';

export default function LoginPage() {
    return (
        <div className="container flex h-screen items-center justify-center">
            <div className="w-full max-w-md space-y-4">
                <h1 className="text-2xl font-bold">Вход в систему</h1>
                <AuthForm isLogin={true} />
                <p className="text-center text-sm text-muted-foreground">
                    Нет аккаунта?{' '}
                    <Link href="/register" className="underline">
                        Зарегистрироваться
                    </Link>
                </p>
            </div>
        </div>
    );
}