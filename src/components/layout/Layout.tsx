
import { ReactNode } from 'react';
import Navbar from './Navbar';
import { Toaster } from '@/components/ui/sonner';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="py-6 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} BlogIverse. All rights reserved.
        </div>
      </footer>
      <Toaster position="top-right" />
    </div>
  );
};

export default Layout;
