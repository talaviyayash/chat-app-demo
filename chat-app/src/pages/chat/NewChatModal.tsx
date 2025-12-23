import { useForm } from 'react-hook-form'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import useApi from '@/hooks/useApi'

interface NewChatFormValues {
    email: string
}

interface NewChatModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onCreateChat: (email: string) => void
}

export function NewChatModal({ open, onOpenChange, onCreateChat }: NewChatModalProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<NewChatFormValues>({
        defaultValues: {
            email: '',
        },
    })
    const { api } = useApi();

    const onSubmit = async (data: NewChatFormValues) => {
        const response = await api({
            method: "POST",
            endPoint: "/chat",
            showToastMessage: true,
            data,
        });
        if (response.success && response.data) {
            onCreateChat(data.email)
            reset()
            onOpenChange(false)
        }
    }

    const handleClose = () => {
        reset()
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            if (!val) handleClose()
            onOpenChange(val)
        }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Chat</DialogTitle>
                    <DialogDescription>
                        Enter the email address of the person you want to chat with.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                placeholder="example@email.com"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Please enter a valid email address',
                                    },
                                })}
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email.message}</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit">Create Chat</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
