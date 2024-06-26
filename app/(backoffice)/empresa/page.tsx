'use client'

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import DeleteIcon from '../components/svg/DeleteIcon'
import ViewIcon from '../components/svg/ViewIcon'
import EditIcon from '../components/svg/EditIcon'
import PlusIcon from '../components/svg/PlusIcon'
import Link from 'next/link'
import useSWR, { mutate } from 'swr'
import type { Empresa } from '@/types/MyTypes'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { fetcher } from '@/utils/fetcher'
import CheckIcon from '../components/svg/CheckIcon'
import { toast } from '@/components/ui/use-toast'
import { deleteEmpresa } from '@/lib/actions'
import { useRol } from '@/app/context/AppContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function Empresa() {
    const { data: empresas, error } = useSWR<Empresa[]>(`${process.env.NEXT_PUBLIC_NESTJS_API_URL}/empresa`, fetcher)
    const { rolId, adminId, instructorId, empresaId, personaId } = useRol()

    if (error) return <div>Error al cargar los datos</div>
    if (!empresas) return <div>Cargando...</div>

    return (
        <div>
            <header className="bg-sena-600 p-2 rounded-sm">
                <h1 className="text-center text-4xl text-white">Empresas</h1>
            </header>

            {rolId == adminId && (
                <div className="my-6">
                    <Link href="/empresa/crear" className="rounded-full pl-4 pr-6 py-2 text-white bg-sena-800">
                        <PlusIcon className="mr-2 inline-block" />
                        Registrar
                    </Link>
                </div>
            )}

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">#</TableHead>
                        <TableHead>Razón social</TableHead>
                        <TableHead>Número de celular</TableHead>
                        <TableHead>Correo electrónico</TableHead>
                        <TableHead>Acción</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {empresas.map((empresa, index) => (
                        <TableRow key={empresa.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>
                                <div className="flex items-center">
                                    <Avatar className="size-10 mr-2">
                                        <AvatarImage src={`${process.env.NEXT_PUBLIC_NESTJS_API_URL}/uploads/${empresa?.foto}`} className="object-contain" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    {empresa.razonSocial}
                                </div>
                            </TableCell>
                            <TableCell>{empresa.celular}</TableCell>
                            <TableCell>{empresa.correoElectronico}</TableCell>
                            {rolId == adminId && (
                                <TableCell>
                                    <div className="flex gap-2">
                                        {/* <ViewIcon /> */}
                                        <Link href={`/empresa/${empresa.id}/editar`}>
                                            <EditIcon />
                                        </Link>
                                        <DeleteButton empresa={empresa} />
                                    </div>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

function DeleteButton({ empresa }: { empresa: Empresa }) {
    const handleClick = async () => {
        const res = await deleteEmpresa(empresa.id)

        if (res[1]) {
            toast({ title: '✔️', description: 'Empresa eliminada satisfactoriamente' })
        }

        mutate(`${process.env.NEXT_PUBLIC_NESTJS_API_URL}/empresa`)
    }

    return (
        <Dialog>
            <DialogTrigger>
                <DeleteIcon />
            </DialogTrigger>
            <DialogContent>
                <div className="flex flex-col text-center justify-center pt-10">
                    <div>
                        ¿Desea eliminar la empresa <span className="uppercase font-bold">&nbsp;{empresa.razonSocial}</span>?
                    </div>
                </div>
                <DialogFooter className="flex items-center justify-center gap-4 mb-10">
                    <DialogClose asChild>
                        <Button className="rounded-full text-center bg-gray-200 text-black border-">Cancelar</Button>
                    </DialogClose>
                    <Button className="rounded-full items-center text-center bg-red-500" onClick={handleClick}>
                        Confirmar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
