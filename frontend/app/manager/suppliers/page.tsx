'use client'
import {useEffect, useState} from 'react'
import {SupplierTable} from '@/components/supplier-table'
import {CreateSupplierDialog} from '@/components/create-supplier-dialog'
import api from "@/lib/axios";

export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState([])

        const fetchSuppliers = async () => {
            const response = await api.get('/suppliers')
            setSuppliers(response.data)
        }
    useEffect(() => {
        fetchSuppliers()
    }, [])

    return (
        <div className="container py-8">
            <div className="flex justify-between mb-6">
                <h1 className="text-2xl font-bold">Управление поставщиками</h1>
                <CreateSupplierDialog updateFn={fetchSuppliers} />
            </div>
            <SupplierTable data={suppliers} />
        </div>
    )
}