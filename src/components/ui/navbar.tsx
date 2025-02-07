'use client';
import { useToast } from '@/hooks/use-toast';
import { openLinkInNewTab } from '@/lib/utils';
import { Github, Linkedin, Mail, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from './button';

export const Navbar = () => {
  const { setTheme, theme } = useTheme();
  const { toast } = useToast();

  const BUTTONS = [
    {
      name: 'theme-toggle',
      icon: (
        <>
          {/* Copied from docs */}
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </>
      ),
      onClick: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    },
    {
      name: 'email',
      icon: <Mail className="h-5 w-5" />,
      onClick: () => {
        try {
          navigator.clipboard.writeText('dbjowett@gmail.com');
          toast({
            description: 'Email was copied to clipboard 🎉',
          });
        } catch {
          toast({
            variant: 'destructive',
            description: 'Sorry, something went wrong!',
          });
        }
      },
    },
    {
      name: 'github',
      icon: <Github className="h-5 w-5" />,
      onClick: () => openLinkInNewTab('https://github.com/dbjowett'),
    },
    {
      name: 'linkedin',
      icon: <Linkedin className="h-5 w-5" />,
      onClick: () => openLinkInNewTab('https://www.linkedin.com/in/danieljowett/'),
    },
  ];

  return (
    <nav className="w-full border-b">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-xl font-semibold">Upload Files</h1>

          <div className="flex items-center space-x-4">
            {BUTTONS.map((btn) => (
              <Button variant="ghost" size="icon" key={btn.name} onClick={btn.onClick}>
                {btn.icon}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
