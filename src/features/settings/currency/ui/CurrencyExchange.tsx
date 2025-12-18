import { ChevronRight, Globe } from "lucide-react";
import { useState } from "react";
import { useCurrencyStore } from "../model/currency.store";

interface CurrencyDictionary {
  [key: string]: string;
}

const Currency: CurrencyDictionary = {
  "€": "Эвро",
  "$": "Доллар",
  "₽": "Рубль",
  "₴": "Гривна",
};

const CurrencyExchange = () => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedCurrency = useCurrencyStore(state => state.selectedCurrency);
  const setCurrency = useCurrencyStore(state => state.setCurrency);

  return (
    <div>
      <button
        className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors"
        onClick={() => setIsOpen(prev => !prev)}
      >
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <Globe className="w-5 h-5 text-green-600" />
        </div>

        <div className="flex-1 text-left">
          <p>Валюта</p>
          <p className="text-sm text-muted-foreground">
            {Currency[selectedCurrency]} ({selectedCurrency})
          </p>
        </div>

        <ChevronRight
          className={`w-5 h-5 text-muted-foreground transition-transform ${
            isOpen ? "rotate-90" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="flex flex-col gap-3 p-3 w-full">
          {Object.keys(Currency).map(symbol => (
            <div
              key={symbol}
              className="cursor-pointer text-primary border border-border rounded-lg shadow-lg px-4 py-2 hover:bg-primary/10 transition-colors"
              onClick={() => {
                setCurrency(symbol);
                setIsOpen(false);
              }}
            >
              {Currency[symbol]} ({symbol})
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrencyExchange;
