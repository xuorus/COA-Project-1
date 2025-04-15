import React, { useRef, useMemo } from 'react';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';

const StablePDFViewer = React.memo(({ data, isPreview }) => {
  const iframeRef = useRef(null);
  const pdfUrl = useMemo(() => {
    if (!data) return '';
    return `data:application/pdf;base64,${data}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;
  }, [data]);

  return (
    <Box 
      sx={{ 
        width: '100%', 
        height: '100%', 
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: isPreview ? 'transparent' : 'grey.100',
        borderRadius: isPreview ? 1 : 0,
      }}
    >
      <iframe
        ref={iframeRef}
        src={pdfUrl}
        width="100%"
        height="100%"
        style={{ 
          border: 'none',
          pointerEvents: isPreview ? 'none' : 'auto',
          transform: isPreview ? 'scale(1.45)' : 'none',
          transformOrigin: 'center center',
        }}
        title="PDF Viewer"
        frameBorder="0"
        scrolling="no"
      />
    </Box>
  );
}, (prev, next) => prev.data === next.data && prev.isPreview === next.isPreview);

StablePDFViewer.propTypes = {
  data: PropTypes.string,
  isPreview: PropTypes.bool
};

StablePDFViewer.defaultProps = {
  data: '',
  isPreview: false
};

StablePDFViewer.displayName = 'StablePDFViewer';

export default StablePDFViewer;