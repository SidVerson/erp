'use client';

import {useEffect, useState} from 'react';
import {DataTable} from '@/components/users-table';
import {columns} from './columns';
import {User} from '@/lib/types';
import api from "@/lib/axios";
import {CreateUserDialog} from "@/components/create-user-dialog";
import {getCurrentUser} from "@/lib/auth";
import {useRouter} from "next/navigation";

export default function AdminPage() {
    const user =  getCurrentUser()
    const router = useRouter()

    if (!user) {
        router.push('/login')
    }

    if (user.role === 'customer') {
        router.push('/my-orders')
    }

    if (user.role === 'manager') {
        router.push('/manager')
    }
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Ошибка загрузки пользователей:', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="container flex flex-col gap-8 w-full">
            <h1 className="text-2xl font-bold">Управление пользователями</h1>
            <CreateUserDialog/>
            <DataTable columns={columns} data={users}/>
        </div>
    );
}