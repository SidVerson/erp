'use client'
import {useEffect, useState} from 'react'
import {OrderTable} from '@/components/order-table'
import {Order} from '@/lib/types'
import {toast} from "sonner";
import api from "@/lib/axios";
import {getCurrentUser, logout} from "@/lib/auth";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {LogOut} from "lucide-react";

export default  function MyOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const user =  getCurrentUser()
    const router = useRouter()
    const log = () => {
        logout()
        router.push('/login')
    }
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders/my')
                setOrders(response.data)
            } catch (error) {
                toast('Ошибка загрузки')
            }
        }
        fetchOrders()
    }, [])

    return (
        <div className="container py-8">
            <div className={'flex w-full justify-between'}>

                <h1 className="text-2xl font-bold mb-6">Мои заказы</h1>
                <Button variant={'destructive'} onClick={log}><LogOut/></Button>
            </div>
                <OrderTable
                    data={orders}
                    hideActions
                    hideClient
                />
            </div>
            )
            }