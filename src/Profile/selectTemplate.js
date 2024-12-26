import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import Visibility from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { useSelector, useDispatch } from 'react-redux';
import useMediaQuery from '@mui/material/useMediaQuery';

import { templatesMap, defaultTemplate } from "../PdfTemplates/templateList.js";
import { selectTemplate } from '../PackageBuilder/packBuilderSlice.js';
import { AF_THEME_PRIMARY_COLOR, AF_THEME_SECONDARY_COLOR } from '../Constants.js';
import { isEmptyObject } from '../Utility.js';
import { useNavigate } from 'react-router-dom';

// const templates = [
//   {
//     thumbnail: '/Kerala2.png',
//     name: 'Kerala',
//     width: '30%',
//   },
//   {
//     thumbnail: '/static/images/buttons/burgers.jpg',
//     name: 'Default',
//     width: '30%',
//   }
// ];

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  height: 200,
  [theme.breakpoints.down('sm')]: {
    width: '100% !important', // Overrides inline-style
    height: 100,
  },
  '&:hover, &.Mui-focusVisible': {
    zIndex: 1,
    '& .MuiImageBackdrop-root': {
      opacity: 0,
    },
    '& .MuiImageMarked-root': {
      opacity: 0,
    },
    '& .MuiTypography-root': {
      border: '4px solid currentColor',
    },
  },
}));

const ImageSrc = styled('span')({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center 40%',
});

const Image = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.common.white,
}));

const ImageBackdrop = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: theme.palette.common.black,
  opacity: 0.1,
  transition: theme.transitions.create('opacity'),
}));

const ImageMarked = styled('span')(({ theme }) => ({
  height: 3,
  width: 18,
  backgroundColor: theme.palette.common.white,
  position: 'absolute',
  bottom: -2,
  left: 'calc(50% - 9px)',
  transition: theme.transitions.create('opacity'),
}));

export default function ButtonBaseDemo({ setIsBrandEdited }) {
  const userData = useSelector((state) => state.packBuilderData.userData);
  const templateName = userData?.templateName || "Default";
  let selectedTemplate = templatesMap[templateName.toLowerCase()];
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [viewFile, setViewFile] = useState(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleSelectTemplate = (selectedData = null) => {
    if(selectedData?.disabled) return;
    // update 'templateName' in userProfileData
    console.log("change template ", selectedData);
    // update selected data in store.
    dispatch(selectTemplate(selectedData));
    setViewFile(false);
    if(setIsBrandEdited) setIsBrandEdited(true);
  }
    
  console.log("select temiplate ", selectedTemplate, userData);
  return (<>
    <Typography variant='caption' >Select Template for PDF</Typography>
    <Box sx={{ display: 'flex', flexWrap: 'no-wrap', minWidth: 300, width: '100%', overflowX: 'scroll' }}>
      {
        Object.values(templatesMap).map((image, iIndex) => {
          console.log("image- ", image, image.thumbnail, defaultTemplate);
          return (<Box display={'flex'} flexDirection={'column'} justifyContent={'center'}
            sx={{ width: isMobile ? '20%' : "25%", minWidth: '25%', }}
            onClick={() => handleSelectTemplate(image)}
          >
            <ImageButton
              focusRipple
              key={image.name}
              style={{
                  width: '100%',
                  // minWidth: '25%',
                  border: selectedTemplate?.name == image.name ? `8px solid ${AF_THEME_PRIMARY_COLOR}` : '3px solid white',
                  borderRadius: '5px',
                  marginRight: '4px'
              }}
              disabled={image?.disabled}
            >
              <ImageSrc style={{ backgroundImage: `url(${image.thumbnail})` }} />
              <ImageBackdrop className="MuiImageBackdrop-root" />
              <Image>
                  <Typography
                    component="span"
                    variant="subtitle1"
                    color="inherit"
                    sx={(theme) => ({
                        position: 'relative',
                        p: 4,
                        pt: 2,
                        pb: `calc(${theme.spacing(1)} + 6px)`,
                    })}
                  >
                    {image.name}
                    <ImageMarked className="MuiImageMarked-root" />
                  </Typography>
              </Image>
            </ImageButton>
            <IconButton
              sx={{ width: 'fit-content', margin: 'auto' }}
              onClick={(e) => {e.stopPropagation(); e.preventDefault(); setViewFile(image)}}
            >
              <Visibility />
            </IconButton>
          </Box>)
        })
      }
    </Box>
    <Dialog open={!!viewFile && !isEmptyObject(viewFile)} onClose={() => setViewFile(null)} maxWidth="md">
      <DialogTitle>Template Thumbnail</DialogTitle>
      <DialogContent>
        {viewFile?.thumbnail && (
          <Box
            component="img"
            src={viewFile?.thumbnail}
            alt="Viewed File"
            sx={{ width: "100%", maxHeight: "500px", objectFit: "contain" }}
          />
        )}
      </DialogContent>
      <DialogActions>
        { viewFile?.examplePdf && (<Button size="small" onClick={() => navigate(viewFile?.examplePdf, '_blank')}>Open Example Pdf</Button>)}
        &nbsp;&nbsp;&nbsp;
        <Button variant="contained" size="small" onClick={() => handleSelectTemplate(viewFile)}>Apply Template</Button>
      </DialogActions>
    </Dialog>
</>);
}