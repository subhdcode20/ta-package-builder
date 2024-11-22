import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Collapse from '@mui/material/Collapse';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import Radio from '@mui/material/Radio';
import PackageData from './packageData';

const ReqsListTable = ({ reqsList = [] }) => {
  const [tableData, setTableData] = React.useState([]);
  const [expandedRow, setExpandedRow] = React.useState(null);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [packageDetails, setPackageDetails] = React.useState(null);
  const [selectedRequestData, setSelectedRequestData] = React.useState(null); 
  const navigate = useNavigate();

  console.log("CHECKPACKAGE_DATA:", selectedRequestData);

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
  const selectRow = async (id, packages) => {
    setSelectedRow(id);
    const selectedReq = tableData.find((row) => row.id === id);
    setSelectedRequestData(selectedReq);
    if (packages?.length) {
      const packageData = await Promise.all(
        packages.map(async (packageId) => {
          const docRef = doc(db, 'packages', packageId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            return docSnap.data();
          } else {
            return { error: 'No such document' };
          }
        })
      );
      setPackageDetails(packageData);
    } else {
      setPackageDetails(null);
    }
  };

  const columns = [
    {
      field: 'select',
      headerName: '',
      width: 50,
      renderCell: (params) => (
        <Radio
          checked={selectedRow === params.row.id}
          onChange={() => selectRow(params.row.id, params.row.packages)}
        />
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
            {selectedRow && (
        <Collapse in={!!selectedRow}>
          <PackageData packageDetails={packageDetails} reqData = {selectedRequestData} />
        </Collapse>
      )}
    </Box>
  );
};

export default ReqsListTable;
