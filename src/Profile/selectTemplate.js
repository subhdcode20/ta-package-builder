import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { useSelector, useDispatch } from 'react-redux';
import useMediaQuery from '@mui/material/useMediaQuery';

import { templatesMap, defaultTemplate } from "../PdfTemplates/templateList.js";
import { selectTemplate } from '../PackageBuilder/packBuilderSlice.js';

const templates = [
  {
    thumbnail: '/Kerala2.png',
    name: 'Kerala',
    width: '30%',
  },
  {
    thumbnail: '/static/images/buttons/burgers.jpg',
    name: 'Default',
    width: '30%',
  }
];

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
      opacity: 0.15,
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
  opacity: 0.4,
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

export default function ButtonBaseDemo() {
    const userData = useSelector((state) => state.packBuilderData.userData);
    const templateName = userData?.templateName || "Default";
    let selectedTemplate = templatesMap[templateName.toLowerCase()];
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

    const dispatch = useDispatch();

    const handleSelectTemplate = (selectedData = null) => {
        // update 'templateName' in userProfileData

        // update selected data in store.
        dispatch(selectTemplate(selectedData));
    }
    
  console.log("select temiplate ", selectedTemplate, userData);
  return (<>
    <Typography variant='caption' >Select Template for PDF</Typography>
    <Box sx={{ display: 'flex', flexWrap: 'no-wrap', minWidth: 300, width: '100%' }}>
        {Object.values(templatesMap).map((image, iIndex) => {
            console.log("image- ", image, image.thumbnail, defaultTemplate);
            return (
            <ImageButton
            focusRipple
            key={image.name}
            style={{
                width: isMobile ? '20%' : "30%",
                border: selectedTemplate?.name == image.name ? '5px solid green' : '3px solid lightgrey',
                borderRadius: '5px',
                marginRight: '4px'
            }}
            onClick={() => handleSelectTemplate(image, iIndex)}
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
        )})}
    </Box>
</>);
}