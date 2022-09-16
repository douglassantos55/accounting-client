export enum AccountType {
    Asset,
    Liability,
    Equity,
    Dividend,
    Expense,
    Revenue,
}

export const TYPES = Object.values(AccountType).filter(v => typeof v !== "number");

export type Account = {
    ID: number;
    name: string;
    type: AccountType;
    parent: Account | null;
    children: Account[] | null;
}

