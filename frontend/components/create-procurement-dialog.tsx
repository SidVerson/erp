'use client'
import {useEffect, useState} from 'react'
import {Button} from "@/components/ui/button"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import {Input} from "@/components/ui/input"
import {Calendar} from "@/components/ui/calendar"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import api from "@/lib/axios"
import {Procurement, Product, Supplier} from "@/lib/types"
import {toast} from "sonner";

const formSchema = z.object({
    supplierId: z.number().min(1, "Выберите поставщика"),
    productId: z.number().min(1, "Выберите товар"),
    quantity: z.number().min(1, "Минимальное количество 1"),
    deliveryDate: z.date(),
})

export function CreateProcurementDialog({ onSuccess }: { onSuccess: (data: Procurement) => void }) {
    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            quantity: 1,
            deliveryDate: new Date(),
        }
    })

    useEffect(() => {
        const fetchData = async () => {
            const [suppliersRes, productsRes] = await Promise.all([
                api.get('/suppliers'),
                api.get('/products')
            ])
            setSuppliers(suppliersRes.data)
            setProducts(productsRes.data)
        }
        fetchData()
    }, [])

    useEffect(() => {
        const supplierId = form.watch('supplierId')
        if (supplierId) {
            setFilteredProducts(products.filter(product => product.supplier?.id === supplierId))
        } else {
            setFilteredProducts([])
        }
        form.setValue('productId', undefined)
    }, [form.watch('supplierId'), products])

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await api.post('/procurements', {
                ...values,
                deliveryDate: new Date(values.deliveryDate)
            })
            onSuccess(response.data)
            setOpen(false)
            form.reset()
            toast( "Закупка успешно создана" )
        } catch (error) {
            toast( "Ошибка")
        }finally{
            console.log('finally')
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Новая закупка</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Создание новой закупки</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="supplierId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Поставщик</FormLabel>
                                    <Select onValueChange={(value) => field.onChange(Number(value))}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Выберите поставщика" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {suppliers.map(supplier => (
                                                <SelectItem key={supplier.id} value={supplier.id.toString()}>
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
                            name="productId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Товар</FormLabel>
                                    <Select 
                                        onValueChange={(value) => field.onChange(Number(value))}
                                        disabled={!form.watch('supplierId')}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={form.watch('supplierId') ? "Выберите товар" : "Сначала выберите поставщика"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {filteredProducts.map(product => (
                                                <SelectItem key={product.id} value={product.id.toString()}>
                                                    {product.name}
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
                            name="quantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Количество</FormLabel>
                                    <div className="flex items-center gap-2">
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="1"
                                                {...field}
                                                onChange={e => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="deliveryDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Дата приёмки</FormLabel>
                                    <FormControl>
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full">
                            Создать закупку
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}