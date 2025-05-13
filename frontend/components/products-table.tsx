'use client'

import {ColumnDef} from "@tanstack/react-table"
import {Product, Supplier} from "@/lib/types"
import {DataTable} from "@/components/ui/data-table"
import {EditProductDialog} from "@/components/edit-product-dialog"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import api from "@/lib/axios"
import {toast} from "sonner"
import {useState} from "react"

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
        accessorKey: "quantity",
        header: "Количество",
        cell: ({ row }) => {
            const [quantity, setQuantity] = useState(row.original.quantity || 0)
            const [isEditing, setIsEditing] = useState(false)

            const handleSave = async (newQuantity: number) => {
                try {
                    await api.put(`/products/${row.original.id}/quantity`, { quantity: newQuantity })
                    setQuantity(newQuantity)
                    setIsEditing(false)
                    toast("Количество обновлено")
                } catch (error) {
                    toast.error("Ошибка при обновлении количества")
                }
            }

            if (isEditing) {
                return (
                    <div className="flex gap-2 items-center">
                        <Input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="w-20"
                            min={0}
                        />
                        <Button size="sm" onClick={() => handleSave(quantity)}>
                            Сохранить
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                            Отмена
                        </Button>
                    </div>
                )
            }

            return (
                <div className="flex gap-2 items-center">
                    <span>{quantity}</span>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                        Изменить
                    </Button>
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
                    {/*<Button*/}
                    {/*    variant="destructive"*/}
                    {/*    size="sm"*/}
                    {/*    onClick={() => onDelete(product.id)}*/}
                    {/*>*/}
                    {/*    <Trash/>*/}
                    {/*</Button>*/}
                </div>
            )
        }
    }
]

export function ProductsTable({
                                  products,
                                  onEdit,
                                  onDelete,
                                  suppliers
                              }: {
    products: Product[]
    onEdit: (product: Product) => void
    onDelete?: (id: number) => void
    suppliers?: Supplier[]
}) {
    return (
        <DataTable
            columns={columns({suppliers, onEdit, onDelete})}
            data={products}
            onRowClick={onEdit}
            onDelete={onDelete}
        />
    )
}