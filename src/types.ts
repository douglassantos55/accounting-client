export enum AccountType {
    Asset,
    Liability,
    Equity,
    Dividend,
    Expense,
    Revenue,
}

export type Account = {
    ID: number;
    name: string;
    type: AccountType;
    parent: Account | null;
    children: Account[] | null;
}

