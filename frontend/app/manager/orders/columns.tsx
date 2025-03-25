import {ColumnDef} from "@tanstack/react-table"
import {Order} from "@/lib/types"

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Номер заказа",
  },
  {
    accessorKey: "client.email",
    header: "Клиент",
  },
  {
    accessorKey: "status",
    header: "Статус",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return <span className="capitalize">{status}</span>
    }
  },
  {
    accessorKey: "shipmentDate",
    header: "Дата отгрузки",
    cell: ({ row }) => new Date(row.getValue("shipmentDate")).toLocaleDateString()
  },
  {
    accessorKey: "totalPrice",
    header: "Сумма",
    cell: ({ row }) => `$${row.getValue("totalPrice")}`
  }
]