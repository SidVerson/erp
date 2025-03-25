'use client';

import {useEffect, useState} from 'react';
import {DataTable} from '@/components/users-table';
import {columns} from './columns';
import {User} from '@/lib/types';
import api from "@/lib/axios";
import {CreateUserDialog} from "@/components/create-user-dialog";
import {logout} from "@/lib/auth";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {LogOut} from "lucide-react";

export default function AdminPage() {
    const router = useRouter()
    const log = () => {
        logout()
        router.push('/login')
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
            <div className={'flex w-full justify-between'}>

            <h1 className="text-2xl font-bold">Управление пользователями</h1>
                <Button variant={'destructive'}  onClick={log}><LogOut /></Button>
            </div>
            <CreateUserDialog/>
            <DataTable columns={columns} data={users}/>
        </div>
    );
}