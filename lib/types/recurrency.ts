export type RecurrencyValue = 'none' | 'weekly' | 'monthly';

export interface RecurrencyOption {
    value: RecurrencyValue,
    label: string
}

export const recurrencyOptions: RecurrencyOption[] = [
    {
        value: 'none',
        label: 'Fără recurență'
    },
    {
        value: "weekly",
        label: "Săptămânal"
    },
    {
        value: "monthly",
        label: "Lunar"
    }
]