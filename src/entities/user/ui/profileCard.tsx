import { useState } from "react"
import { SignUpFormModal } from "../../../features/addUser/ui/sirnUpForm"
import { useUserStore } from "../../../features/addUser/user.store"
import type { SignUpData } from "../../../features/addUser/ui/sirnUpForm"
import { User } from "lucide-react"
import { UpdateFormModal, type UpdateData } from "../../../features/addUser/ui/updateForm"

const ProfileCard = () => {
    const [isSignUpOpen, setIsSignUpOpen] = useState(false)
    const [isUpdateOpen, setIsUpdateOpen] = useState(false)
    const register = useUserStore((s) => s.register)
    const updateUser = useUserStore((s) => s.updateUser)
    const user = useUserStore((s) => s.user)
    const handleSignUp = (data: SignUpData) => {
        register(data)
    }
        const handleUpdateUser = (data: UpdateData) => {
        updateUser(data)
    }
    return (
        <div className="bg-linear-to-br from-indigo-600 to-blue-700 text-white rounded-4xl p-6 shadow-lg shadow-blue-500/20">
            {user == null ? <div className="flex flex-col gap-2">
                <h2 className="text-xl">Профиль</h2>
                <p>Вы еще не зарегистрированы, пора начать</p>
                <button className="w-full py-3 bg-white/90 hover:bg-white/80 rounded-2xl text-blue-600 font-medium transition-all active:scale-95"
                    onClick={() => setIsSignUpOpen(true)}>
                    Регистация
                </button>
            </div> :
                <div>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <p className="text-xl font-semibold">{user?.fullName}</p>
                            <p className="text-blue-100 text-sm opacity-80 font-light">{user?.email}</p>
                        </div>
                    </div>
                    <button className="mt-5 w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium backdrop-blur-sm border border-white/10 transition-all active:scale-95"
                        onClick={() => setIsUpdateOpen(true)}>
                        Редактировать профиль
                    </button>
                </div>
            }
            <SignUpFormModal
                isOpen={isSignUpOpen}
                onClose={() => setIsSignUpOpen(false)}
                onSignUp={handleSignUp}
            />
            <UpdateFormModal
                isOpen={isUpdateOpen}
                onClose={() => setIsUpdateOpen(false)}
                onUpdate={handleUpdateUser}
            />
        </div>
    )
}

export default ProfileCard