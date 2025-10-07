'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Type,
  AlignLeft,
  CheckSquare,
  Circle,
  List,
  Calendar,
  Star,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  Save,
} from 'lucide-react';
import axios from 'axios';
import { IFormField } from '@/models/Form';

const fieldTypes = [
  { type: 'text', label: 'Text Input', icon: Type },
  { type: 'textarea', label: 'Textarea', icon: AlignLeft },
  { type: 'radio', label: 'Radio Button', icon: Circle },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquare },
  { type: 'dropdown', label: 'Dropdown', icon: List },
  { type: 'date', label: 'Date Picker', icon: Calendar },
  { type: 'rating', label: 'Rating', icon: Star },
];

export default function NewFormPage() {
  const router = useRouter();
  const [formTitle, setFormTitle] = useState('Untitled Form');
  const [template, setTemplate] = useState<'minimal' | 'bordered' | 'modern'>('minimal');
  const [fields, setFields] = useState<IFormField[]>([]);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('build');

  const addField = (type: IFormField['type']) => {
    const newField: IFormField = {
      id: `field-${Date.now()}`,
      type,
      label: `New ${type} field`,
      placeholder: '',
      required: false,
      options: type === 'radio' || type === 'checkbox' || type === 'dropdown' ? ['Option 1', 'Option 2'] : undefined,
    };
    setFields([...fields, newField]);
  };

  const updateField = (id: string, updates: Partial<IFormField>) => {
    setFields(fields.map(field => field.id === id ? { ...field, ...updates } : field));
  };

  const removeField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const newFields = [...fields];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < fields.length) {
      [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
      setFields(newFields);
    }
  };

  const addOption = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (field && field.options) {
      updateField(fieldId, {
        options: [...field.options, `Option ${field.options.length + 1}`],
      });
    }
  };

  const updateOption = (fieldId: string, optionIndex: number, value: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (field && field.options) {
      const newOptions = [...field.options];
      newOptions[optionIndex] = value;
      updateField(fieldId, { options: newOptions });
    }
  };

  const removeOption = (fieldId: string, optionIndex: number) => {
    const field = fields.find(f => f.id === fieldId);
    if (field && field.options && field.options.length > 1) {
      updateField(fieldId, {
        options: field.options.filter((_, i) => i !== optionIndex),
      });
    }
  };

  const saveForm = async () => {
    if (fields.length === 0) {
      alert('Please add at least one field to your form');
      return;
    }

    setSaving(true);
    try {
      const response = await axios.post('/api/forms', {
        title: formTitle,
        template,
        fields,
      });

      router.push('/dashboard/forms');
    } catch (error) {
      console.error('Error saving form:', error);
      alert('Failed to save form. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-background p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Input
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            className="max-w-md text-lg font-semibold"
          />
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setActiveTab('preview')}>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button onClick={saveForm} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save Form'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="hidden">
            <TabsTrigger value="build">Build</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          {/* Build Tab */}
          <TabsContent value="build" className="h-full m-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
              {/* Left Panel - Controls */}
              <div className="border-r bg-muted/40 p-6 overflow-auto">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Form Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <Label className='text-sm text-muted-foreground mb-2'>Template Style</Label>
                      <Select value={template} onValueChange={(value: any) => setTemplate(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minimal">Minimal</SelectItem>
                          <SelectItem value="bordered">Bordered</SelectItem>
                          <SelectItem value="modern">Modern</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Add Fields</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {fieldTypes.map((fieldType) => (
                      <Button
                        key={fieldType.type}
                        variant="outline"
                        className="h-auto flex-col gap-2 py-4"
                        onClick={() => addField(fieldType.type as IFormField['type'])}
                      >
                        <fieldType.icon className="h-5 w-5" />
                        <span className="text-xs">{fieldType.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Center Panel - Form Builder */}
              <div className="lg:col-span-2 p-6 overflow-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>{formTitle}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {fields.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <p>No fields added yet.</p>
                        <p className="text-sm">Click on a field type to add it to your form.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {fields.map((field, index) => (
                          <motion.div
                            key={field.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex flex-col gap-1 mt-2">
                                <button
                                  onClick={() => moveField(index, 'up')}
                                  disabled={index === 0}
                                  className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                                >
                                  <GripVertical className="h-4 w-4" />
                                </button>
                              </div>

                              <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-2">
                                  <Input
                                    value={field.label}
                                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                                    placeholder="Field label"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeField(field.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>

                                {(field.type === 'text' || field.type === 'textarea') && (
                                  <Input
                                    value={field.placeholder || ''}
                                    onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                                    placeholder="Placeholder text"
                                  />
                                )}

                                {(field.type === 'radio' || field.type === 'checkbox' || field.type === 'dropdown') && field.options && (
                                  <div className="space-y-2">
                                    <Label className="text-sm text-muted-foreground">Options:</Label>
                                    {field.options.map((option, optionIndex) => (
                                      <div key={optionIndex} className="flex gap-2">
                                        <Input
                                          value={option}
                                          onChange={(e) => updateOption(field.id, optionIndex, e.target.value)}
                                          placeholder={`Option ${optionIndex + 1}`}
                                        />
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => removeOption(field.id, optionIndex)}
                                          disabled={field.options!.length <= 1}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => addOption(field.id)}
                                    >
                                      <Plus className="h-3 w-3 mr-1" />
                                      Add Option
                                    </Button>
                                  </div>
                                )}

                                <div className="flex items-center space-x-2">
                                  <Switch
                                    checked={field.required || false}
                                    onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                                  />
                                  <Label>Required field</Label>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="h-full m-0">
            <div className="container mx-auto max-w-3xl p-6">
              <Button
                variant="outline"
                onClick={() => setActiveTab('build')}
                className="mb-4"
              >
                ← Back to Editor
              </Button>

              <div className={getTemplateStyles(template)}>
                <h2 className="text-2xl font-bold mb-6">{formTitle}</h2>
                <div className="space-y-6">
                  {fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label>
                        {field.label}
                        {field.required && <span className="text-destructive ml-1">*</span>}
                      </Label>
                      {renderPreviewField(field)}
                    </div>
                  ))}
                  {fields.length > 0 && (
                    <Button className="w-full">Submit</Button>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function getTemplateStyles(template: string): string {
  const baseStyles = 'bg-card p-8 rounded-lg';
  
  switch (template) {
    case 'bordered':
      return `${baseStyles} border-2 border-primary shadow-lg`;
    case 'modern':
      return `${baseStyles} bg-gradient-to-br from-card to-muted shadow-2xl`;
    default:
      return `${baseStyles} border shadow`;
  }
}

function renderPreviewField(field: IFormField) {
  switch (field.type) {
    case 'text':
      return <Input placeholder={field.placeholder} />;
    case 'textarea':
      return <Textarea placeholder={field.placeholder} />;
    case 'radio':
      return (
        <div className="space-y-2">
          {field.options?.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input type="radio" name={field.id} id={`${field.id}-${index}`} />
              <label htmlFor={`${field.id}-${index}`}>{option}</label>
            </div>
          ))}
        </div>
      );
    case 'checkbox':
      return (
        <div className="space-y-2">
          {field.options?.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input type="checkbox" id={`${field.id}-${index}`} />
              <label htmlFor={`${field.id}-${index}`}>{option}</label>
            </div>
          ))}
        </div>
      );
    case 'dropdown':
      return (
        <Select>
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
      return <Input type="date" />;
    case 'rating':
      return (
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="h-6 w-6 text-muted-foreground hover:text-yellow-500 cursor-pointer" />
          ))}
        </div>
      );
    default:
      return null;
  }
}

