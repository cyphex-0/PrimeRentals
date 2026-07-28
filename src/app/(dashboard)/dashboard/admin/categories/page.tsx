"use client";

import { useState } from "react";
import { useCategories } from "@/hooks/api/use-categories";
import { useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/hooks/api/use-admin";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Category } from "@/lib/types";
import { DataTable } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminCategoriesPage() {
  const { data, isLoading } = useCategories();
  
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const [addDialog, setAddDialog] = useState(false);
  const [editDialog, setEditDialog] = useState<{ id: string; name: string } | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ id: string; name: string } | null>(null);
  
  const [categoryName, setCategoryName] = useState("");

  const categories = data?.data || [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    
    createCategory(
      { name: categoryName.trim() },
      {
        onSuccess: () => {
          setAddDialog(false);
          setCategoryName("");
        }
      }
    );
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDialog || !categoryName.trim()) return;
    
    updateCategory(
      { id: editDialog.id, data: { name: categoryName.trim() } },
      {
        onSuccess: () => {
          setEditDialog(null);
          setCategoryName("");
        }
      }
    );
  };

  const handleDelete = () => {
    if (!deleteDialog) return;
    
    deleteCategory(deleteDialog.id, {
      onSuccess: () => {
        setDeleteDialog(null);
      }
    });
  };

  const openAdd = () => {
    setCategoryName("");
    setAddDialog(true);
  };

  const openEdit = (id: string, currentName: string) => {
    setCategoryName(currentName);
    setEditDialog({ id, name: currentName });
  };

  const columns = [
    {
      header: "Category Name",
      accessorKey: "name",
      cell: (item: Category) => <span className="font-medium">{item.name}</span>
    },
    {
      header: "Properties Count",
      accessorKey: "count",
      cell: (item: Category & { _count?: { properties: number } }) => <span className="text-muted-foreground">{item._count?.properties || 0}</span>
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (item: Category) => (
        <div className="flex gap-2 justify-end">
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 w-8 p-0"
            onClick={() => openEdit(item.id, item.name)}
            title="Edit Category"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 border-destructive/20"
            onClick={() => setDeleteDialog({ id: item.id, name: item.name })}
            title="Delete Category"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Category Management</h1>
          <p className="text-muted-foreground mt-1">Manage property categories (e.g. Apartment, House).</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-12 bg-muted/50 rounded-lg animate-pulse" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted/20 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-xl border overflow-hidden shadow-sm max-w-3xl">
          <DataTable 
            data={categories} 
            columns={columns} 
            keyExtractor={(item) => item.id}
            className="border-0 shadow-none rounded-none"
          />
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={addDialog} onOpenChange={(open) => {
        setAddDialog(open);
        if (!open) setCategoryName("");
      }}>
        <DialogContent>
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new property category.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category Name</label>
                <Input 
                  placeholder="E.g. Villa" 
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddDialog(false)} disabled={isCreating}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating || !categoryName.trim()}>
                {isCreating ? "Adding..." : "Add Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editDialog} onOpenChange={(open) => {
        if (!open) {
          setEditDialog(null);
          setCategoryName("");
        }
      }}>
        <DialogContent>
          <form onSubmit={handleUpdate}>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>
                Update the name for this category.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category Name</label>
                <Input 
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditDialog(null)} disabled={isUpdating}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating || !categoryName.trim()}>
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={(open) => !open && setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the &quot;{deleteDialog?.name}&quot; category? This action cannot be undone. You cannot delete a category if properties are currently using it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteDialog(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
