'use client'
import {useEffect, useState} from 'react'
import {OrderTable} from '@/components/order-table'
import {Order} from '@/lib/types'
import {toast} from "sonner";
import api from "@/lib/axios";
import {getCurrentUser} from "@/lib/auth";
import {useRouter} from "next/navigation";

export default  function MyOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const user =  getCurrentUser()
    const router = useRouter()

    if (!user) {
        router.push('/login')
    }
    if (user.role === 'admin') {
        router.push('/admin')
    }
    if (user.role === 'manager') {
        router.push('/manager')
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
            <h1 className="text-2xl font-bold mb-6">Мои заказы</h1>
            
            <OrderTable
                data={orders}
                hideActions
                hideClient
            />
        </div>
    )
}