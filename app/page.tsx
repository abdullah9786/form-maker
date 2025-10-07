'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Share2, BarChart3, Zap, Shield, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const features = [
    {
      icon: Zap,
      title: 'Quick & Easy',
      description: 'Build forms in minutes with our intuitive drag-and-drop interface',
    },
    {
      icon: Share2,
      title: 'Easy Sharing',
      description: 'Share your forms with a single link and collect responses instantly',
    },
    {
      icon: BarChart3,
      title: 'Powerful Analytics',
      description: 'Visualize your data with beautiful charts and export to CSV',
    },
    {
      icon: Smartphone,
      title: 'Mobile Responsive',
      description: 'Your forms look great on any device, automatically',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and securely stored',
    },
    {
      icon: FileText,
      title: 'Multiple Templates',
      description: 'Choose from beautiful templates to match your brand',
    },
  ];

  const templates = [
    {
      name: 'Contact Form',
      description: 'Perfect for customer inquiries',
      fields: ['Name', 'Email', 'Message'],
    },
    {
      name: 'Survey Form',
      description: 'Collect feedback and opinions',
      fields: ['Rating', 'Multiple Choice', 'Comments'],
    },
    {
      name: 'Registration Form',
      description: 'Event and course sign-ups',
      fields: ['Full Name', 'Email', 'Phone', 'Date'],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Form Builder</span>
          </div>
          <div className="space-x-4">
            {session ? (
              <Button onClick={() => router.push('/dashboard')}>Dashboard</Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Build Forms in Minutes
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Create beautiful, responsive forms and collect responses instantly. No coding required.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" asChild>
              <Link href={session ? '/dashboard' : '/auth/signup'}>
                Create Your First Form
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#templates">View Templates</Link>
            </Button>
          </div>
        </motion.div>

        {/* Hero Image/Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16"
        >
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-card border rounded-lg shadow-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="h-10 bg-muted rounded animate-pulse" />
                  <div className="h-32 bg-muted rounded animate-pulse" />
                  <div className="h-10 bg-muted rounded animate-pulse" />
                  <div className="h-10 bg-primary/20 rounded" />
                </div>
                <div className="space-y-4">
                  <div className="h-48 bg-muted rounded animate-pulse" />
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-24 bg-muted rounded animate-pulse" />
                    <div className="h-24 bg-muted rounded animate-pulse" />
                    <div className="h-24 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-center mb-12">
            Everything You Need
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <feature.icon className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-center mb-4">
            Start with a Template
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Choose from our pre-designed templates or create your own from scratch
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templates.map((template, index) => (
              <motion.div
                key={template.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                    <p className="text-muted-foreground mb-4">{template.description}</p>
                    <div className="space-y-2">
                      {template.fields.map((field) => (
                        <div
                          key={field}
                          className="text-sm bg-muted px-3 py-2 rounded"
                        >
                          {field}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-primary text-primary-foreground rounded-2xl p-12 text-center"
        >
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users creating amazing forms
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href={session ? '/dashboard' : '/auth/signup'}>
              Create Your Form Now
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-semibold">Form Builder</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 Form Builder. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
