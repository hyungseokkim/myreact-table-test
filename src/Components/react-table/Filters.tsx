import * as React from 'react'
import {
    Cell,
    CellProps,
    Column,
    FilterProps,
    FilterValue,
    HeaderGroup,
    HeaderProps,
    Hooks,
    IdType,
    Row,
    UseColumnOrderInstanceProps,
    UseColumnOrderState,
    useExpanded,
    UseExpandedInstanceProps,
    UseExpandedOptions,
    UseExpandedRowProps,
    UseExpandedState,
    useFilters,
    UseFiltersColumnOptions,
    UseFiltersColumnProps,
    UseFiltersInstanceProps,
    UseFiltersOptions,
    UseFiltersState,
    useGlobalFilter,
    UseGlobalFiltersColumnOptions,
    UseGlobalFiltersInstanceProps,
    UseGlobalFiltersOptions,
    UseGlobalFiltersState,
    useGroupBy,
    UseGroupByCellProps,
    UseGroupByColumnOptions,
    UseGroupByColumnProps,
    UseGroupByInstanceProps,
    UseGroupByOptions,
    UseGroupByRowProps,
    UseGroupByState,
    usePagination,
    UsePaginationInstanceProps,
    UsePaginationOptions,
    UsePaginationState,
    UseResizeColumnsColumnOptions,
    UseResizeColumnsColumnProps,
    UseResizeColumnsOptions,
    UseResizeColumnsState,
    useRowSelect,
    UseRowSelectInstanceProps,
    UseRowSelectOptions,
    UseRowSelectRowProps,
    UseRowSelectState,
    UseRowStateCellProps,
    UseRowStateInstanceProps,
    UseRowStateOptions,
    UseRowStateRowProps,
    UseRowStateState,
    useSortBy,
    UseSortByColumnOptions,
    UseSortByColumnProps,
    UseSortByInstanceProps,
    UseSortByOptions,
    UseSortByState,
    useTable,
} from 'react-table';
import matchSorter from "match-sorter"
//import {Data} from "./Data";

interface Data{
    any: any;
}

// Define a default UI for filtering
function DefaultColumnFilter({ column: { filterValue, preFilteredRows, setFilter } }: FilterProps<Data>) {
    const count = preFilteredRows.length;

    return (
        <input
            value={filterValue || ''}
            onChange={e => {
                setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
            }}
            placeholder={`Search ${count} records...`}
        />
    );
}

// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({ column: { filterValue, setFilter, preFilteredRows, id } }: FilterProps<Data>) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = React.useMemo(() => {
        const options = new Set<any>();
        preFilteredRows.forEach(row => {
            options.add(row.values[id]);
        });
        return [...Array.from(options.values())];
    }, [id, preFilteredRows]);

    // Render a multi-select box
    return (
        <select
            value={filterValue}
            onChange={e => {
                setFilter(e.target.value || undefined);
            }}
        >
            <option value="">All</option>
            {options.map((option, i) => (
                <option key={i} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
}

// This is a custom filter UI that uses a
// slider to set the filter value between a column's
// min and max values
function SliderColumnFilter({ column: { filterValue, setFilter, preFilteredRows, id } }: FilterProps<Data>) {
    // Calculate the min and max
    // using the preFilteredRows

    const [min, max] = React.useMemo(() => {
        let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
        let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
        preFilteredRows.forEach(row => {
            min = Math.min(row.values[id], min);
            max = Math.max(row.values[id], max);
        });
        return [min, max];
    }, [id, preFilteredRows]);

    return (
        <>
            <input
                type="range"
                min={min}
                max={max}
                value={filterValue || min}
                onChange={e => {
                    setFilter(parseInt(e.target.value, 10));
                }}
            />
            <button onClick={() => setFilter(undefined)}>Off</button>
        </>
    );
}

// This is a custom UI for our 'between' or number range
// filter. It uses two number boxes and filters rows to
// ones that have values between the two
function NumberRangeColumnFilter({ column: { filterValue = [], preFilteredRows, setFilter, id } }: FilterProps<Data>) {
    const [min, max] = React.useMemo(() => {
        let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
        let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
        preFilteredRows.forEach(row => {
            min = Math.min(row.values[id], min);
            max = Math.max(row.values[id], max);
        });
        return [min, max];
    }, [id, preFilteredRows]);

    return (
        <span
            style={{
                display: 'flex',
            }}
        >
            <input
                value={filterValue[0] || ''}
                type="number"
                onChange={e => {
                    const val = e.target.value;
                    setFilter((old: any[] = []) => [val ? parseInt(val, 10) : undefined, old[1]]);
                }}
                placeholder={`Min (${min})`}
                style={{
                    width: '30%',
                    marginRight: '0.5rem',
                }}
            />
            to
            <input
                value={filterValue[1] || ''}
                type="number"
                onChange={e => {
                    const val = e.target.value;
                    setFilter((old: any[] = []) => [old[0], val ? parseInt(val, 10) : undefined]);
                }}
                placeholder={`Max (${max})`}
                style={{
                    width: '30%',
                    marginLeft: '0.5rem',
                }}
            />
        </span>
    );
}

function fuzzyTextFilterFn<T extends object>(rows: Array<Row<T>>, id: IdType<T>, filterValue: FilterValue) {
    // return matchSorter(rows, filterValue, {
    //     keys: [(row: Row<any>) => row.values[id]],
    // });
    return rows;
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val: any) => !val;


// Define a custom filter filter function!
function filterGreaterThan(rows: Array<Row<any>>, id: Array<IdType<any>>, filterValue: FilterValue) {
    return rows.filter(row => {
        const rowValue = row.values[id[0]];
        return rowValue >= filterValue;
    });
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = (val: any) => typeof val !== 'number';

export { DefaultColumnFilter, SliderColumnFilter, SelectColumnFilter, NumberRangeColumnFilter, fuzzyTextFilterFn, filterGreaterThan };