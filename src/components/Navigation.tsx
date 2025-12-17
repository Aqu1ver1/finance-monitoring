import React from 'react'

const Navigation = () => {
    return (
        <nav className=''>
            <div className='h-px min-w-full bg-gray-600'> </div>
            <ul className='flex justify-around text-black p-4 gap-5'>
                <li><a href="#">Главная</a></li>
                <li><a href="#">Бюджет</a></li>
                <li><a href="#">+</a></li>
                <li><a href="#">История</a></li>
                <li><a href="#">Настройки</a></li>
            </ul>
        </nav>
    )
}

export default Navigation