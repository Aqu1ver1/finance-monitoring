import React, { Fragment, useState, useEffect } from 'react'
import { Transition } from '@headlessui/react';
import { useCategoriesStore } from '../customCategories.store';
import { defaultIcons } from '../../../shared/config/defaultIcons';
import { Button } from '../../../shared/ui/Button';
import type { Category } from '../../../entities/categories/categoryConfig';

interface EditCategoryCardProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null; // Передаём категорию для редактирования
}

const EditCategoryCard: React.FC<EditCategoryCardProps> = ({
  isOpen,
  onClose,
  category
}) => {
    const { editCategory, deleteCategory } = useCategoriesStore();
    const [formData, setFormData] = useState({
    category: '',
    type: 'expense' as 'expense' | 'income',
    iconUrl: '',
    budgetType: 'needs' as 'needs' | 'wants' | 'savings'
  });

    useEffect(() => {
    if (category) {
      setFormData({
        category: category.category,
        type: category.type,
        iconUrl: category.iconUrl,
        budgetType: category.budgetType
      });
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    editCategory(category.id, {
      category: formData.category,
      type: formData.type,
      iconUrl: formData.iconUrl,
      budgetType: formData.budgetType
    });
    
    onClose();
  };
    const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    deleteCategory(category.id);
    
    onClose();
  };

  if (!category) return null;
    return (
        <Transition
            show={isOpen}
            as={Fragment}
            enter="transition ease-out duration-300 transform"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-200 transform"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
        >
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="relative w-full max-w-md bg-gray-200 rounded-2xl shadow-lg p-6">
                    {/* Крестик закрытия */}
                    <button
                        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-lg font-bold"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                    {/* Заголовок */}
                    <h2 className="text-xl font-semibold mb-4 text-gray-900">Редактирование категории</h2>

                    {/* Контент */}
                    <div className='flex flex-col gap-2'>
                        <label >Название</label>
                        <input
                            type="text"
                            placeholder="Например: Здоровье"
                            value={formData.category}
                            onChange={(e) =>
                                setFormData({ ...formData, category: e.target.value })
                            }
                            className="w-full  p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                        <label>Тип</label>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant={formData.type === "expense" ? "danger" : "secondary"}
                                fullWidth
                                onClick={() => setFormData({ ...formData, type: "expense" })}
                            >
                                Расход
                            </Button>
                            <Button
                                type="button"
                                variant={formData.type === "income" ? "success" : "secondary"}
                                fullWidth
                                onClick={() => setFormData({ ...formData, type: "income" })}
                            >
                                Доход
                            </Button>
                        </div>
                        <div>
                            <label>Бюджетный тип</label>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant={formData.budgetType === "needs" ? "primary" : "secondary"}
                                    fullWidth
                                    onClick={() => setFormData({ ...formData, budgetType: "needs" })}
                                >
                                    Необходимые
                                </Button>
                                <Button
                                    type="button"
                                    variant={formData.budgetType === "wants" ? "primary" : "secondary"}
                                    fullWidth
                                    onClick={() => setFormData({ ...formData, budgetType: "wants" })}
                                >
                                    Развлечения
                                </Button>
                                <Button
                                    type="button"
                                    variant={formData.budgetType === "savings" ? "primary" : "secondary"}
                                    fullWidth
                                    onClick={() => setFormData({ ...formData, budgetType: "savings" })}
                                >
                                    Сбережения
                                </Button>
                            </div>
                        </div>
                        <div>
                            <label>Иконка</label>
                            <div className="grid grid-cols-7 gap-2 mt-2">
                                {defaultIcons.map((iconItem) => {
                                    return (
                                        <Button
                                            type="button"
                                            variant={formData.iconUrl === iconItem.iconUrl ? "primary" : "ghost"}
                                            size="sm"
                                            onClick={() => setFormData({ ...formData, iconUrl: iconItem.iconUrl })}
                                            className="w-10 h-10 p-0"
                                        >
                                            <img src={iconItem.iconUrl} alt={iconItem.name} className="w-6 h-6" />
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button
                                type="button"
                                variant="primary"
                                fullWidth
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Удалить категорию
                            </Button>
                            <Button
                                type="button"
                                variant="primary"
                                fullWidth
                                onClick={handleSubmit}
                                disabled={!formData.category || !formData.iconUrl}
                            >
                                Сохранить изменения
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    );
}
export default EditCategoryCard;