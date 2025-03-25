'use client'
import {useEffect, useState} from 'react'
import {ProcurementTable} from '@/components/procurements-table'
import {CreateProcurementDialog} from '@/components/create-procurement-dialog'
import {Skeleton} from '@/components/ui/skeleton'
import {Procurement} from '@/lib/types'
import api from "@/lib/axios";

export default function ProcurementsPage() {
    const [procurements, setProcurements] = useState<Procurement[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/procurements')
                setProcurements(response.data)
            } catch (error) {
                console.error('Ошибка загрузки закупок:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="container py-8 space-y-4">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-64 w-full" />
            </div>
        )
    }

    return (
        <div className="container py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Управление закупками</h1>
                <CreateProcurementDialog
                    onSuccess={(newProcurement) => setProcurements([...procurements, newProcurement])}
                />
            </div>

            <ProcurementTable
                data={procurements}
                onDateChange={async (id, newDate) => {
                    await api.put(`/procurements/${id}/delivery-date`, { deliveryDate: newDate })
                    setProcurements(procurements.map(p =>
                        p.id === id ? {...p, deliveryDate: newDate} : p
                    ))
                }}
            />
        </div>
    )
}