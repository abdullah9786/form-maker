'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Download,
  Calendar,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';
import axios from 'axios';
import { IFormField } from '@/models/Form';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Form {
  _id: string;
  title: string;
  template: string;
  fields: IFormField[];
  createdAt: string;
}

interface Response {
  _id: string;
  answers: Record<string, any>;
  createdAt: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function AnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.id as string;

  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [formRes, responsesRes] = await Promise.all([
          axios.get(`/api/forms/${formId}`),
          axios.get(`/api/forms/${formId}/responses`),
        ]);

        setForm(formRes.data.form);
        setResponses(responsesRes.data.responses);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [formId]);

  const exportToCSV = () => {
    if (!form || responses.length === 0) return;

    const headers = form.fields.map(field => field.label);
    const rows = responses.map(response => 
      form.fields.map(field => {
        const answer = response.answers[field.id];
        if (typeof answer === 'object') {
          return Object.entries(answer)
            .filter(([_, value]) => value)
            .map(([key]) => key)
            .join(', ');
        }
        return answer || '';
      })
    );

    const csv = [
      ['Submission Date', ...headers].join(','),
      ...rows.map((row, index) => [
        new Date(responses[index].createdAt).toLocaleString(),
        ...row.map(cell => `"${cell}"`),
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.title}-responses.csv`;
    a.click();
  };

  const getFieldAnalytics = (field: IFormField) => {
    if (field.type === 'radio' || field.type === 'dropdown') {
      const counts: Record<string, number> = {};
      field.options?.forEach(option => {
        counts[option] = 0;
      });

      responses.forEach(response => {
        const answer = response.answers[field.id];
        if (answer && counts[answer] !== undefined) {
          counts[answer]++;
        }
      });

      return Object.entries(counts).map(([name, value]) => ({
        name,
        value,
      }));
    }

    if (field.type === 'checkbox') {
      const counts: Record<string, number> = {};
      field.options?.forEach(option => {
        counts[option] = 0;
      });

      responses.forEach(response => {
        const answer = response.answers[field.id];
        if (answer && typeof answer === 'object') {
          Object.entries(answer).forEach(([option, checked]) => {
            if (checked && counts[option] !== undefined) {
              counts[option]++;
            }
          });
        }
      });

      return Object.entries(counts).map(([name, value]) => ({
        name,
        value,
      }));
    }

    if (field.type === 'rating') {
      const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      
      responses.forEach(response => {
        const rating = response.answers[field.id];
        if (rating && counts[rating] !== undefined) {
          counts[rating]++;
        }
      });

      return Object.entries(counts).map(([name, value]) => ({
        name: `${name} ⭐`,
        value,
      }));
    }

    return null;
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="p-8">
        <p>Form not found</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard/forms')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Forms
        </Button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{form.title}</h1>
            <div className="flex gap-2">
              <Badge variant="secondary">{form.template}</Badge>
              <Badge variant="outline">
                Created {new Date(form.createdAt).toLocaleDateString()}
              </Badge>
            </div>
          </div>
          <Button onClick={exportToCSV} disabled={responses.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Responses
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{responses.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Form Fields
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{form.fields.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Latest Response
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {responses.length > 0
                ? new Date(responses[0].createdAt).toLocaleDateString()
                : 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      {responses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No responses yet</h3>
            <p className="text-muted-foreground mb-6">
              Share your form to start collecting responses
            </p>
            <Button
              onClick={() => {
                const link = `${window.location.origin}/form/${formId}`;
                navigator.clipboard.writeText(link);
                alert('Form link copied to clipboard!');
              }}
            >
              Copy Form Link
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="responses">All Responses</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            {form.fields.map((field) => {
              const data = getFieldAnalytics(field);
              
              if (!data) {
                return null;
              }

              return (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>{field.label}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>

                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={data}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(0)}%`
                              }
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {data.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </TabsContent>

          <TabsContent value="responses">
            <Card>
              <CardHeader>
                <CardTitle>All Responses ({responses.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium">Date</th>
                        {form.fields.map(field => (
                          <th key={field.id} className="text-left p-4 font-medium">
                            {field.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {responses.map((response) => (
                        <motion.tr
                          key={response._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="p-4 text-sm text-muted-foreground">
                            {new Date(response.createdAt).toLocaleString()}
                          </td>
                          {form.fields.map(field => {
                            const answer = response.answers[field.id];
                            let displayValue = answer;

                            if (typeof answer === 'object' && answer !== null) {
                              displayValue = Object.entries(answer)
                                .filter(([_, value]) => value)
                                .map(([key]) => key)
                                .join(', ');
                            }

                            return (
                              <td key={field.id} className="p-4 text-sm">
                                {displayValue || '-'}
                              </td>
                            );
                          })}
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

