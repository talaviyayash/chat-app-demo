import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
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

interface CreateGroupFormValues {
    groupName: string
    emails: string[]
    emailInput: string // Added to form state
}

interface CreateGroupModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onCreateGroup: (groupName: string, emails: string[]) => void
}

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

export function CreateGroupModal({ open, onOpenChange, onCreateGroup }: CreateGroupModalProps) {
    const { api } = useApi();

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        watch,
        reset,
        setError,
        clearErrors,
        trigger,
        formState: { errors },
    } = useForm<CreateGroupFormValues>({
        defaultValues: {
            groupName: '',
            emails: [],
            emailInput: '',
        },
    })

    const emails = watch('emails')

    // Register emails field to allow validation
    register('emails', {
        validate: (value) => value.length > 0 || "At least one member is required"
    })

    const addEmail = async () => {
        const currentInput = getValues('emailInput')
        const trimmedEmail = currentInput?.trim()

        if (!trimmedEmail) {
            setError('emailInput', { type: 'manual', message: 'Email cannot be empty' })
            return
        }

        // Validate email format
        if (!EMAIL_REGEX.test(trimmedEmail)) {
            setError('emailInput', { type: 'manual', message: 'Please enter a valid email address' })
            return
        }

        // Check for duplicates
        if (emails.includes(trimmedEmail)) {
            setError('emailInput', { type: 'manual', message: 'This email has already been added' })
            return
        }

        // Add email to form
        const currentEmails = getValues('emails')
        setValue('emails', [...currentEmails, trimmedEmail])
        setValue('emailInput', '') // Clear input
        clearErrors('emailInput')
        await trigger('emails') // Re-validate emails field
    }

    const removeEmail = async (emailToRemove: string) => {
        const currentEmails = getValues('emails')
        const newEmails = currentEmails.filter(e => e !== emailToRemove)
        setValue('emails', newEmails)
        await trigger('emails')
    }

    const onSubmit = async (data: CreateGroupFormValues) => {
        const response = await api({
            method: "POST",
            endPoint: "/chat/group",
            showToastMessage: true,
            data: {
                name: data.groupName,
                users: data.emails
            },
        })
        if (response.success && response.data) {
            onCreateGroup(data.groupName, data.emails)
            handleClose()
        }
    }

    const handleClose = () => {
        reset()
        onOpenChange(false)
    }

    const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addEmail()
        }
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            if (!val) handleClose()
            onOpenChange(val)
        }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Group</DialogTitle>
                    <DialogDescription>
                        Enter a group name and add members by their email addresses.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="groupName">Group Name</Label>
                            <Input
                                id="groupName"
                                placeholder="Enter group name"
                                {...register('groupName', {
                                    required: 'Group name is required',
                                    maxLength: {
                                        value: 50,
                                        message: 'Group name is too long'
                                    }
                                })}
                            />
                            {errors.groupName && (
                                <p className="text-sm text-destructive">{errors.groupName.message}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="groupEmails">Member Emails</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="groupEmails"
                                    type="email"
                                    placeholder="Add email and press Enter"
                                    {...register('emailInput')}
                                    onKeyDown={handleEmailKeyDown}
                                />
                                <Button type="button" onClick={addEmail}>Add</Button>
                            </div>
                            {errors.emailInput && (
                                <p className="text-sm text-destructive">{errors.emailInput.message}</p>
                            )}
                            {errors.emails && (
                                <p className="text-sm text-destructive">{errors.emails.message}</p>
                            )}
                            {emails.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {emails.map((email) => (
                                        <div
                                            key={email}
                                            className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                                        >
                                            <span>{email}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeEmail(email)}
                                                className="hover:bg-secondary-foreground/20 rounded-full p-0.5"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit">Create Group</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
