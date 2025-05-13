'use client'

import {Dispatch, SetStateAction, useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'
import {Dialog, DialogContent, DialogHeader, DialogTitle,} from '@/components/ui/dialog'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select'
import api from '@/lib/axios'
import {Product} from '@/lib/types'
import {toast} from "sonner";

const formSchema = z.object({
    name: z.string().min(2, 'Минимум 2 символа'),
    category: z.string().min(2, 'Минимум 2 символа'),
    description: z.string().optional(),
    supplierId: z.string().min(1, 'Выберите поставщика'),
    price: z.number().min(0.01, 'Минимальная цена 0.01')
})

export function ProductDialog({
    setOpen,
    open,
                                  product,
                                  onSuccess,
                                  onOpenChange
                              }: {
    open:boolean

    product?: Product
    onSuccess: () => void
    onOpenChange: (open: boolean) => void
    setOpen: Dispatch<SetStateAction<boolean>>
}) {
    const [suppliers, setSuppliers] = useState([])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            category: '',
            description: '',
            supplierId: '',
            price: 0.01
        }
    })

    useEffect(() => {
        if (product) {
            form.reset({
                ...product,
                supplierId: String(product.supplier?.id),
                price: Number(product.price)
            })
        }
    }, [product])

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await api.get('/suppliers')
                setSuppliers(response.data)
            } catch (error) {
                console.error('Ошибка загрузки поставщиков:', error)
            }
        }
        if (open) fetchSuppliers()
    }, [open])

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const data = {
                ...values,
                supplierId: Number(values.supplierId)
            }

            if (product?.id) {
                await api.patch(`/products/${product.id}`, data)
            } else {
                await api.post('/products', data)
            }

            onSuccess()

            toast(`Товар ${product?.id ? 'обновлен' : 'создан'}` )
        } catch (error) {
            toast( 'Ошибка')
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[500px] w-full">
                <DialogHeader>
                    <DialogTitle>{product ? 'Редактирование товара' : 'Создание нового товара'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 min-h-[400px] overflow-y-auto p-4">
                        <div className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Название</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="w-full" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Категория</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="w-full" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Описание</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="w-full" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="supplierId"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Поставщик</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Выберите поставщика" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {suppliers.map(supplier => (
                                                    <SelectItem key={supplier.id} value={String(supplier.id)}>
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
                                    <FormItem className="flex-1">
                                        <FormLabel>Цена</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0.01"
                                                {...field}
                                                onChange={e => field.onChange(Number(e.target.value))}
                                                className="w-full"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Отмена
                            </Button>
                            <Button type="submit">Сохранить</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}