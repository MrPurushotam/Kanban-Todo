'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EyeIcon, EyeOffIcon, ListIcon, Kanban , LoaderCircle } from 'lucide-react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false); 
  const router = useRouter();
  const { toast }= useToast();
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSignup = async (e: any) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.username || !formData.name) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "All fields are required for signup.",
      });
      return;
    }
    setLoading(true);
    try {
      const object = {
        email: formData.email,
        password: formData.password,
        username: formData.username,
        name: formData.name
      }
      const resp = await api.post("/user/signup", object);
      if (resp.data.success) {
        console.log("Signup successful");
        window.localStorage.setItem("token",resp.data.token);
        window.localStorage.setItem("authenticate","true");
        toast({
          variant: "default",
          title: "Success",
          description: "User Created.Redirecting..."
        });
        router.push("/dashboard/")
      } else {
        console.log("Error ", resp.data.error)
        toast({
          variant: "default",
          description: "Could not signup some error occured" + resp.data.error
        });
      }
    } catch (error: any) {
      console.log("Error occured while input ", error.message)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Network Error try again."
      });
    }finally {
      setLoading(false);
    }
  }

  const handleSignin = async (e: any) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Email and Password are required for login.",
      });
      return;
    }
    setLoading(true);
    try {
      const object = {
        email: formData.email,
        password: formData.password,
      }
      const resp = await api.post("/user/login", object);
      if (resp.data.success) {
        console.log("Signup successful");
        window.localStorage.setItem("token",resp.data.token);
        window.localStorage.setItem("authenticate","true");
        toast({
          variant: "default",
          title: "Success",
          description: "Loggedin,Redirecting..."
        });
        router.push("/dashboard/")
      } else {
        console.log("Error ", resp.data.error)
        toast({
          variant: "default",
          description: "Could not login some error occured" + resp.data.error
        });
      }
    } catch (error: any) {
      console.log("Error occured while input ", error.message)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Network Error try again."
      });
    }finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-100 to-teal-100">
      {/* Left side with app preview */}
      <div className="relative w-1/2 hidden lg:flex flex-col justify-center items-center p-12">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 text-blue-700">TaskMaster</h1>
          <p className="text-xl text-gray-600">
            Organize your tasks, boost your productivity
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Your Tasks</h2>
            <div className="flex space-x-2">
              <ListIcon className="text-blue-600" />
              <Kanban className="text-teal-600" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center bg-blue-50 p-2 rounded">
              <div className="w-4 h-4 rounded-full bg-blue-400 mr-2"></div>
              <span className="text-gray-700">Plan project roadmap</span>
            </div>
            <div className="flex items-center bg-teal-50 p-2 rounded">
              <div className="w-4 h-4 rounded-full bg-teal-400 mr-2"></div>
              <span className="text-gray-700">Design user interface</span>
            </div>
            <div className="flex items-center bg-purple-50 p-2 rounded">
              <div className="w-4 h-4 rounded-full bg-purple-400 mr-2"></div>
              <span className="text-gray-700">Implement backend API</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side with sign-in form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center mb-2">Welcome to TaskMaster</CardTitle>
            <CardDescription className="text-center">
              Sign in to organize your tasks in list or kanban view
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <form className="space-y-4 mt-4" onSubmit={handleSignin} method={"POST"}>
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        onChange={handleInputChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button className="w-full" disabled={loading}>
                    {loading ? <LoaderCircle className="animate-spin mx-auto" /> : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form className="space-y-4 mt-4" onSubmit={handleSignup} method={"POST"}>
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Name</Label>
                    <Input
                      id="signup-name"
                      name="name"
                      type="text"
                      placeholder="Enter your name"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-username">Username</Label>
                    <Input
                      id="signup-username"
                      name="username"
                      type="text"
                      placeholder="Choose a username"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        onChange={handleInputChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button className="w-full" disabled={loading}>
                    {loading ? <LoaderCircle className="animate-spin mx-auto" /> : "Sign Up"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
