import {AuthForm} from '@/components/auth-form';
import Link from 'next/link';

export default function LoginPage() {
    return (
        <div className="container flex h-screen items-center justify-center">
            <div className="w-full max-w-md space-y-4">
                <h1 className="text-2xl font-bold">Регистрация</h1>
                <AuthForm isLogin={false} />
                <p className="text-center text-sm text-muted-foreground">
                    Есть аккаунт?{' '}
                    <Link href="/login" className="underline">
                        войти
                    </Link>
                </p>
            </div>
        </div>
    );
}