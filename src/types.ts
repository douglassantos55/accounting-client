export enum AccountType {
    Asset = 1,
    Liability,
    Equity,
    Dividend,
    Expense,
    Revenue,
}

function toMap(source: object): { id: number, value: string }[] {
    const items = [];
    const keys = Object.keys(source).filter(v => !isNaN(parseInt(v)));
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i] as keyof typeof source;
        items.push({ id: key, value: source[key] });
    }
    return items;
}

export const TYPES = toMap(AccountType);

export type Account = {
    ID: number;
    name: string;
    type: AccountType;
    parent_id: number;
    parent: Account | null;
    children: Account[] | null;
}

export type Customer = {
    ID: number;
    Name: string;
    Email: string;
    Cpf: string;
    Phone: string;
    Address: Address;
}

export type Address = {
    Street: string;
    Postcode: string;
    Neighborhood: string;
    State: string;
    City: string;
    Number: string;
}
