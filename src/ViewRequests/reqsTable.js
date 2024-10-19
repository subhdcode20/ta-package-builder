import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';

const ReqsListTable = ({ reqsList = [] }) => {
  const [tableData, setTableData] = React.useState([]);
  const [expandedRow, setExpandedRow] = React.useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!reqsList) return;
    setTableData(reqsList.map((dd) => dd));
  }, [reqsList]);

  const handleCopy = (reqId) => {
    console.log('REQID: ', reqId);
    navigate(`/request/${reqId}/edit`);
  };

  const handleCopyNew = (reqId) => {
    console.log('REQID: ', reqId);
    navigate(`/request/${reqId}/copy-new`);
  };

  const toggleExpandRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const columns = [
    {
      field: 'expand',
      headerName: '',
      width: 50,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={() => toggleExpandRow(params.row.id)}
        >
          <ExpandMoreIcon />
        </IconButton>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created On',
      width: 150,
      editable: false,
      valueGetter: (value, row) => `${format(new Date(value), "dd-MMM-yyyy")}`
    },
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
      valueGetter: (value, row) => `${format(new Date(value), "dd-MMM-yyyy")}`,
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
      headerName: 'Actions',
      width: 250,
      editable: true,
      renderCell: (params) => (
        params.row.reqId ? (
          <div>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() => handleCopy(params.row.reqId)}
            >
              Edit
            </Button>
            &nbsp;
            <Button
              size="small"
              variant="contained"
              color="secondary"
              onClick={() => handleCopyNew(params.row.reqId)}
            >
              Copy to New Package
            </Button>
          </div>
        ) : null
      ),
    },
  ];

  return (
    <Box sx={{ margin: 'auto', height: 400, width: '100%' }}>
      <DataGrid
        rows={tableData}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[7]}
        disableRowSelectionOnClick
      />
      {tableData.map((row) => (
        <Collapse in={expandedRow === row.id} key={row.id}>
          <Box sx={{ padding: 2, border: '1px solid #ddd', marginBottom: 2 }}>
            <strong>Packages:</strong>
            <ul>
              {row.packages?.map((packageId) => (
                <li key={packageId}>{packageId}</li>
              )) || 'No Packages'}
            </ul>
          </Box>
        </Collapse>
      ))}
    </Box>
  );
};

export default ReqsListTable;
