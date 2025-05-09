import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FolderTree, Plus, Edit, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Mock data
const mockCategories = [
  {
    id: "1",
    name: "Travel",
    type: "global",
    parentId: null,
    countries: [],
    children: [
      {
        id: "2",
        name: "Airfare",
        type: "global",
        parentId: "1",
        countries: [],
        children: []
      },
      {
        id: "3",
        name: "Accommodation",
        type: "global",
        parentId: "1",
        countries: [],
        children: []
      }
    ]
  },
  {
    id: "4",
    name: "Meals",
    type: "global",
    parentId: null,
    countries: [],
    children: [
      {
        id: "5",
        name: "Business Meals",
        type: "global",
        parentId: "4",
        countries: [],
        children: []
      },
      {
        id: "6",
        name: "Per Diem",
        type: "local",
        parentId: "4",
        countries: ["USA", "Canada"],
        children: []
      }
    ]
  },
  {
    id: "7",
    name: "Office Supplies",
    type: "global",
    parentId: null,
    countries: [],
    children: []
  },
  {
    id: "8",
    name: "VAT Expenses",
    type: "local",
    parentId: null,
    countries: ["United Kingdom", "France", "Germany", "Italy", "Spain"],
    children: [
      {
        id: "9",
        name: "Reduced Rate Items",
        type: "local",
        parentId: "8",
        countries: ["United Kingdom", "France"],
        children: []
      },
      {
        id: "10",
        name: "Standard Rate Items",
        type: "local",
        parentId: "8",
        countries: ["United Kingdom", "France", "Germany", "Italy", "Spain"],
        children: []
      }
    ]
  }
];

// Flatten categories for table view
const flattenCategories = (categories: any[], level = 0, result: any[] = []) => {
  categories.forEach(category => {
    result.push({
      ...category,
      level
    });
    
    if (category.children && category.children.length > 0) {
      flattenCategories(category.children, level + 1, result);
    }
  });
  
  return result;
};

const CategoryManager = () => {
  const [categories, setCategories] = useState(mockCategories);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<any>(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    type: "global",
    parentId: "",
    countries: []
  });
  
  const countries = [
    "USA", "Canada", "United Kingdom", "France", "Germany", 
    "Italy", "Spain", "Japan", "China", "Australia"
  ];
  
  const flatCategories = flattenCategories(categories);
  
  const handleAddCategory = () => {
    setIsEditing(false);
    setNewCategory({
      name: "",
      type: "global",
      parentId: "",
      countries: []
    });
    setDialogOpen(true);
  };
  
  const handleEditCategory = (category: any) => {
    setIsEditing(true);
    setCurrentCategory(category);
    setNewCategory({
      name: category.name,
      type: category.type,
      parentId: category.parentId || "",
      countries: category.countries || []
    });
    setDialogOpen(true);
  };
  
  const handleDeleteCategory = (categoryId: string) => {
    // In a real app, this would need to handle cascading deletes or moving children
    toast.success("Category deleted successfully");
  };
  
  const handleSaveCategory = () => {
    // In a real app, this would update the database
    if (isEditing) {
      toast.success(`Category "${newCategory.name}" updated successfully`);
    } else {
      toast.success(`Category "${newCategory.name}" added successfully`);
    }
    setDialogOpen(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Category Management</h1>
        <Button onClick={handleAddCategory}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Expense Categories</CardTitle>
          <CardDescription>
            Manage global and country-specific expense categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Countries</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flatCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <span 
                        className="inline-block" 
                        style={{ marginLeft: `${category.level * 20}px` }}
                      >
                        {category.level > 0 && "└ "}
                        {category.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={category.type === "global" ? "default" : "outline"}>
                      {category.type === "global" ? "Global" : "Local"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {category.countries && category.countries.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {category.countries.slice(0, 2).map((country: string) => (
                          <Badge key={country} variant="secondary" className="text-xs">
                            {country}
                          </Badge>
                        ))}
                        {category.countries.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{category.countries.length - 2} more
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">All countries</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditCategory(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Add/Edit Category Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Category" : "Add Category"}
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Update the details for this category" 
                : "Create a new expense category"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="type" className="text-right text-sm font-medium">
                Type
              </label>
              <Select
                value={newCategory.type}
                onValueChange={(value) => setNewCategory({...newCategory, type: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Global</SelectItem>
                  <SelectItem value="local">Local</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="parent" className="text-right text-sm font-medium">
                Parent
              </label>
              <Select
                value={newCategory.parentId}
                onValueChange={(value) => setNewCategory({...newCategory, parentId: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select parent category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Top Level)</SelectItem>
                  {flatCategories.filter(c => !c.parentId).map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {newCategory.type === "local" && (
              <div className="grid grid-cols-4 items-start gap-4">
                <label className="text-right text-sm font-medium pt-2">
                  Countries
                </label>
                <div className="col-span-3 flex flex-wrap gap-2">
                  {countries.map(country => (
                    <Badge 
                      key={country}
                      variant={newCategory.countries.includes(country) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        if (newCategory.countries.includes(country)) {
                          setNewCategory({
                            ...newCategory, 
                            countries: newCategory.countries.filter(c => c !== country)
                          });
                        } else {
                          setNewCategory({
                            ...newCategory, 
                            countries: [...newCategory.countries, country]
                          });
                        }
                      }}
                    >
                      {country}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button type="submit" onClick={handleSaveCategory}>
              {isEditing ? "Update Category" : "Add Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManager;
