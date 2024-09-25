import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';


const ReqsListTable = ({ reqsList = [] }) => {

  const navigate = useNavigate();

  const handleCopy = (reqId) => {
    console.log("REQID: ", reqId);
    navigate(`/request/${reqId}/edit`)
  };
  const handleCopyNew = (reqId) => {
    console.log("REQID: ", reqId);
    navigate(`/request/${reqId}/copy-new`)
  };

  const columns = [
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
      valueGetter: (value, row) => `${new Date(value)}`,
    },
    {
      field: 'noOfNights',
      headerName: 'Nights',
      type: 'number',
      width: 110,
      editable: true,
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
      valueGetter: (value) => `${value?.label}`,
    },
    {
      field: 'adultPax',
      headerName: 'Adult',
      width: 110,
      editable: true,
    },
    {
      field: 'childPax',
      headerName: 'Child',
      width: 110,
      editable: true,
    },
    {
      field: 'trackingId',
      headerName: 'Tracking ID',
      width: 110,
      editable: true,
    },
    {
      field: '',
      headerName: '',
      width: 250,
      editable: true,
      renderCell: (params) => (
        params.row.reqId ? (
          <div>
            <Button size="small" variant="contained" color="primary" onClick={() => handleCopy(params.row.reqId)}>
              Edit
            </Button>
            <Button size="small" variant="contained" color="secondary" onClick={() => handleCopyNew(params.row.reqId)}>
              Copy to New Package
            </Button>
          </div>
        ) : null
      ),
    },
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

  console.log("req list table", reqsList)
  return (
    <Box sx={{ margin: "auto", height: 400, width: "100%" }}>
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
        pageSizeOptions={[7]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}

export default ReqsListTable;