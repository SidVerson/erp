'use client'
import {ColumnDef} from "@tanstack/react-table"
import {Procurement} from "@/lib/types"
import {DataTable} from "@/components/ui/data-table"
import {format} from 'date-fns'
import {ru} from 'date-fns/locale'
import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import api from "@/lib/axios";
import {toast} from "sonner";


export function ProcurementTable({
                                     data,
                                     onDateChange,
                                 }: {
    data: Procurement[]
    onDateChange: (id: number, newDate: Date) => void
}) {
    const handleDateChange = async (id: number, date: Date) => {
        try {
            await api.put(`/procurements/${id}/delivery-date`, { deliveryDate: date });
            onDateChange(id, date);
        } catch (error) {
            toast.error('Ошибка обновления даты');
        }
    };
    const columns: ColumnDef<Procurement>[] = [
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
            header: "Дата приёмки",
            cell: ({ row, table }) => {
                const procurement = row.original
                return (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost">
                                {format(new Date(procurement.deliveryDate), 'dd MMMM yyyy', { locale: ru })}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={new Date(procurement.deliveryDate)}
                                onSelect={(date) => date && handleDateChange(procurement.id, date)}
                            />
                        </PopoverContent>
                    </Popover>
                )
            }
        },
        {
            accessorKey: "unitPrice",
            header: "Стоимость",
            cell: ({ row }) => `${row.getValue('unitPrice')} ₽`
        },
    ]
    return (
        <DataTable
            columns={columns}
            data={data}
            meta={{ onDateChange }}
        />
    )
}