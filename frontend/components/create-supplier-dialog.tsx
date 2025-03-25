'use client'

import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from '@/components/ui/dialog'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import {Plus} from 'lucide-react'
import api from '@/lib/axios'
import {useState} from "react";
import {toast} from "sonner";

const formSchema = z.object({
    name: z.string().min(2, 'Минимум 2 символа'),
    address: z.string().min(5, 'Минимум 5 символов'),
    email: z.string().email('Некорректный email'),
    phone: z.string().min(5, 'Минимум 5 символов')
})

interface CreateSupplierDialogProps {
    updateFn?: () => Promise<void>
}

export function CreateSupplierDialog({updateFn}:{updateFn: () => Promise<void>}) {
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            address: '',
            email: '',
            phone: ''
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // В форме отправки данных
            await api.post('/suppliers', {
                name: values.name,
                address: values.address,
                email: values.email,    // ← Важное изменение!
                phone: values.phone     // ← Важное изменение!
            });
            toast('✅ Поставщик успешно создан')
            form.reset()
            setOpen(false)
            updateFn()
        } catch (error) {
            toast('❌ Ошибка')
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4"/> Новый поставщик
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Создание нового поставщика</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Название компании</FormLabel>
                                    <FormControl>
                                        <Input placeholder="ООО Пример" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Юридический адрес</FormLabel>
                                    <FormControl>
                                        <Input placeholder="г. Москва, ул. Примерная, д. 1" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Контактный email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="info@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Контактный телефон</FormLabel>
                                    <FormControl>
                                        <Input placeholder="+7 (999) 123-45-67" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full">
                            Создать поставщика
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}