import {ColumnDef} from "@tanstack/react-table"
import {Procurement} from "@/lib/types"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {Button} from "@/components/ui/button"
import {MoreHorizontal} from "lucide-react"
import {toast} from "sonner";
import api from "@/lib/axios";

export const columns: ColumnDef<Procurement>[] = [
    {
        accessorKey: "supplier.name",
        header: "Поставщик",
    },
    {
        accessorKey: "product.name",
        header: "Товар",
    },
    {
        accessorKey: "quantity",
        header: "Количество",
    },
    {
        accessorKey: "deliveryDate",
        header: "Дата поставки",
        cell: ({ row }) => new Date(row.getValue("deliveryDate")).toLocaleDateString()
    },
    {
        accessorKey: "price",
        header: "Цена",
        cell: ({ row }) => `$${row.getValue("price")}`
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const procurement = row.original

            const handleDelete = async () => {
                try {
                    await api.delete(`/procurements/${procurement.id}`)
                    toast(  "Закупка удалена" )
                    window.location.reload()
                } catch (error) {
                    toast("Ошибка")
                }
            }

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => prompt("Новая дата поставки (YYYY-MM-DD):")?.then(
                                async (date) => date && await api.put(`/procurements/${procurement.id}/delivery-date`, { deliveryDate: date })
                            )}
                        >
                            Изменить дату
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500" onClick={handleDelete}>
                            Удалить
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]