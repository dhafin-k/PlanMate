import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, CheckCircle2, XCircle, List } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader , DialogTitle, DialogTrigger, DialogDescription, } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';

interface List {
    id: number;
    judul: string;
    deskripsi: string | null;
    tasks_count?: number;
}

interface Props {
    lists : List[];
    flash: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lists',
        href: '/lists',
    }
];

export default function ListsIndex({ lists, flash }: Props){
    const [isOpen, setIsOpen] = useState(false);
    const [editingList, setEditingList] = useState<List | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        if(flash?.success) {
            setToastMessage(flash.success);
            setToastType('success');
            setShowToast(true);
        } else if (flash.error) {
            setToastMessage(flash.error);
            setToastType('error');
            setShowToast(true);
        }
    }, [flash]);

    useEffect(() => {
        if(showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const { data, setData, post, put, processing, reset, delete: destroy } = useForm({
        judul: '',
        deskripsi: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(editingList) {
            put(`/lists/${editingList.id}`, {
                onSuccess: () =>{
                    setIsOpen(false);
                    reset();
                    setEditingList(null);
                },
            });
        }else {
            post('/lists',  {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                    setEditingList(null);
                },
            });
        }
    };

    const handelEdit= (list: List) => {
        setEditingList(list);
        setData({
            judul: list.judul,
            deskripsi: list.deskripsi || '',
        });
        setIsOpen(true);
    };

    const handleDelete = (listId: number) => {
        destroy(`/lists/${listId}`);
        setDeleteId(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Lists'/>
            <div className='flex h-full flex-1 flex-col gap-4 rounded-xl px-8 pt-4'>
                {showToast && (
                    <div className={`fixed top-4 right-4 z-50 items-center flex gap-2 rounded-lg p-4 shadow-lg ${
                        toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
                    } text-white animate-in fade-in slide-in-from-top-5`}>
                        { toastType === 'success' ? (
                            <CheckCircle2 className='h-5 w-5' />
                        ): (
                            <XCircle className='h-5 w-5' />
                        )}
                        <span>{toastMessage}</span>
                    </div>
                )}
                <div className='flex justify-between items-center'>
                    <h1 className='text-2xl font-bold'>Lists</h1>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className='h-4 w-4 mr-2'/>
                                Tugas Baru
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingList ? 'Edit List' : 'Tugas Baru'}</DialogTitle>
                                <DialogDescription>
                                    {editingList ? 'Ubah informasi list Anda' : 'Buat list baru untuk mengorganisir tasks Anda'}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className='space-y-4'>
                                <div className='space-y-2'>
                                    <Label htmlFor='judul'>Judul</Label>
                                    <Input
                                        type="text"
                                        id='judul'
                                        value={data.judul}
                                        onChange={(e) => setData('judul', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor='deskripsi'>Deskripsi</Label>
                                    <Textarea
                                        name="deskripsi"
                                        id="deskripsi"
                                        className='flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                                        value={data.deskripsi}
                                        onChange={(e) => setData('deskripsi',e.target.value)}
                                    />
                                </div>
                                <Button type='submit' disabled={processing}>
                                    {editingList ? 'Update List' : 'Create List'}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {lists.map((list) => (
                        <Card key={list.id} className='hover:bg-accent/50 transition-colors'>
                            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                <CardTitle className='text-lg font-medium'>{list.judul}</CardTitle>
                                <div className='flex gap-2'>
                                    <Button
                                        variant='ghost'
                                        size="icon"
                                        onClick={() => handelEdit(list)}
                                    >
                                        <Pencil className='h-4 w-4'/>
                                    </Button>
                                    <Button
                                        variant='ghost'
                                        size="icon"
                                        onClick={() => setDeleteId(list.id)}
                                        className='text-destructive hover:text-destructive/90'
                                    >
                                        <Trash2 className='h-4 w-4'/>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className='text-sm text-muted-foreground'>
                                    {list.deskripsi || 'Tidak ada deskripsi'}
                                </p>
                                {list.tasks_count !== undefined && (
                                    <p className='text-sm text-muted-foreground mt-2'>
                                        {list.tasks_count} tasks
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Hapus List?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus list ini? Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => deleteId && handleDelete(deleteId)}
                                className='bg-destructive  hover:bg-destructive/90'
                            >
                                Hapus
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
