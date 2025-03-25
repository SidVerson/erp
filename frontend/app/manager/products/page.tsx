'use client'

import {useEffect, useState} from 'react'
import {ProductsTable} from '@/components/products-table'
import {ProductDialog} from '@/components/product-dialog'
import {Product} from '@/lib/types'
import api from '@/lib/axios'
import {Button} from '@/components/ui/button'
import {Plus} from "lucide-react";

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [suppliers, setSuppliers] = useState([])
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const setDialog = (col) => {
        setDialogOpen(false)
    }
    const fetchProducts = async () => {
        try {
            const response = await api.get('/products')
            setProducts(response.data)
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error)
        }
    }

    const fetchSuppliers = async () => {
        try {
            const response = await api.get('/suppliers')
            setSuppliers(response.data)
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error)
        }
    }


    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/products/${id}`)
            fetchProducts()
        } catch (error) {
            console.error('Ошибка удаления:', error)
        }
    }

    useEffect(() => {
        fetchProducts()
        fetchSuppliers()
    }, [])

    return (
        <div className="container py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Управление товарами</h1>
                <Button onClick={() => {
                    setCurrentProduct(null)
                    setDialogOpen(true)
                }}>
                    <Plus className="mr-2 h-4 w-4" /> Новый товар
                </Button>
                <ProductDialog
                    setOpen={setDialog}
                    open={dialogOpen}
                    onSuccess={fetchProducts}
                    onOpenChange={() => setCurrentProduct(null)}
                />
            </div>

            <ProductsTable
                products={products}
                onEdit={setCurrentProduct}
                suppliers={suppliers}
                onDelete={handleDelete}
            />

            {/*{currentProduct && (*/}
            {/*    <ProductDialog*/}
            {/*        product={currentProduct}*/}
            {/*        onSuccess={fetchProducts}*/}
            {/*        onOpenChange={() => setCurrentProduct(null)}*/}
            {/*    />*/}
            {/*)}*/}
        </div>
    )
}