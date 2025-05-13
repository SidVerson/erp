'use client'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import {Calendar} from '@/components/ui/calendar'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {cn} from '@/lib/utils'
import {CalendarIcon, Plus, Trash} from 'lucide-react'
import {format} from 'date-fns'
import {ru} from 'date-fns/locale'
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog'
import {Product} from '@/lib/types'
import {useEffect, useState} from "react"
import api from "@/lib/axios"
import {toast} from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const formSchema = z.object({
    clientId: z.number().min(1, "Выберите клиента"),
    shipmentDate: z.date(),
    items: z.array(z.object({
        productId: z.number().min(1, "Выберите товар"),
        quantity: z.number().min(1, "Минимальное количество 1")
    })).min(1, "Добавьте хотя бы один товар")
})

export function CreateOrderDialog({ onSuccess }: { onSuccess: (order: any) => void }) {
    const [open, setOpen] = useState(false)
    const [clients, setClients] = useState<any[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [showPurchaseDialog, setShowPurchaseDialog] = useState(false)
    const [insufficientItems, setInsufficientItems] = useState<{productId: number, required: number, available: number}[]>([])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            shipmentDate: new Date(),
            items: []
        }
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [clientsRes, productsRes] = await Promise.all([
                    api.get('/users?role=customer'),
                    api.get('/products?includeStock=true')
                ])
                setClients(clientsRes.data)
                setProducts(productsRes.data)
            } catch (error) {
                toast('Ошибка загрузки данных')
            }
        }
        fetchData()
    }, [])

    const createPurchaseOrders = async () => {
        try {
            for (const item of insufficientItems) {
                const product = products.find(p => p.id === item.productId)
                if (product) {
                    await api.post('/purchases', {
                        supplierId: product.supplier.id,
                        items: [{
                            productId: item.productId,
                            quantity: item.required - item.available
                        }]
                    })
                }
            }
            toast("Закупки созданы")
            // Повторяем создание заказа
            submitOrder(form.getValues())
        } catch (error) {
            toast.error("Ошибка при создании закупок")
        }
    }

    const submitOrder = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await api.post('/orders', {
                ...values,
                shipmentDate: values.shipmentDate.toISOString()
            })
            onSuccess(response.data)
            setOpen(false)
            form.reset()
            toast("Заказ успешно создан")
        } catch (error: any) {
            if (error.response?.status === 409 && error.response?.data?.message?.includes('Недостаточно товара')) {
                // Парсим сообщение об ошибке для получения информации о недостающих товарах
                const items = values.items.map(item => {
                    const product = products.find(p => p.id === item.productId)
                    const stock = product?.warehouse?.[0]?.inStock || 0
                    if (stock < item.quantity) {
                        return {
                            productId: item.productId,
                            required: item.quantity,
                            available: stock
                        }
                    }
                    return null
                }).filter(Boolean)
                
                setInsufficientItems(items)
                setShowPurchaseDialog(true)
            } else {
                toast.error("Ошибка при создании заказа")
            }
        }
    }

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        submitOrder(values)
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>Новый заказ</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Создание нового заказа</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Клиент и дата отгрузки */}
                            <FormField
                                control={form.control}
                                name="clientId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Клиент</FormLabel>
                                        <Select onValueChange={v => field.onChange(Number(v))}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Выберите клиента" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {clients.map(client => (
                                                    <SelectItem key={client.id} value={client.id.toString()}>
                                                        {client.email}
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
                                name="shipmentDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Дата отгрузки</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-[240px] pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP", { locale: ru })
                                                        ) : (
                                                            <span>Выберите дату</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) => date < new Date()}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Секция выбора товаров */}
                            <div className="space-y-4">
                                <FormLabel>Товары в заказе</FormLabel>
                                {form.watch('items').map((_, index) => (
                                    <div key={index} className="flex gap-2 items-start">
                                        <FormField
                                            control={form.control}
                                            name={`items.${index}.productId`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <Select
                                                        value={field.value?.toString() || ''}
                                                        onValueChange={v => field.onChange(Number(v))}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Выберите товар" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {products.map(product => (
                                                                <SelectItem
                                                                    key={product.id}
                                                                    value={product.id.toString()}
                                                                    disabled={
                                                                        form.getValues('items').some(
                                                                            (item, i) =>
                                                                                item.productId === product.id && i !== index
                                                                        ) || (product.warehouse?.[0]?.inStock || 0) === 0
                                                                    }
                                                                >
                                                                    {product.name} ({product.warehouse?.[0]?.inStock || 0} в наличии)
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
                                            name={`items.${index}.quantity`}
                                            render={({ field }) => (
                                                <FormItem className="w-32">
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            {...field}
                                                            onChange={e => {
                                                                const value = parseInt(e.target.value)
                                                                field.onChange(isNaN(value) ? 0 : value)
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            type="button"
                                            onClick={() => {
                                                const items = form.getValues('items')
                                                form.setValue('items', items.filter((_, i) => i !== index))
                                            }}
                                        >
                                            <Trash className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                ))}

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => form.setValue('items', [...form.getValues('items'), { productId: 0, quantity: 1 }])}
                                >
                                    <Plus className="mr-2 h-4 w-4" /> Добавить товар
                                </Button>
                            </div>

                            <Button type="submit" className="w-full">
                                Создать заказ
                            </Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Недостаточно товара</AlertDialogTitle>
                        <AlertDialogDescription>
                            Для выполнения заказа не хватает следующих товаров:
                            {insufficientItems.map(item => {
                                const product = products.find(p => p.id === item.productId)
                                return (
                                    <div key={item.productId} className="mt-2">
                                        {product?.name}: требуется {item.required}, в наличии {item.available}
                                    </div>
                                )
                            })}
                            Хотите автоматически создать закупки на недостающее количество?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction onClick={createPurchaseOrders}>
                            Создать закупки
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}