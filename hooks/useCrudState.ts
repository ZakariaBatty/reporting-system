'use client';

import { useState, useCallback } from 'react';

export interface CrudState<T> {
  items: T[];
  selectedItem: T | null;
  isDrawerOpen: boolean;
  isDeleteDialogOpen: boolean;
  deleteTarget: T | null;
  mode: 'view' | 'create' | 'edit';
}

export interface CrudActions<T> {
  openCreateDrawer: () => void;
  openEditDrawer: (item: T) => void;
  openViewDrawer: (item: T) => void;
  closeDrawer: () => void;
  openDeleteDialog: (item: T) => void;
  closeDeleteDialog: () => void;
  createItem: (item: T, onCreated?: (item: T) => void) => void;
  updateItem: (item: T, onUpdated?: (item: T) => void) => void;
  deleteItem: (item: T, onDeleted?: (item: T) => void) => void;
  assignItem: (item: T, assignment: any, onAssigned?: (item: T) => void) => void;
}

export function useCrudState<T extends { id: string | number }>(
  initialItems: T[]
): [CrudState<T>, CrudActions<T>] {
  const [items, setItems] = useState<T[]>(initialItems);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);
  const [mode, setMode] = useState<'view' | 'create' | 'edit'>('view');

  const openCreateDrawer = useCallback(() => {
    setSelectedItem(null);
    setMode('create');
    setIsDrawerOpen(true);
  }, []);

  const openEditDrawer = useCallback((item: T) => {
    setSelectedItem(item);
    setMode('edit');
    setIsDrawerOpen(true);
  }, []);

  const openViewDrawer = useCallback((item: T) => {
    setSelectedItem(item);
    setMode('view');
    setIsDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setSelectedItem(null);
    setMode('view');
  }, []);

  const openDeleteDialog = useCallback((item: T) => {
    setDeleteTarget(item);
    setIsDeleteDialogOpen(true);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setDeleteTarget(null);
  }, []);

  const createItem = useCallback((item: T, onCreated?: (item: T) => void) => {
    setItems((prev) => [{ ...item, id: Date.now() } as T, ...prev]);
    closeDrawer();
    onCreated?.(item);
  }, [closeDrawer]);

  const updateItem = useCallback((item: T, onUpdated?: (item: T) => void) => {
    setItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
    closeDrawer();
    onUpdated?.(item);
  }, [closeDrawer]);

  const deleteItem = useCallback((item: T, onDeleted?: (item: T) => void) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    closeDeleteDialog();
    onDeleted?.(item);
  }, [closeDeleteDialog]);

  const assignItem = useCallback((item: T, assignment: any, onAssigned?: (item: T) => void) => {
    const updated = { ...item, ...assignment } as T;
    updateItem(updated, onAssigned);
  }, [updateItem]);

  const state: CrudState<T> = {
    items,
    selectedItem,
    isDrawerOpen,
    isDeleteDialogOpen,
    deleteTarget,
    mode,
  };

  const actions: CrudActions<T> = {
    openCreateDrawer,
    openEditDrawer,
    openViewDrawer,
    closeDrawer,
    openDeleteDialog,
    closeDeleteDialog,
    createItem,
    updateItem,
    deleteItem,
    assignItem,
  };

  return [state, actions];
}
