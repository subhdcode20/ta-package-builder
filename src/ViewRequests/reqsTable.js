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
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import PackageData from './packageData';

const ReqsListTable = ({ reqsList = [] }) => {
  const [tableData, setTableData] = React.useState([]);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [packageDetails, setPackageDetails] = React.useState(null);
  const [selectedRequestData, setSelectedRequestData] = React.useState(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!reqsList) return;
    setTableData(reqsList.map((dd) => dd));
  }, [reqsList]);

  const handleCopy = (reqId) => {
    navigate(`/request/${reqId}/edit`);
  };

  const handleCopyNew = (reqId) => {
    navigate(`/request/${reqId}/copy-new`);
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
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Select</TableCell>
              <TableCell>Created On</TableCell>
              <TableCell>Dest</TableCell>
              <TableCell>Travel Date</TableCell>
              <TableCell>Nights</TableCell>
              <TableCell>Pick Up</TableCell>
              <TableCell>Hotel Category</TableCell>
              <TableCell>Adult</TableCell>
              <TableCell>Child</TableCell>
              <TableCell>Tracking ID</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Radio
                    checked={selectedRow === row.id}
                    onChange={() => selectRow(row.id, row.packages)}
                  />
                </TableCell>
                <TableCell>{format(new Date(row.createdAt), 'dd-MMM-yyyy')}</TableCell>
                <TableCell>{row.destination}</TableCell>
                <TableCell>{format(new Date(row.startDate), 'dd-MMM-yyyy')}</TableCell>
                <TableCell>{row.noOfNights}</TableCell>
                <TableCell>{row.pickUp}</TableCell>
                <TableCell>{row.starCategory?.label}</TableCell>
                <TableCell>{row.adultPax}</TableCell>
                <TableCell>{row.childPax}</TableCell>
                <TableCell>{row.trackingId}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => handleCopy(row.reqId)}
                  >
                    Edit
                  </Button>
                  &nbsp;
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    onClick={() => handleCopyNew(row.reqId)}
                  >
                    Copy to New Package
                  </Button>
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
      {selectedRow && (
        <Collapse in={!!selectedRow}>
          <PackageData packageDetails={packageDetails} reqData={selectedRequestData} />
        </Collapse>
      )}
    </Box>
  );
};

export default ReqsListTable;
