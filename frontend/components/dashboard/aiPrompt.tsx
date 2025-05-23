import React, { useState } from 'react'
import { Loader2 } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { api } from '@/lib/api'
import { useSetRecoilState } from 'recoil'
import { workspaceAtom } from '@/states/atoms'
import { useToast } from '@/hooks/use-toast'

interface AiPromptProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

const AiPrompt = ({ isOpen, setIsOpen }: AiPromptProps) => {
    const [prompt, setPrompt] = useState('')
    const [loading, setLoading] = useState(false)
    const setWorkspace = useSetRecoilState(workspaceAtom);
    const { toast } = useToast();
    
    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const resp = await api.post("/ai/generate", { prompt })
            const data = resp.data;
            if (data.success) {
                setWorkspace(prev => [...prev, data.workspace])
                toast({ variant: "default", title: "Success", description: "AI response generated successfully." })
            } else {
                toast({ variant: "destructive", title: "Error", description: data.message })
            }
        } catch (error) {
            console.error("Error generating AI response:", error)
            toast({ variant: "destructive", title: "Error", description: "An error occurred while generating the AI response." })
        }
        finally {
            setLoading(false)
            setIsOpen(false)
            setPrompt('')

        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-md w-full p-0 bg-white rounded-lg shadow-lg">
                <div className="p-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold mb-4">
                            AI Prompt
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleGenerate}>
                        <div className="mb-4">
                            <Label htmlFor="ai-prompt-input">Prompt</Label>
                            <Textarea
                                id="ai-prompt-input"
                                value={prompt}
                                onChange={e => setPrompt(e.target.value)}
                                placeholder="Enter your prompt..."
                                disabled={loading}
                                className="mt-1 min-h-[80px] resize-y"
                                required
                            />
                        </div>
                        <DialogFooter className="flex justify-end space-x-2 mt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    'Generate'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AiPrompt