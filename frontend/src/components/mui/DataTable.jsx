import { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';

export function DataTable({
  data,
  columns,
  isLoading = false,
  searchPlaceholder = 'Search...',
  onSearch,
  pagination,
  filters,
  emptyMessage = 'No data found',
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (value) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <Box className="animate-fade-in-up">
      {/* Toolbar */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 2.5,
          alignItems: { sm: 'center' },
          justifyContent: 'space-between',
        }}
      >
        {onSearch && (
          <TextField
            size="small"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            sx={{ maxWidth: { sm: 320 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
        )}
        {filters && <Box sx={{ display: 'flex', gap: 1 }}>{filters}</Box>}
      </Box>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          overflowX: 'auto',
          borderRadius: 3,
          border: '1px solid rgba(204, 251, 241, 0.5)',
        }}
      >
        <Table sx={{ minWidth: { xs: 600, sm: 'auto' } }}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  sx={{
                    backgroundColor: '#f0fdfa',
                    borderBottom: '2px solid #ccfbf1',
                  }}
                >
                  {column.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  sx={{ height: 240, textAlign: 'center', border: 'none' }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                    <CircularProgress size={36} thickness={4} />
                    <Typography variant="body2" color="text.secondary">
                      Loading data...
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  sx={{ height: 240, textAlign: 'center', border: 'none' }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h4" sx={{ opacity: 0.15 }}>📋</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {emptyMessage}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, idx) => (
                <TableRow
                  key={item.id}
                  hover
                  sx={{
                    backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(240, 253, 250, 0.3)',
                    '&:hover': {
                      backgroundColor: 'rgba(204, 251, 241, 0.25) !important',
                    },
                    '&:last-child td': { borderBottom: 'none' },
                  }}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render
                        ? column.render(item)
                        : item[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 2.5,
            px: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            Page {pagination.page} of {pagination.totalPages}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={() =>
                pagination.onPageChange(pagination.page - 1)
              }
              disabled={pagination.page <= 1}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                width: 36,
                height: 36,
              }}
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() =>
                pagination.onPageChange(pagination.page + 1)
              }
              disabled={pagination.page >= pagination.totalPages}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                width: 36,
                height: 36,
              }}
            >
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
}
