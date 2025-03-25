'use client'

import {ColumnDef} from "@tanstack/react-table"
import {Product, Supplier} from "@/lib/types"
import {DataTable} from "@/components/ui/data-table"
import {EditProductDialog} from "@/components/edit-product-dialog";

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