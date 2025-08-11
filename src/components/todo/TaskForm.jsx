"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TEXTS } from "@/lib/texts";

const API_ENDPOINTS = {
  CATEGORIES: "/api/categories",
  TASKS: "/api/tasks",
};

const INITIAL_STATE = {
  title: "",
  categoryId: "",
  categories: [],
  loading: false,
  error: "",
};

export default function TaskForm({ onCreated }) {
  const [state, setState] = useState(INITIAL_STATE);
  const { title, categoryId, categories, loading, error } = state;

  const canSubmit = useMemo(() => title.trim().length > 0, [title]);

  const setStateField = (field, value) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const loadCategories = async () => {
    try {
      setStateField("error", "");
      const response = await fetch(API_ENDPOINTS.CATEGORIES, { cache: TEXTS.CACHE.NO_STORE });
      
      if (!response.ok) {
        throw new Error(TEXTS.ERRORS.LOAD_CATEGORIES_FAILED);
      }
      
      const data = await response.json();
      setStateField("categories", data);
      
      // Set default category if available
      if (data.length > 0) {
        setStateField("categoryId", String(data[0].id));
      } else {
        setStateField("categoryId", "");
      }
    } catch (error) {
      setStateField("error", TEXTS.ERRORS.CATEGORIES_UNAVAILABLE);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!canSubmit) return;
    
    try {
      setStateField("loading", true);
      setStateField("error", "");
      
      const taskData = {
        title: title.trim(),
        categoryId: categoryId && categoryId !== TEXTS.FILTERS.NO_CATEGORIES ? Number(categoryId) : null,
      };
      
      const response = await fetch(API_ENDPOINTS.TASKS, {
        method: TEXTS.HTTP_METHODS.POST,
        headers: { "Content-Type": TEXTS.CONTENT_TYPES.JSON },
        body: JSON.stringify(taskData),
      });
      
      if (!response.ok) {
        throw new Error(TEXTS.ERRORS.CREATE_TASK_FAILED);
      }
      
      const createdTask = await response.json();
      setStateField("title", "");
      onCreated?.(createdTask);
    } catch (error) {
      setStateField("error", TEXTS.ERRORS.CREATE_TASK_FAILED);
    } finally {
      setStateField("loading", false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <Card className="p-4 mb-6 space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="title">{TEXTS.FORM.TITLE_LABEL}</Label>
          <Input
            id="title"
            placeholder={TEXTS.FORM.TITLE_PLACEHOLDER}
            value={title}
            onChange={(event) => setStateField("title", event.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">{TEXTS.FORM.CATEGORY_LABEL}</Label>
          <Select value={categoryId} onValueChange={(value) => setStateField("categoryId", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={TEXTS.FORM.CATEGORY_PLACEHOLDER} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
                </SelectItem>
              ))}
              {categories.length === 0 && (
                <SelectItem value={TEXTS.FILTERS.NO_CATEGORIES} disabled>
                  {TEXTS.FORM.NO_CATEGORIES_AVAILABLE}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          type="submit" 
          disabled={!canSubmit || loading} 
          className="w-full" 
          variant="outline"
        >
          {loading ? (
            TEXTS.FORM.ADDING_BUTTON
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              {TEXTS.FORM.ADD_TASK_BUTTON}
            </>
          )}
        </Button>
        
        {error && (
          <p className="text-sm destructive">{error}</p>
        )}
      </form>
    </Card>
  );
}


