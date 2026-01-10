import { ChevronRight, Languages } from "lucide-react";
import { useState } from "react";
import { useLanguageStore } from "../language.store";

interface LanguageDictionary {
    [key: string]: string;
}
const LanguagesList: LanguageDictionary = {
    "ru": "Русский",
    "en": "English",
};


const LanguageSwitcher = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { lang, setLang } = useLanguageStore();
    return (
        <div>
            <button
                className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors"
                onClick={() => setIsOpen(prev => !prev)}
            >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Languages className="w-5 h-5 text-blue-600" />
                </div>

                <div className="flex-1 text-left">
                    <p>{lang}</p>
                    <p className="text-sm text-muted-foreground">
                        {LanguagesList[lang]}
                    </p>
                </div>

                <ChevronRight
                    className={`w-5 h-5 text-muted-foreground transition-transform 
                        ${isOpen ? "rotate-90" : ""}`}
                />
            </button>

            {isOpen && (
                <div className="flex flex-col gap-3 p-3 w-full">
                    {Object.keys(LanguagesList).map(lang => (
                        <div
                            key={lang}
                            className="cursor-pointer text-primary border border-border rounded-lg shadow-lg px-4 py-2 hover:bg-primary/10 transition-colors"
                            onClick={() => {
                                setLang(lang as 'ru' | 'en');
                                setIsOpen(false);
                            }}
                        >
                            {LanguagesList[lang]} ({lang})
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
