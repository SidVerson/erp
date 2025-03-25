'use client'
import {columns} from './columns'
import {Order} from '@/lib/types'
import {useEffect, useState} from "react";
import api from "@/lib/axios";
import {CreateOrderDialog} from "@/components/create-order-dialog";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {OrdersTable} from "@/components/orders-table";

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [statusFilter, setStatusFilter] = useState<'pending' | 'in_progress' | 'completed'>('pending')
    useEffect(() => {
        const fetchOrders = async () => {
            const response = await api.get(`/orders?status=${statusFilter}`)
            setOrders(response.data)
        }
        fetchOrders()
    }, [statusFilter])
    const filteredOrders = orders.filter(order => order.status === statusFilter);


    return (
        <div className="container py-8">
            <Tabs value={statusFilter}>
                <TabsList>
                    <TabsTrigger value="pending" onClick={() => setStatusFilter('pending')}>Заявки</TabsTrigger>
                    <TabsTrigger value="in_progress" onClick={() => setStatusFilter('in_progress')}>В
                        работе</TabsTrigger>
                    <TabsTrigger value="completed"
                                 onClick={() => setStatusFilter('completed')}>Завершенные</TabsTrigger>
                </TabsList>

                <TabsContent value={statusFilter}>
                    <OrdersTable columns={columns} data={filteredOrders}/>
                </TabsContent>
            </Tabs>

            <CreateOrderDialog/>
        </div>
    )
}