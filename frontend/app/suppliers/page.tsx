'use client'

import {useEffect, useState} from 'react'
import {Supplier} from '@/lib/types'
import api from '@/lib/axios'
import {DataTable} from '@/components/ui/data-table'
import {ColumnDef} from '@tanstack/react-table'
import {Button} from '@/components/ui/button'
import {EditSupplierDialog} from '@/components/edit-supplier-dialog'
import {toast} from 'sonner'

const columns: ColumnDef<Supplier>[] = [
    {
        accessorKey: 'name',
        header: 'Название'
    },
    {
        accessorKey: 'email',
        header: 'Email'
    },
    {
        accessorKey: 'phone',
        header: 'Телефон'
    },
    {
        accessorKey: 'address',
        header: 'Адрес'
    },
    {
        id: 'actions',
        cell: ({row}) => {
            const supplier = row.original
            return (
                <div className="flex gap-2">
                    <EditSupplierDialog
                        supplier={supplier}
                        onSuccess={() => window.location.reload()}
                    />
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                            if (confirm('Вы уверены, что хотите удалить этого поставщика?')) {
                                try {
                                    await api.delete(`/suppliers/${supplier.id}`)
                                    toast('Поставщик удален')
                                    window.location.reload()
                                } catch (error) {
                                    toast.error('Ошибка при удалении поставщика')
                                }
                            }
                        }}
                    >
                        Удалить
                    </Button>
                </div>
            )
        }
    }
]

export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([])

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await api.get('/suppliers')
                setSuppliers(response.data)
            } catch (error) {
                toast.error('Ошибка при загрузке поставщиков')
            }
        }

        fetchSuppliers()
    }, [])

    return (
        <div className="container py-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Поставщики</h1>
                <Button
                    onClick={async () => {
                        const name = prompt('Введите название поставщика')
                        if (name) {
                            try {
                                await api.post('/suppliers', {name})
                                toast('Поставщик добавлен')
                                window.location.reload()
                            } catch (error) {
                                toast.error('Ошибка при добавлении поставщика')
                            }
                        }
                    }}
                >
                    Добавить поставщика
                </Button>
            </div>
            <DataTable columns={columns} data={suppliers}/>
        </div>
    )
} 