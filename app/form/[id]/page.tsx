'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Star, Loader2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { IFormField } from '@/models/Form';

interface Form {
  _id: string;
  title: string;
  template: string;
  fields: IFormField[];
}

export default function PublicFormPage() {
  const params = useParams();
  const formId = params.id as string;

  const [form, setForm] = useState<Form | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(`/api/forms/${formId}`);
        setForm(response.data.form);
      } catch (error) {
        setError('Form not found');
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    const missingFields = form?.fields.filter(
      field => field.required && !answers[field.id]
    );

    if (missingFields && missingFields.length > 0) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      await axios.post(`/api/forms/${formId}/responses`, { answers });
      setSubmitted(true);
    } catch (error) {
      setError('Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const updateAnswer = (fieldId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !form) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Form Not Found</h2>
          <p className="text-muted-foreground">{error}</p>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Card className="p-12">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Thank You!</h2>
            <p className="text-muted-foreground text-lg">
              Your response has been submitted successfully.
            </p>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-background to-muted/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-3xl"
      >
        <div className={getTemplateStyles(form.template)}>
          <h1 className="text-3xl font-bold mb-2">{form.title}</h1>
          <p className="text-muted-foreground mb-8">
            Please fill out all required fields marked with *
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {form.fields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Label className="text-base">
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </Label>
                <div className="mt-2">
                  {renderFormField(field, answers[field.id], (value) => updateAnswer(field.id, value))}
                </div>
              </motion.div>
            ))}

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

function getTemplateStyles(template: string): string {
  const baseStyles = 'bg-card p-8 md:p-12 rounded-lg';
  
  switch (template) {
    case 'bordered':
      return `${baseStyles} border-2 border-primary shadow-lg`;
    case 'modern':
      return `${baseStyles} bg-gradient-to-br from-card to-muted shadow-2xl`;
    default:
      return `${baseStyles} border shadow`;
  }
}

function renderFormField(
  field: IFormField,
  value: any,
  onChange: (value: any) => void
) {
  switch (field.type) {
    case 'text':
      return (
        <Input
          placeholder={field.placeholder}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
        />
      );

    case 'textarea':
      return (
        <Textarea
          placeholder={field.placeholder}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          rows={4}
        />
      );

    case 'radio':
      return (
        <RadioGroup value={value} onValueChange={onChange} required={field.required}>
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                <Label htmlFor={`${field.id}-${index}`} className="font-normal cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      );

    case 'checkbox':
      return (
        <div className="space-y-2">
          {field.options?.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Checkbox
                id={`${field.id}-${index}`}
                checked={value?.[option] || false}
                onCheckedChange={(checked) => {
                  const newValue = { ...value, [option]: checked };
                  onChange(newValue);
                }}
              />
              <Label htmlFor={`${field.id}-${index}`} className="font-normal cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </div>
      );

    case 'dropdown':
      return (
        <Select value={value} onValueChange={onChange} required={field.required}>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option, index) => (
              <SelectItem key={index} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case 'date':
      return (
        <Input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
        />
      );

    case 'rating':
      return (
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-8 w-8 cursor-pointer transition-colors ${
                value >= star ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'
              }`}
              onClick={() => onChange(star)}
            />
          ))}
        </div>
      );

    default:
      return null;
  }
}

