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
    const [error, setError] = useState<string | null>(null)
    const setWorkspace = useSetRecoilState(workspaceAtom);
    const { toast } = useToast();

    const validatePrompt = (text: string): boolean => {
        // Trim the text to remove whitespace
        const trimmedText = text.trim();

        // Check if the prompt is empty or too short
        if (!trimmedText) {
            setError("Please enter a prompt");
            return false;
        }

        if (trimmedText.length < 3) {
            setError("Prompt is too short");
            return false;
        }

        // Clear any previous errors
        setError(null);
        return true;
    }

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate the prompt before proceeding
        if (!validatePrompt(prompt)) {
            return;
        }

        setLoading(true)
        try {
            const resp = await api.post("/ai/generate", { prompt })
            const data = resp.data;
            if (data.success) {
                // Add the new workspace to state
                setWorkspace(prev => [...prev, data.workspace])

                // Show an actionable toast with a clear CTA
                toast({
                    variant: "default",
                    title: "Workspace Created! 🎉",
                    description: "Tap here to start with your AI-generated workspace",
                    action: <Button variant="outline" size="sm">View Now</Button>,
                    duration: 5000, // Show for longer so user has time to interact
                    className: "cursor-pointer border-green-400 bg-green-50",
                    onClick: () => {
                        // This will be triggered when the user clicks the toast
                        // You can add navigation logic here if needed
                        // For example, scroll to the new workspace or highlight it
                        document.getElementById(`workspace-${data.workspace.id}`)?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }
                })
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
                            <p className="text-sm text-gray-500 mb-2">
                                Describe the tasks you need to complete or a project you're working on.
                            </p>

                            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-3 text-sm">
                                <p className="font-medium text-blue-800">Pro tip: Create smart prompts</p>
                                <p className="text-blue-700">
                                    Be specific about your project, include deadlines, priorities, and categories to get well-organized todos.
                                </p>
                            </div>

                            <Textarea
                                id="ai-prompt-input"
                                value={prompt}
                                onChange={(e) => {
                                    setPrompt(e.target.value);
                                    // Clear error when user starts typing
                                    if (error) setError(null);
                                }}
                                placeholder="Example: Create tasks for my website launch - design homepage, setup hosting, write content."
                                disabled={loading}
                                className={`mt-1 min-h-[100px] resize-y placeholder:text-gray-400 ${error ? 'border-red-500' : ''}`}
                                required
                            />
                            {error && (
                                <p className="text-sm text-red-500 mt-1">{error}</p>
                            )}
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