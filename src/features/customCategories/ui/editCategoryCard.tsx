import React, { Fragment, useState, useEffect } from 'react'
import { Transition } from '@headlessui/react';
import { useCustomCategoriesStore } from '../customCategories.store';
import { defaultIcons } from '../../../shared/config/defaultIcons';
import { Button } from '../../../shared/ui/Button';
import type { Category } from '../../../shared/config/defaultCategories';
import { useTransactionsStore } from '../../../entities/transactions/transactions.store';
import { useTranslate } from '../../swapLanguages/useTranslate';

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
    const { editCategory, deleteCategory } = useCustomCategoriesStore();
    const transactionWithCategory = useTransactionsStore(state => state.transactions.find(tr => tr.id_category === category?.id));
    const t = useTranslate();
    const [formData, setFormData] = useState({
    category: '',
    type: 'expense' as 'expense' | 'income',
    iconUrl: '',
    budgetType: 'needs' as 'needs' | 'wants' | 'savings'| ''
  });

    useEffect(() => {
    if (category) {
      setFormData({
        category: category.category,
        type: category.type,
        iconUrl: category.iconUrl,
        budgetType: category.budgetType || ''
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
    if(transactionWithCategory != null) {
        alert(t('customCategories.deleteBlocked'));
        return;
    };
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
                <div className="relative w-full max-w-md bg-secondary/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-muted transition-colors duration-300">
                    {/* Крестик закрытия */}
                    <button
                        className="absolute top-3 right-3 text-muted-foreground hover:text-primary text-lg font-bold transition-colors"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                    {/* Заголовок */}
                    <h2 className="text-xl font-semibold mb-4 text-primary">{t('customCategories.titleEdit')}</h2>

                    {/* Контент */}
                    <div className='flex flex-col gap-2'>
                        <label className="text-primary">{t('customCategories.nameLabel')}</label>
                        <input
                            type="text"
                            placeholder={t('customCategories.namePlaceholder')}
                            value={formData.category}
                            onChange={(e) =>
                                setFormData({ ...formData, category: e.target.value })
                            }
                            className="w-full p-2 bg-background text-primary border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                        />
                        <label className="text-primary">{t('customCategories.typeLabel')}</label>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant={formData.type === "expense" ? "danger" : "secondary"}
                                fullWidth
                                onClick={() => setFormData({ ...formData, type: "expense" })}
                            >
                                {t('customCategories.typeExpense')}
                            </Button>
                            <Button
                                type="button"
                                variant={formData.type === "income" ? "success" : "secondary"}
                                fullWidth
                                onClick={() => setFormData({ ...formData, type: "income" })}
                            >
                                {t('customCategories.typeIncome')}
                            </Button>
                        </div>
                        <div>
                            <label className="text-primary">{t('customCategories.budgetTypeLabel')}</label>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant={formData.budgetType === "needs" ? "primary" : "secondary"}
                                    fullWidth
                                    onClick={() => setFormData({ ...formData, budgetType: "needs" })}
                                >
                                    {t('customCategories.budgetTypeNeeds')}
                                </Button>
                                <Button
                                    type="button"
                                    variant={formData.budgetType === "wants" ? "primary" : "secondary"}
                                    fullWidth
                                    onClick={() => setFormData({ ...formData, budgetType: "wants" })}
                                >
                                    {t('customCategories.budgetTypeWants')}
                                </Button>
                                <Button
                                    type="button"
                                    variant={formData.budgetType === "savings" ? "primary" : "secondary"}
                                    fullWidth
                                    onClick={() => setFormData({ ...formData, budgetType: "savings" })}
                                >
                                    {t('customCategories.budgetTypeSavings')}
                                </Button>
                            </div>
                        </div>
                        <div>
                            <label className="text-primary">{t('customCategories.iconLabel')}</label>
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
                                {t('customCategories.deleteButton')}
                            </Button>
                            <Button
                                type="button"
                                variant="primary"
                                fullWidth
                                onClick={handleSubmit}
                                disabled={!formData.category || !formData.iconUrl}
                            >
                                {t('customCategories.saveButton')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    );
}
export default EditCategoryCard;