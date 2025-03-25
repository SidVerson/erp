import {ColumnDef} from "@tanstack/react-table"
import {User} from "@/lib/types"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {Button} from "@/components/ui/button"
import {MoreHorizontal} from "lucide-react"
import api from "@/lib/axios"
import {toast} from "sonner"


export const columns: ColumnDef<User>[] = [
    { accessorKey: "email", header: "Email" },
    {
        accessorKey: "role",
        header: "Роль",
        cell: ({ row }) => {
            const role = row.getValue("role") as string
            return <span className="capitalize">{role}</span>
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const user = row.original

            const handleDelete = async () => {
                try {
                    await api.delete(`/users/${user.id}`)
                    toast( "Пользователь удален")
                    window.location.reload()
                } catch (error) {
                    toast.error("Ошибка")
                }
            }

            const handleRoleChange = async (newRole: string) => {
                try {
                    await api.put(`/users/${user.id}/role`, { role: newRole })
                    toast( "Роль обновлена" )
                    window.location.reload()
                } catch (error) {
                    toast.error("Ошибка")
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
                        {/*<DropdownMenuItem*/}
                        {/*    onClick={() => prompt("Новый email:", user.email)?.then(*/}
                        {/*        async (email) => email && await api.patch(`/users/${user.id}`, { email })*/}
                        {/*    }*/}
                        {/*>*/}
                        {/*    Изменить email*/}
                        {/*</DropdownMenuItem>*/}
                        {/*<DropdownMenuItem*/}
                        {/*    onClick={() => prompt("Новый пароль:")?.then(async (password) => password && await api.patch(`/users/${user.id}`, { password })}*/}
                        {/*>*/}
                        {/*    Сменить пароль*/}
                        {/*</DropdownMenuItem>*/}
                        <DropdownMenuItem onClick={() => handleRoleChange('admin')}>
                            Сделать администратором
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleChange('manager')}>
                            Сделать менеджером
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleChange('customer')}>
                            Сделать клиентом
                        </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDelete} className="text-red-500">
                                Удалить
                            </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]