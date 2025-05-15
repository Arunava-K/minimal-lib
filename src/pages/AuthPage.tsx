
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Link, useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(loginEmail, loginPassword);
      toast({
        title: "Login successful!",
        description: "Welcome back to Bento Clone.",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signup(signupEmail, signupPassword, signupUsername);
      toast({
        title: "Account created!",
        description: "Welcome to Bento Clone.",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "Please check your information and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center space-x-2 mb-6">
          <div className="h-8 w-8 rounded-lg bg-bento-purple flex items-center justify-center text-white font-bold">B</div>
          <span className="font-bold text-xl">Bento Clone</span>
        </Link>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>Enter your email and password to access your Bento page.</CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input 
                      id="login-email" 
                      type="email" 
                      placeholder="you@example.com" 
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input 
                      id="login-password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>Enter your details to create your Bento page.</CardDescription>
              </CardHeader>
              <form onSubmit={handleSignup}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder="you@example.com" 
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-username">Username</Label>
                    <Input 
                      id="signup-username" 
                      type="text" 
                      placeholder="your-username" 
                      value={signupUsername}
                      onChange={(e) => setSignupUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      required
                    />
                    <p className="text-xs text-gray-500">This will be your bento page URL: bento.clone/{signupUsername || "username"}</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input 
                      id="signup-password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create account"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPage;
