'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FileText, MoreVertical, Copy, BarChart, Trash2, Plus } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Form {
  _id: string;
  title: string;
  template: string;
  createdAt: string;
  responseCount: number;
}

export default function FormsPage() {
  const router = useRouter();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await axios.get('/api/forms');
      const formData = response.data.forms;

      // Get response counts for each form
      const formsWithCounts = await Promise.all(
        formData.map(async (form: any) => {
          try {
            const responsesRes = await axios.get(`/api/forms/${form._id}/responses`);
            return {
              ...form,
              responseCount: responsesRes.data.responses.length,
            };
          } catch (error) {
            return {
              ...form,
              responseCount: 0,
            };
          }
        })
      );

      setForms(formsWithCounts);
    } catch (error) {
      console.error('Error fetching forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyFormLink = (formId: string) => {
    const link = `${window.location.origin}/form/${formId}`;
    navigator.clipboard.writeText(link);
    alert('Form link copied to clipboard!');
  };

  const deleteForm = async (formId: string) => {
    if (!confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`/api/forms/${formId}`);
      setForms(forms.filter(form => form._id !== formId));
    } catch (error) {
      console.error('Error deleting form:', error);
      alert('Failed to delete form. Please try again.');
    }
  };

  const duplicateForm = async (formId: string) => {
    try {
      const response = await axios.get(`/api/forms/${formId}`);
      const originalForm = response.data.form;

      const newForm = await axios.post('/api/forms', {
        title: `${originalForm.title} (Copy)`,
        template: originalForm.template,
        fields: originalForm.fields,
      });

      fetchForms();
    } catch (error) {
      console.error('Error duplicating form:', error);
      alert('Failed to duplicate form. Please try again.');
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Forms</h1>
          <p className="text-muted-foreground">
            Manage all your forms in one place
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/new-form">
            <Plus className="mr-2 h-4 w-4" />
            Create New Form
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : forms.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No forms yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first form to get started
            </p>
            <Button asChild>
              <Link href="/dashboard/new-form">
                <Plus className="mr-2 h-4 w-4" />
                Create Form
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form, index) => (
            <motion.div
              key={form._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-1">{form.title}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {form.template}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {form.responseCount} responses
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => copyFormLink(form._id)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Link
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/forms/${form._id}/analytics`)}
                        >
                          <BarChart className="mr-2 h-4 w-4" />
                          View Analytics
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => duplicateForm(form._id)}>
                          <FileText className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteForm(form._id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Created {new Date(form.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyFormLink(form._id)}
                      className="flex-1"
                    >
                      <Copy className="mr-2 h-3 w-3" />
                      Share
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => router.push(`/dashboard/forms/${form._id}/analytics`)}
                      className="flex-1"
                    >
                      <BarChart className="mr-2 h-3 w-3" />
                      Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

