'use client'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {OrderTable} from '@/components/order-table'
import {CreateOrderDialog} from '@/components/create-order-dialog'
import {Order} from '@/lib/types'
import {useEffect, useState} from "react";
import api from "@/lib/axios";
import {toast} from "sonner";

export default function SalesPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [statusFilter, setStatusFilter] = useState('pending')

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get(`/orders?status=${statusFilter}`)
                setOrders(response.data)
            } catch (error) {
                toast( 'Ошибка загрузки')
            }
        }
        fetchOrders()
    }, [statusFilter])

    const handleStatusChange = async (orderId: number, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus })
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            ))
        } catch (error) {
            toast( 'Ошибка обновления')
        }
    }

    return (
        <div className="container py-8">
            <div className="flex justify-between mb-6">
                <h1 className="text-2xl font-bold">Управление продажами</h1>
                <CreateOrderDialog
                    onSuccess={(newOrder) => setOrders([...orders, newOrder])}
                />
            </div>

            <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
                <TabsList>
                    <TabsTrigger value="pending">Заявки</TabsTrigger>
                    <TabsTrigger value="in_progress">В работе</TabsTrigger>
                    <TabsTrigger value="completed">Завершенные</TabsTrigger>
                </TabsList>

                {(['pending', 'in_progress', 'completed'] as const).map(status => (
                    <TabsContent key={status} value={status}>
                        <OrderTable
                            data={orders.filter(o => o.status === status)}
                            onStatusChange={handleStatusChange}
                        />
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}