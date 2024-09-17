import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
//   { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'destination',
    headerName: 'Dest',
    width: 150,
    editable: true,
  },
  {
    field: 'startDate',
    headerName: 'Travel Date',
    width: 150,
    editable: true,
    valueGetter: (value, row) => `${new Date(value)}`
  },
  {
    field: 'noOfNights',
    headerName: 'Nights',
    type: 'number',
    width: 110,
    editable: true,
  },
  {
    field: 'Pax',
    headerName: 'Pax',
    width: 110,
    editable: true,
    valueGetter: (value, row) => `${row.adultPax} Adults - ${row.childPax || 0} Child`
  },
  {
    field: 'pickUp',
    headerName: 'Pick Up',
    width: 110,
    editable: true,
  },
  {
    field: 'starCategory',
    headerName: 'Hotel Category',
    width: 110,
    editable: true,
    valueGetter: (value) => `${value?.label}`
  },
  {
    field: 'trackingId',
    headerName: 'Tracking Id',
    width: 110,
    editable: true,
  },
//   {
//     field: 'fullName',
//     headerName: 'Full name',
//     description: 'This column has a value getter and is not sortable.',
//     sortable: false,
//     width: 160,
//     valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
//   },
];

// const rows = [
//   { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
//   { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
//   { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
//   { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
//   { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//   { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//   { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//   { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//   { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
// ];

const ReqsListTable = ({reqsList = [] }) => {
    console.log("req list table", reqsList)
    return (
        <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
            rows={reqsList}
            columns={columns}
            initialState={{
            pagination: {
                paginationModel: {
                pageSize: 5,
                },
            },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
        />
        </Box>
    );
}

export default ReqsListTable;