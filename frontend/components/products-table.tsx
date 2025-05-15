'use client'

import {ColumnDef} from "@tanstack/react-table"
import {Product, Supplier} from "@/lib/types"
import {DataTable} from "@/components/ui/data-table"
import {EditProductDialog} from "@/components/edit-product-dialog"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import api from "@/lib/axios"
import {toast} from "sonner"
import {useState, useEffect} from "react"

export const columns = ({
                            suppliers,
                            onEditSuccess,
                            onDelete
                        }: {
    suppliers: Supplier[]
    onEditSuccess: () => void
    onDelete: (id: number) => void
}): ColumnDef<Product>[] => [
    { accessorKey: "name", header: "Наименование" },
    { accessorKey: "category", header: "Категория" },
    { accessorKey: "description", header: "Описание" },
    {
        accessorKey: "supplier.name",
        header: "Поставщик",
        cell: ({ row }) => row.original.supplier?.name || '-'
    },
    {
        accessorKey: "price",
        header: "Цена",
        cell: ({ row }) => `${Number(row.getValue('price')).toFixed(2)}`
    },
    {
        accessorKey: "stock",
        header: "Наличие",
        cell: ({ row }) => {
            const stock = row.original.stock
            if (!stock) return "0 в наличии"
            
            return (
                <div>
                    <span>{stock.inStock || 0} в наличии</span>
                    {stock.expected > 0 && (
                        <span className="text-muted-foreground ml-2">
                            ({stock.expected} ожидается)
                        </span>
                    )}
                </div>
            )
        }
    },
    {
        id: "actions",
        cell: ({row}) => {
            const product = row.original

            return (
                <div className="flex gap-2">
                    <EditProductDialog
                        product={product}
                        suppliers={suppliers}
                        onSuccess={onEditSuccess}
                    />
                </div>
            )
        }
    }
]

export function ProductsTable({
                                products: initialProducts,
                                onEdit,
                                onDelete,
                                suppliers
                            }: {
    products: Product[]
    onEdit: (product: Product) => void
    onDelete?: (id: number) => void
    suppliers?: Supplier[]
}) {
    const [products, setProducts] = useState<Product[]>(initialProducts)

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const warehouseRes = await api.get('/warehouse/all')
                const productsWithStock = initialProducts.map(product => {
                    const stockInfo = warehouseRes.data.find((item: any) => item.product.id === product.id)
                    return {
                        ...product,
                        stock: {
                            inStock: stockInfo?.inStock || 0,
                            expected: stockInfo?.expected || 0
                        }
                    }
                })
                setProducts(productsWithStock)
            } catch (error) {
                toast.error('Ошибка загрузки данных о наличии')
            }
        }
        fetchStockData()
    }, [initialProducts])

    return (
        <DataTable
            columns={columns({
                suppliers: suppliers || [], 
                onEditSuccess: () => {}, 
                onDelete: onDelete || (() => {})
            })}
            data={products}
            onRowClick={onEdit}
            onDelete={onDelete}
        />
    )
}