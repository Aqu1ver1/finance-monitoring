import React, { Fragment, useState } from 'react'
import { Transition } from '@headlessui/react';
import { availableIcons, availableColors } from '../model/defaultCategories';
import { useCategoriesStore } from '../model/customCategories.store';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    setIsModalOpen?: (isOpen: boolean) => void;
    title?: string;
}

const AddCategoryCard: React.FC<ModalProps> = ({ isOpen, onClose, title }) => {
    const [newCategory, setNewCategory] = useState({
        name: "",
        type: "expense" as "expense" | "income",
        iconIndex: 0,
        colorIndex: 0,
    });
    const addCategory = useCategoriesStore(state => state.addCategory);
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addCategory({
            category: newCategory.name,
            type: newCategory.type,
            icon: availableIcons[newCategory.iconIndex].icon,
            color: availableColors[newCategory.colorIndex].value,
        });
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
                            value={newCategory.name}
                            onChange={(e) =>
                                setNewCategory({ ...newCategory, name: e.target.value })
                            }
                            className="w-full  p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                        <label>Тип</label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    setNewCategory({ ...newCategory, type: "expense" })
                                }
                                className={`flex-1 py-2 rounded-xl transition-colors ${newCategory.type === "expense"
                                    ? "bg-red-500 text-white"
                                    : "bg-muted/30"
                                    }`}
                            >
                                Расход
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    setNewCategory({ ...newCategory, type: "income" })
                                }
                                className={`flex-1 py-2 rounded-xl transition-colors ${newCategory.type === "income"
                                    ? "bg-green-500 text-white"
                                    : "bg-muted/30"
                                    }`}
                            >
                                Доход
                            </button>
                        </div>
                        <div>
                            <label>Иконка</label>
                            <div className="grid grid-cols-7 gap-2 mt-2">
                                {availableIcons.map((iconItem, index) => {
                                    const Icon = iconItem.icon;
                                    return (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() =>
                                                setNewCategory({ ...newCategory, iconIndex: index })
                                            }
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${newCategory.iconIndex === index
                                                ? "bg-blue-500 text-white"
                                                : "bg-muted/30 hover:bg-muted/50"
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div>
                    <label>Цвет</label>
                    <div className="grid grid-cols-7 gap-2 mt-2">
                      {availableColors.map((colorItem, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() =>
                            setNewCategory({ ...newCategory, colorIndex: index })
                          }
                          className={`w-10 h-10 rounded-xl transition-all ${
                            newCategory.colorIndex === index
                              ? "ring-2 ring-offset-2 ring-blue-500"
                              : ""
                          }`}
                          style={{ backgroundColor: colorItem.value }}
                        />
                      ))}
                    </div>
                  </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                Добавить категорию
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    );
}

export default AddCategoryCard