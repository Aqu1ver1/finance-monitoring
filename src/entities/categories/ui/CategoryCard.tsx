// import React from 'react'
// import type { Category } from '../categoryConfig'

// const CategoryCard = (category: Category,selectedCategory) => {
//     return (
//         <button
//             key={category.id}
//             type="button"
//             onClick={() => setSelectedCategory(category.id)}
//             className={`p-4 rounded-2xl transition-all duration-200 border-2 ${isSelected
//                 ? "bg-primary/5 border-primary shadow-[0_0_0_1px_var(--color-primary)]"
//                 : "bg-secondary/50 border-transparent hover:border-muted"
//                 }`}
//         >
//             <div
//                 className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 transition-colors ${isSelected ? "bg-primary text-primary-foreground" : "bg-background"
//                     }`}
//             >
//                 {IconComponent && (
//                     <IconComponent
//                         className="w-6 h-6"
//                         style={{ color: isSelected ? "inherit" : category.color }}
//                     />
//                 )}

//             </div>
//             <p className={`text-[10px] font-medium text-center uppercase tracking-wider ${isSelected ? "text-primary" : "text-muted-foreground"
//                 }`}>
//                 {category.category}
//             </p>
//         </button>
//     )
// }

// export default CategoryCard