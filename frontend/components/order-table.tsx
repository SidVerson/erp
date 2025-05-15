'use client'
import {ColumnDef, flexRender, getCoreRowModel, useReactTable} from '@tanstack/react-table'
import {Order} from '@/lib/types'
import {Button} from '@/components/ui/button'
import {Badge} from '@/components/ui/badge'
import {format} from 'date-fns'
import {ru} from 'date-fns/locale'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";


export function OrderTable({ data, onStatusChange,  hideActions = false,
                               hideClient = false }: { data: Order[], onStatusChange: any, hideActions?: boolean
    hideClient?: boolean }) {
    const columns: ColumnDef<Order>[] = [
        {
            accessorKey: "orderNumber",
            header: "Номер заказа",
        },
        {
            accessorKey: "client.email",
            header: "Клиент",
        },
        {
            accessorKey: "shipmentDate",
            header: "Дата отгрузки",
            cell: ({ row }) => format(new Date(row.getValue("shipmentDate")), 'dd MMMM yyyy', { locale: ru })
        },
        {
            accessorKey: "totalPrice",
            header: "Сумма",
            cell: ({ row }) => `${row.getValue('totalPrice')} BYN`
        },
        {
            accessorKey: "status",
            header: "Статус",
            cell: ({ row }) => {
                const status = row.getValue('status')
                const variant = {
                    pending: 'secondary',
                    in_progress: 'default',
                    completed: 'success'
                }[status]

                return <Badge variant={variant}>{{
                    pending: 'Заявка',
                    in_progress: 'В работе',
                    completed: 'Завершен'
                }[status]}</Badge>
            }
        },
        {
            id: "actions",
            cell: ({ row, table }) => {
                const order = row.original
                const status = order.status

                return (
                    <div className="flex gap-2">
                        {status === 'pending' && (
                            <Button
                                size="sm"
                                onClick={() => onStatusChange(order.id, 'in_progress')}
                            >
                                В работу
                            </Button>
                        )}
                        {status === 'in_progress' && (
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => onStatusChange(order.id, 'completed')}
                            >
                                Завершить
                            </Button>
                        )}
                    </div>
                )
            }
        }
    ]
    const filteredColumns = columns.filter(column => {
        if (hideActions && column.id === 'actions') return false
        if (hideClient && column.accessorKey === 'client.email') return false
        return true
    })
    const table = useReactTable({
        data,
        columns: filteredColumns,
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