import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"

export function OrderStatusFilter({
                                      currentStatus,
                                      onStatusChange
                                  }: {
    currentStatus: string
    onStatusChange: (status: string) => void
}) {
    return (
        <Select value={currentStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Статус заказа" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Все</SelectItem>
                <SelectItem value="pending">Ожидает</SelectItem>
                <SelectItem value="in_progress">В работе</SelectItem>
                <SelectItem value="completed">Завершен</SelectItem>
            </SelectContent>
        </Select>
    )
}