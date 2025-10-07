'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, MessageSquare, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface DashboardStats {
  totalForms: number;
  totalResponses: number;
  recentForms: Array<{
    _id: string;
    title: string;
    createdAt: string;
    responseCount: number;
  }>;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalForms: 0,
    totalResponses: 0,
    recentForms: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Forms',
      value: stats.totalForms,
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      title: 'Total Responses',
      value: stats.totalResponses,
      icon: MessageSquare,
      color: 'text-green-600',
    },
    {
      title: 'Active Forms',
      value: stats.totalForms,
      icon: Activity,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {session?.user?.email}!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your forms and responses
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? '...' : stat.value}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Forms</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading...
            </div>
          ) : stats.recentForms.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                You haven't created any forms yet
              </p>
              <Button asChild>
                <Link href="/dashboard/new-form">Create Your First Form</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentForms.map((form) => (
                <motion.div
                  key={form._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <Link
                      href={`/dashboard/forms/${form._id}/analytics`}
                      className="font-medium hover:text-primary"
                    >
                      {form.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      Created {new Date(form.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {form.responseCount} responses
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

