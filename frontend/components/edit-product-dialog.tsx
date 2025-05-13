'use client'
import {Button} from "@/components/ui/button"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"

import {Product, Supplier} from "@/lib/types"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import * as z from "zod"
import api from "@/lib/axios"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {toast} from "sonner";
import {Edit} from "lucide-react";

const formSchema = z.object({
    name: z.string().min(2, "Название должно быть не менее 2 символов"),
    category: z.string().min(1, "Укажите категорию"),
    description: z.string().optional(),
    supplierId: z.number().min(1, "Выберите поставщика"),
    price: z.number().min(0.01, "Цена должна быть больше 0")
})

export function EditProductDialog({
                                      product,
                                      suppliers,
                                      onSuccess
                                  }: {
    product: Product
    suppliers: Supplier[]
    onSuccess: () => void
}) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: product.name,
            category: product.category,
            description: product.description || '',
            supplierId: product.supplier.id,
            price: product.price
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await api.put(`/products/${product.id}`, values)
            // onSuccess()
            toast( "Товар успешно обновлен" )
        } catch (error) {
            toast("Ошибка",)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button  size="sm">
                    <Edit/>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Редактирование товара</DialogTitle>
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
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Категория</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Описание</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} placeholder="Введите описание товара" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="supplierId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Поставщик</FormLabel>
                                    <Select
                                        onValueChange={(value) => field.onChange(Number(value))}
                                        value={field.value.toString()}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Выберите поставщика" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {suppliers.map(supplier => (
                                                <SelectItem
                                                    key={supplier.id}
                                                    value={supplier.id.toString()}
                                                >
                                                    {supplier.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Цена</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            {...field}
                                            onChange={e => field.onChange(Number(e.target.value))}
                                        />
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