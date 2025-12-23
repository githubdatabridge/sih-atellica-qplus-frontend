export type Order = 'asc' | 'desc';
export type SearchKeyValue = number | string | null | undefined | boolean;

export type Searchable = Record<string, SearchKeyValue> & { id: string | number };

export const stableSort = <T>(array: readonly T[], comparator: (a: T, b: T) => number) => {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
};

export const descendingComparator = <T>(a: T, b: T, orderBy: keyof T) => {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getComparator = <T>(order: Order, orderBy: keyof T): ((a: T, b: T) => number) => {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
};

export function searchArray<T extends Searchable>(
    arr: T[],
    searchKeys: string[],
    searchString: string
): T[] {
    if (searchKeys.length === 0) {
        return arr;
    }

    return arr.filter(obj => {
        for (const key of searchKeys) {
            if (
                key !== '' &&
                obj[key] !== undefined &&
                obj[key]?.toString().toLowerCase().includes(searchString.toLowerCase())
            ) {
                return true;
            }
        }

        return false;
    });
}
