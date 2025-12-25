import { useCurrencyStore } from "../../features/settings/currency/model/currency.store";

export const useCurrency = () => {
    return useCurrencyStore(state => state.selectedCurrency);
}

export default useCurrency