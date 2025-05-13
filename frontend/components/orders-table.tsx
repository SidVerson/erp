'use client'

import {ColumnDef, flexRender, getCoreRowModel, useReactTable,} from '@tanstack/react-table'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table'
import {Order} from '@/lib/types'
import {Button} from '@/components/ui/button'
import {ArrowUpDown} from 'lucide-react'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import api from "@/lib/axios"
import {toast} from "sonner"

export const columns: ColumnDef<Order>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Номер заказа
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: 'client.email',
        header: 'Клиент',
    },
    {
        accessorKey: 'status',
        header: 'Статус',
        cell: ({ row }) => {
            const status = row.getValue('status')
            const orderId = row.getValue('id')
            const statusMap = {
                pending: { label: 'Ожидает', color: 'bg-yellow-100 text-yellow-800' },
                in_progress: { label: 'В работе', color: 'bg-blue-100 text-blue-800' },
                completed: { label: 'Завершен', color: 'bg-green-100 text-green-800' }
            }

            const handleStatusChange = async (newStatus: string) => {
                try {
                    await api.put(`/orders/${orderId}/status`, { status: newStatus })
                    toast("Статус заказа обновлен")
                    window.location.reload()
                } catch (error) {
                    toast.error("Ошибка при обновлении статуса")
                }
            }

            return (
                <Select onValueChange={handleStatusChange} defaultValue={status}>
                    <SelectTrigger className={`w-[140px] ${statusMap[status].color}`}>
                        <SelectValue placeholder="Выберите статус" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pending">Ожидает</SelectItem>
                        <SelectItem value="in_progress">В работе</SelectItem>
                        <SelectItem value="completed">Завершен</SelectItem>
                    </SelectContent>
                </Select>
            )
        }
    },
    {
        accessorKey: 'shipmentDate',
        header: 'Дата отгрузки',
        cell: ({ row }) => new Date(row.getValue('shipmentDate')).toLocaleDateString()
    },
    {
        accessorKey: 'totalPrice',
        header: 'Сумма',
        cell: ({ row }) => `$${row.getValue('totalPrice').toFixed(2)}`
    }
]

export function OrdersTable({ data }: { data: Order[] }) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <TableHead key={header.id}>
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map(row => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && 'selected'}
                            >
                                {row.getVisibleCells().map(cell => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                Нет данных
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}