'use client';

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form';
import api from "@/lib/axios";
import Cookies from 'js-cookie';
import {getCurrentUser} from "@/lib/auth";
import {useRouter} from "next/navigation";

const formSchema = z.object({
    email: z.string().email('Некорректный email'),
    password: z.string().min(8, 'Пароль должен быть не менее 8 символов'),
});

export function AuthForm({ isLogin }: { isLogin: boolean }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });
    const router = useRouter()

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await api.post(
                `auth/${isLogin ? 'login' : 'register'}`,
                values
            );

            if (response.data.access_token) {
                Cookies.set('auth_token', response.data.access_token);
                // Получаем данные пользователя
                const user = await getCurrentUser();
                console.log(user.role)
                // Редирект по роли
                if (user?.role === 'admin') {
                    console.log('wd')
                     router.push('/admin');
                } else if (user?.role === 'manager'){
                    router.push('/manager/sales');
                } else {
                    router.push('/my-orders')
                }
            }
        } catch (error) {
            console.error('Ошибка аутентификации:', error);
        }
    };


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Пароль</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">
                    {isLogin ? 'Войти' : 'Зарегистрироваться'}
                </Button>
            </form>
        </Form>
    );
}