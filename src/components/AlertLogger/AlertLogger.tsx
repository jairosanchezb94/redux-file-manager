import { Alert, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type AlertLoggerProps = {
  type: 'log' | 'warn' | 'error';
  message: string;
  onClose?: () => void;
};

const AlertLogger: React.FC<AlertLoggerProps> = ({ type, message, onClose }) => {
  let severity: 'success' | 'warning' | 'error' | 'info';

  switch (type) {
    case 'log':
      severity = 'info';
      break;
    case 'warn':
      severity = 'warning';
      break;
    case 'error':
      severity = 'error';
      break;
    default:
      severity = 'info';
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Alert
        severity={severity}
        action={
          onClose && (
            <IconButton aria-label="close" color="inherit" size="small" onClick={onClose}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          )
        }
      >
        {message}
      </Alert>
    </Box>
  );
};

export default AlertLogger;