import React, {useRef, useEffect, forwardRef} from 'react';
import styled from 'styled-components';
import {  useTable,
          useSortBy,
          Column,
          useBlockLayout,
          TableToggleCommonProps,
          UseRowSelectInstanceProps,
          UseRowSelectRowProps,
          UseTableCellProps,
          useFilters, // useFilters!
          useGlobalFilter,
          useRowSelect,} from 'react-table';
import makeData , {PersonData} from './makeData';
import { FixedSizeList } from 'react-window';
import matchSorter from 'match-sorter';
import { DefaultColumnFilter, SliderColumnFilter, SelectColumnFilter, NumberRangeColumnFilter, fuzzyTextFilterFn,filterGreaterThan } from './react-table/Filters';
import {IndeterminateCheckbox} from './react-table/Checkbox';


const Styles = styled.div`
  padding: 1rem;

  .table {
    display: inline-block;
    border-spacing: 0;
    border: 1px solid black;

    .tr {
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
    }

    .th,
    .td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`

interface IHeaderProps{
  globalFilter: string;
  preGlobalFilteredRows: any;
  setGlobalFilter: (filterValue: unknown) => void;
}

// Define a default UI for filtering
const GlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter
} : IHeaderProps)  => {
  const count = preGlobalFilteredRows.length;

  return (
    <span>
      Search:{' '}
      <input
        value={globalFilter || ''}
        onChange={e => {
          setGlobalFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
        placeholder={`${count} records...`}
      />
    </span>
  );
};




function Table({ columns, data } : any){
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows: any[], id: React.Key, filterValue: any) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    []
  )


  const defaultColumn = React.useMemo(
    () => ({
        Filter: DefaultColumnFilter
      }),
      []
    )

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      totalColumnsWidth,
      prepareRow,
      state,
      visibleColumns,
      preGlobalFilteredRows,
      setGlobalFilter,
      selectedFlatRows,
      state: { selectedRowIds },
    } = useTable(
      {
        columns,
        data,
        defaultColumn, // Be sure to pass the defaultColumn option
        filterTypes,
      },
      useBlockLayout,
      useFilters, // useFilters!
      useGlobalFilter, // useGlobalFilter!
      useSortBy,
      useRowSelect,
      hooks => {
        hooks.visibleColumns.push(columns => [
          // Let's make a column for selection
          {
            id: 'selection',
            // The header can use the table's getToggleAllRowsSelectedProps method
            // to render a checkbox
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <div>
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
              </div>
            ),
            // The cell can use the individual row's getToggleRowSelectedProps method
            // to the render a checkbox
            Cell: ({ row }) => (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
            ),
          },
          ...columns,
        ])
      }
    )

    const RenderRow = React.useCallback(
      ({ index, style }) => {
        const row = rows[index]
        prepareRow(row)
        return (
          <div
            {...row.getRowProps({
              style,
            })}
            className="tr"
          >
            {row.cells.map(cell => {
              return (
                <div {...cell.getCellProps()} className="td">
                  {cell.render('Cell')}
                </div>
              )
            })}
          </div>
        )
      },
      [prepareRow, rows]
    )

   

  //테이블에 UI 렌더링
   // Render the UI for your table
   return (
    <div {...getTableProps()} className="table">
      <div>
        {headerGroups.map(headerGroup => (
          <div {...headerGroup.getHeaderGroupProps()} className="tr">
            {headerGroup.headers.map(column => (
              <div {...column.getHeaderProps()} className="th">
                <div>
                  {/* 컬럼별 소팅 */}
                <span {...column.getSortByToggleProps()}>
                  {column.render('Header')}
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                </span>
                </div>
                {/* 컬럼별 필터 */}
                <div>{column.canFilter ? column.render('Filter') : null}</div>
              </div>
            ))}
          </div>
        ))}
        <div className="tr">
            <div 
              style={{
                textAlign: 'left',
              }} className="th">
                {/* 글로벌 필터 */}
                    <GlobalFilter
                      preGlobalFilteredRows={preGlobalFilteredRows}
                      globalFilter={state.globalFilter}
                      setGlobalFilter={setGlobalFilter}
                    />
            </div>
        </div>
      </div>

      <div {...getTableBodyProps()}>
        <FixedSizeList
          height={400}
          itemCount={rows.length}
          itemSize={35}
          width={totalColumnsWidth}
        >
          {RenderRow}
        </FixedSizeList>
      </div>
      <div>
          <p>Selected Rows: {Object.keys(selectedRowIds).length}</p>
          <pre>
            <code>
              {JSON.stringify(
                {
                  selectedRowIds: selectedRowIds,
                  'selectedFlatRows[].original': selectedFlatRows.map(
                    d => d.original
                  ),
                },
                null,
                2
              )}
            </code>
          </pre>
      </div>
    </div>

  )
}


interface Props {
};


const UseFilterReactTable :  React.FC<Props> = () => {
    const columns: Column<PersonData>[] = React.useMemo(
      () => [
        {
          Header: 'First Name',
          accessor: 'firstName',
        },
        {
          Header: 'Last Name',
          accessor: 'lastName',
        },                
        {
          Header: 'Age',
          accessor: 'age',
          Filter: SliderColumnFilter,
          filter: 'equals',
        },
        {
          Header: 'Visits',
          accessor: 'visits',
          Filter: NumberRangeColumnFilter,
          filter: 'between',
        },
        {
          Header: 'Status',
          accessor: 'status',
          Filter: SelectColumnFilter,
          filter: 'includes',
        },
        {
          Header: 'Profile Progress',
          accessor: 'progress',
          Filter: SliderColumnFilter,
          filter: filterGreaterThan,
        },
          
        
      ],
      []
    )
    
    const data = React.useMemo(() => makeData(100), []);
  
     return (
        <Styles>
          <Table columns={columns} data={data}></Table>
        </Styles>
      )
}

export default UseFilterReactTable;