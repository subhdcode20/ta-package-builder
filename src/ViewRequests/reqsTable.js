import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import Collapse from '@mui/material/Collapse';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import { doc, getDoc } from 'firebase/firestore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { db } from '../firebaseConfig';
import PackageData from './packageData';
import { useUrlParams } from '../Utility.js';

const ReqsListTable = ({ reqsList = [] }) => {
  const [tableData, setTableData] = React.useState([]);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [packageDetails, setPackageDetails] = React.useState(null);
  const [selectedRequestData, setSelectedRequestData] = React.useState(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const navigate = useNavigate();
  const urlParamsData = useUrlParams();

  React.useEffect(() => {
    if (!reqsList) return;
    setTableData(reqsList.map((dd) => dd));
  }, [reqsList]);

  React.useEffect(() => {
    if(!urlParamsData) return

    if(urlParamsData.get('reqId') && tableData) selectRow(urlParamsData.get('reqId'))
  }, [urlParamsData, tableData])

  const handleCopy = (reqId) => {
    navigate(`/request/${reqId}/edit`);
  };

  const handleCopyNew = (reqId) => {
    navigate(`/request/${reqId}/copy-new`);
  };

  const selectRow = async (id) => {
    setSelectedRow(id);
    const selectedReq = tableData.find((row) => row.id === id);
    if(!selectedReq) return;
    console.log('selected row ', selectedReq)
    setSelectedRequestData(selectedReq);
    let { packages = [] } = selectedReq; 
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ margin: 'auto', width: '100%', overflowX: 'auto' }}>
      <TableContainer>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell><b>Select</b></TableCell>
              <TableCell><b>Created On</b></TableCell>
              <TableCell><b>Dest</b></TableCell>
              <TableCell><b>Travel Date</b></TableCell>
              <TableCell><b>Nights</b></TableCell>
              <TableCell><b>Pick Up</b></TableCell>
              <TableCell><b>Hotel Category</b></TableCell>
              <TableCell><b>Adult</b></TableCell>
              <TableCell><b>Child</b></TableCell>
              <TableCell><b>Tracking ID</b></TableCell>
              <TableCell><b>Package Created</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>

          </TableHead>
          {
            tableData.length == 0 && <Box sx={{ m: 2, display: 'flex', width: 'max-content', justifyContent: 'space-evenly' }}>
              <Typography variant='body2' sx={{ margin: 'auto' }}>No Requests Created Yet! Try Fastest way to a professional Itinerary/Quote pdf</Typography>
              <Button size="small" variant='text' onClick={() => navigate('/home')}>Now!</Button>
            </Box>
          }
          <TableBody>
            {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Radio
                    checked={selectedRequestData?.id === row.id}
                    onChange={() => selectRow(row.id, row.packages)}
                  />
                </TableCell>
                <TableCell>{format(new Date(row.createdAt), 'dd-MMM-yyyy')}</TableCell>
                <TableCell>{row.destination}</TableCell>
                <TableCell>{format(new Date(row.startDate), 'dd-MMM-yyyy')}</TableCell>
                <TableCell>{row.noOfNights}</TableCell>
                <TableCell>{row.pickUp}</TableCell>
                <TableCell>{row.starCategory?.label}</TableCell>
                <TableCell>{row.totalAdults}</TableCell>
                <TableCell>{row.totalChild}</TableCell>
                <TableCell>{row.trackingId}</TableCell>
                <TableCell>
                  {/* {(row.packages && row.packages.length > 0) ? `True (${row.packages.length})` : 'False' } */}
                  {
                    (row.packages && row.packages.length > 0) 
                    ? (<Box display={'flex'} flexDirection={'row'}>
                      <CheckCircleIcon sx={{ color: 'green', marginY: 'auto', fontSize: '15px' }} />
                      {/* <Typography variant='caption' sx={{ marginY: 'auto' }}>{` (${row.packages.length})`}</Typography> */}
                    </Box>)
                    : null
                  }
                </TableCell>
                <TableCell>
                  <Box display={'flex'} flexDirection={'column'} justifyContent={'space-evenly'}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => handleCopy(row.reqId)}
                      sx={{ fontSize: '10px' }}
                    >
                      Edit Request
                    </Button>
                    &nbsp;
                    {
                      (row?.packages || []).length == 0 && (<Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => navigate(`/itinerary/${row.reqId}`)}
                        sx={{ fontSize: '10px' }}
                      >
                        Create Package Pdf
                      </Button>)
                    }
                    &nbsp;
                    {
                      (row?.packages || []).length > 0 && (<Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => navigate(`/itinerary/${row.reqId}`)}
                        sx={{ fontSize: '10px' }}
                      >
                        Update Package Pdf
                      </Button>)
                    }
                    &nbsp;
                    {
                      (row?.packages || []).length > 0 && (<Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => handleCopyNew(row.reqId)}
                        sx={{ fontSize: '10px' }}
                      >
                        Copy to New Package
                      </Button>)
                    }
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                count={tableData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      {selectedRequestData && (
        <Collapse in={!!selectedRequestData}>
          <PackageData packageDetails={packageDetails} reqData={selectedRequestData} />
        </Collapse>
      )}
    </Box>
  );
};

export default ReqsListTable;
