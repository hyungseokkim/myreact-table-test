import React from 'react';
import styled from 'styled-components';
import { useTable, useSortBy, Column, useBlockLayout } from 'react-table';
import makeData , {PersonData} from './makeData';
import { FixedSizeList } from 'react-window';


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

function Table({ columns, data } : any){
  const defaultColumn = React.useMemo(
    () => ({
        width: 150,
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
    } = useTable(
      {
        columns,
        data,
        defaultColumn,
      },
      useBlockLayout
      ,useSortBy
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
              <div {...column.getHeaderProps(column.getSortByToggleProps())} className="th">
                {column.render('Header')}
                <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                </span>
              </div>
            ))}
          </div>
        ))}
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
    </div>
  )
}


interface Props {
};

const UseReactTable :  React.FC<Props> = () => {
    const columns: Column<PersonData>[] = React.useMemo(
      () => [
        {
          Header: 'Row Index',
          accessor: (row, i) => i,
        },
        {
          Header: 'Name',
          columns: [
            {
              Header: 'First Name',
              accessor: 'firstName',
            },
            {
              Header: 'Last Name',
              accessor: 'lastName',
            },
          ],
        },
        {
          Header: 'Info',
          columns: [
            {
              Header: 'Age',
              accessor: 'age',
              sortType: 'basic'
            },
            {
              Header: 'Visits',
              accessor: 'visits',
              sortType: 'basic'
            },
            {
              Header: 'Status',
              accessor: 'status',
              sortType: 'basic'
            },
            {
              Header: 'Profile Progress',
              accessor: 'progress',
              sortType: 'basic'
            },
          ],
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

export default UseReactTable;