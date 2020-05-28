import React from 'react';
import styled from 'styled-components';
import { useTable, useSortBy, Column } from 'react-table';
import makeData , {PersonData} from './makeData';

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
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
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  },
    useSortBy
  )
  //테이블에 UI 렌더링
   // Render the UI for your table
   return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              //<th {...column.getHeaderProps()}>
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                 </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}


interface Props {
};

const UseReactTable :  React.FC<Props> = () => {
    const columns: Column<PersonData>[] = React.useMemo(
      () => [
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