'use client'

import {Button} from "@/components/ui/button"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Supplier} from "@/lib/types"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import * as z from "zod"
import api from "@/lib/axios"
import {toast} from "sonner"
import {Edit} from "lucide-react"

const formSchema = z.object({
    name: z.string().min(2, "Название должно быть не менее 2 символов"),
    email: z.string().email("Введите корректный email"),
    phone: z.string().min(10, "Введите корректный номер телефона"),
    address: z.string().min(5, "Адрес должен быть не менее 5 символов")
})

export function EditSupplierDialog({
    supplier,
    onSuccess
}: {
    supplier: Supplier
    onSuccess: () => void
}) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: supplier.name,
            email: supplier.email,
            phone: supplier.phone,
            address: supplier.address
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await api.put(`/suppliers/${supplier.id}`, values)
            toast("Поставщик успешно обновлен")
            onSuccess()
        } catch (error) {
            toast.error("Ошибка при обновлении поставщика")
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Edit/>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Редактирование поставщика</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Название</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="email" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Телефон</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="tel" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Адрес</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit">Сохранить</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
} 