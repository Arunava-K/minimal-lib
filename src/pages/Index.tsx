
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ExternalLink, Github } from "lucide-react";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <header className="container max-w-6xl mx-auto py-6 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-bento-purple flex items-center justify-center text-white font-bold">B</div>
          <span className="font-bold text-xl">Bento Clone</span>
        </div>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <Button onClick={() => navigate("/dashboard")}>
              Dashboard
            </Button>
          ) : (
            <>
              <Link to="/auth" className="text-gray-600 hover:text-gray-900">Log in</Link>
              <Button onClick={() => navigate("/auth")}>
                Sign up free
              </Button>
            </>
          )}
        </div>
      </header>
      
      <main className="container max-w-6xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight">Your links and content, all in one beautiful profile</h1>
            <p className="text-xl text-gray-600">Create your own customizable link in bio page with our Bento clone. Add links, social profiles, and more to share with your audience.</p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={() => navigate("/auth")} className="bg-bento-purple hover:bg-bento-purple/90">
                Create your page <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => window.open("https://github.com", "_blank")}>
                <Github className="mr-2 h-5 w-5" /> Star on GitHub
              </Button>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl bg-white p-6">
            <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
              <div className="text-center p-6">
                <div className="mx-auto w-24 h-24 rounded-full bg-bento-gray flex items-center justify-center mb-4">
                  <span className="text-4xl">👋</span>
                </div>
                <h2 className="text-2xl font-bold">@username</h2>
                <p className="text-gray-500 mt-2">Your personal link in bio page</p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bento-card flex items-center justify-center h-20">
                    <ExternalLink className="mr-2 h-5 w-5 text-bento-blue" />
                    <span>Portfolio</span>
                  </div>
                  <div className="bento-card flex items-center justify-center h-20">
                    <svg className="mr-2 h-5 w-5 text-pink-500" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" fill="currentColor" />
                    </svg>
                    <span>Instagram</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t mt-24">
        <div className="container max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500">© 2025 Bento Clone. Inspired by Bento.me</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-gray-900">Terms</a>
              <a href="#" className="text-gray-500 hover:text-gray-900">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-gray-900">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
