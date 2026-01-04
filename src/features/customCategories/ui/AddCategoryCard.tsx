import React, { Fragment, useState } from 'react'
import { Transition } from '@headlessui/react';
import { useCategoriesStore } from '../customCategories.store';
import { defaultIcons } from '../../../shared/config/defaultIcons';
import { Button } from '../../../shared/ui/Button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    setIsModalOpen?: (isOpen: boolean) => void;
    title?: string;
}

const AddCategoryCard: React.FC<ModalProps> = ({ isOpen, onClose, title }) => {
    const [newCategory, setNewCategory] = useState({
        category: "",
        type: "expense" as "expense" | "income",
        iconUrl: "",
        budgetType: 'needs' as 'needs' | 'wants' | 'savings'
    });
    const addCategory = useCategoriesStore(state => state.addCategory);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addCategory({
            category: newCategory.category,
            type: newCategory.type,
            iconUrl: newCategory.iconUrl,
            budgetType: newCategory.budgetType
        });
        console.log(newCategory);
        onClose();
    };
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
                    {title && <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{title}</h2>}

                    {/* Контент */}
                    <div className='flex flex-col gap-2'>
                        <label >Название</label>
                        <input
                            type="text"
                            placeholder="Например: Здоровье"
                            value={newCategory.category}
                            onChange={(e) =>
                                setNewCategory({ ...newCategory, category: e.target.value })
                            }
                            className="w-full  p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                        <label>Тип</label>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant={newCategory.type === "expense" ? "danger" : "secondary"}
                                fullWidth
                                onClick={() => setNewCategory({ ...newCategory, type: "expense" })}
                            >
                                Расход
                            </Button>
                            <Button
                                type="button"
                                variant={newCategory.type === "income" ? "success" : "secondary"}
                                fullWidth
                                onClick={() => setNewCategory({ ...newCategory, type: "income" })}
                            >
                                Доход
                            </Button>
                        </div>
                        <div>
                            <label>Бюджетный тип</label>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant={newCategory.budgetType === "needs" ? "primary" : "secondary"}
                                    fullWidth
                                    onClick={() => setNewCategory({ ...newCategory, budgetType: "needs" })}
                                >
                                    Необходимые
                                </Button>
                                <Button
                                    type="button"
                                    variant={newCategory.budgetType === "wants" ? "primary" : "secondary"}
                                    fullWidth
                                    onClick={() => setNewCategory({ ...newCategory, budgetType: "wants" })}
                                >
                                    Развлечения
                                </Button>
                                <Button
                                    type="button"
                                    variant={newCategory.budgetType === "savings" ? "primary" : "secondary"}
                                    fullWidth
                                    onClick={() => setNewCategory({ ...newCategory, budgetType: "savings" })}
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
                                            variant={newCategory.iconUrl === iconItem.iconUrl ? "primary" : "ghost"}
                                            size="sm"
                                            onClick={() => setNewCategory({ ...newCategory, iconUrl: iconItem.iconUrl })}
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
                                onClick={handleSubmit}
                                disabled={!newCategory.category || !newCategory.iconUrl}
                            >
                                Добавить категорию
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    );
}
export default AddCategoryCard;