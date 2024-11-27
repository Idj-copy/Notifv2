import {useState} from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Category, SubCategory} from '../types/category';

interface EditCategoryDialogProps {
  category: Category;
  onSave: (category: Category) => void;
  onClose: () => void;
}

export default function EditCategoryDialog({ category, onSave, onClose }: EditCategoryDialogProps) {
  const [editedCategory, setEditedCategory] = useState<Category>({ ...category });
  const [newSubcategory, setNewSubcategory] = useState({ name: '' });

  const handleSave = () => {
    onSave(editedCategory);
    onClose();
  };

  const addSubcategory = () => {
    if (newSubcategory.name) {
      const newSub: SubCategory = {
        id: `sub-${Date.now()}`,
        name: newSubcategory.name
      };

      setEditedCategory(prev => ({
        ...prev,
        subcategories: [...(prev.subcategories || []), newSub]
      }));

      setNewSubcategory({ name: '' });
    }
  };

  const removeSubcategory = (subId: string) => {
    setEditedCategory(prev => ({
      ...prev,
      subcategories: prev.subcategories?.filter(sub => sub.id !== subId)
    }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white border-gray-800">
        <DialogHeader>
          <DialogTitle>Modifier la catégorie</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nom</Label>
            <Input
              value={editedCategory.name}
              onChange={(e) => setEditedCategory(prev => ({ ...prev, name: e.target.value }))}
              className="bg-gray-800 border-gray-700"
            />
          </div>

          <div className="space-y-2">
            <Label>Icône</Label>
            <Input
              value={editedCategory.icon}
              onChange={(e) => setEditedCategory(prev => ({ ...prev, icon: e.target.value }))}
              className="bg-gray-800 border-gray-700"
            />
          </div>

          <div className="space-y-2">
            <Label>Sous-catégories</Label>
            <div className="space-y-2">
              {editedCategory.subcategories?.map(sub => (
                <div key={sub.id} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                  <span>{sub.name}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeSubcategory(sub.id)}
                  >
                    Supprimer
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={newSubcategory.name}
                onChange={(e) => setNewSubcategory({ name: e.target.value })}
                placeholder="Nouvelle sous-catégorie"
                className="bg-gray-800 border-gray-700"
              />
              <Button onClick={addSubcategory}>
                Ajouter
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
