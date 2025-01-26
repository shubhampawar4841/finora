import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { 
  Card, CardContent, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DynamicForm = ({
  fields = [], // Add default empty array
  onSubmit = () => {}, // Add default noop function
  initialData = {},
  isLoading = false,
  onCancel = () => {}, // Add default noop function
  mode = 'create',
  title = '',
  validation = {},
  layout = 'vertical',
}) => {
  // Initialize form data with all field names set to empty string
  const [formData, setFormData] = useState(() => {
    const defaultData = fields.reduce((acc, field) => {
      acc[field.name] = '';
      return acc;
    }, {});
    return { ...defaultData, ...initialData };
  });

  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  const validateField = (field, value) => {
    if (!validation[field]?.rules) return ''; // Add null check for rules
    
    return validation[field].rules.reduce((error, rule) => {
      if (error) return error;
      return rule.validate(value) ? '' : rule.message;
    }, '');
  };

  const validateForm = () => {
    const newErrors = {};
    fields.forEach(field => {
      const error = validateField(field.name, formData[field.name]);
      if (error) newErrors[field.name] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const renderField = (field) => {
    if (!field?.type) return null; // Add null check for field type

    switch (field.type) {
      case 'select':
        return (
          <Select
            value={formData[field.name] || ''}
            onValueChange={(value) => handleChange(field.name, value)}
            disabled={field.disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {(field.options || []).map(option => ( // Add default empty array
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    {option.icon}
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'date':
        return (
          <Input
            type="date"
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            disabled={field.disabled}
          />
        );
      
      default:
        return (
          <Input
            type={field.type || 'text'}
            placeholder={field.placeholder || ''}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={errors[field.name] ? 'border-red-500' : ''}
            disabled={field.disabled}
          />
        );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(formData);
    }
  };

  const getFieldClassName = () => {
    return layout === 'horizontal' ? 'grid grid-cols-2 gap-4' : 'space-y-4';
  };

  // Add check for empty fields array
  if (!Array.isArray(fields) || fields.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>No fields configured</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Please provide field configuration to render the form.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{title || (mode === 'create' ? 'New Entry' : 'Edit Entry')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className={getFieldClassName()}>
          {fields.map((field) => (
            <div key={field.name || Math.random()} className="space-y-2">
              {field.label && (
                <label className="text-sm font-medium">{field.label}</label>
              )}
              {renderField(field)}
              {errors[field.name] && (
                <span className="text-sm text-red-500">{errors[field.name]}</span>
              )}
            </div>
          ))}
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-4">
        {isDirty && (
          <Alert className="absolute bottom-20 left-4">
            <AlertDescription>Unsaved changes</AlertDescription>
          </Alert>
        )}
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          {mode === 'create' ? 'Create' : 'Update'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DynamicForm;