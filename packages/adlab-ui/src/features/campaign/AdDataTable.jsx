import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { useTableColumnSizing_unstable } from '@fluentui/react-components';
import {
  createTableColumn,
  makeStyles,
  mergeClasses,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Table,
  TableBody,
  TableCell,
  TableCellLayout,
  TableHeader,
  TableHeaderCell,
  TableRow,
  tfsuiTheme,
  useTableFeatures,
} from '@tfs/ui-components-next';
import { keys, startCase } from 'lodash';

import { FlexDiv, Text } from '../../components/styled';

const useClasses = makeStyles({
  tableHeader: {
    borderBottom: `1px solid ${tfsuiTheme.colorPalettePlatinumForeground2}`,
    backgroundColor: tfsuiTheme.colorPalettePlatinumBackground2,
    paddingTop: tfsuiTheme.spacingVerticalXS,
  },
  tableRow: {
    cursor: 'pointer',
  },
  tableCellLayoutText: {
    width: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  tableErrorRow: {
    backgroundColor: tfsuiTheme.colorPaletteMarigoldBackground2,
  },
  popoverSurface: {
    backgroundColor: tfsuiTheme.colorBrandStroke2Contrast,
    width: '460px',
    maxHeight: '450px',
    overflowY: 'auto',
  },
  popoverSurfaceError: {
    backgroundColor: tfsuiTheme.colorStatusWarningBorder1,
  },
  persistBackground: {
    backgroundColor: tfsuiTheme.colorBrandStroke2,
  },
  persistErrorBackground: {
    backgroundColor: tfsuiTheme.colorNeutralStrokeOnBrand,
  },
});

const TableHeaderComponent = React.memo(({ headers, sizingOptions }) => {
  const classes = useClasses();
  const tableHeaderRef = useRef(null);

  return (
    <TableHeader ref={tableHeaderRef} className={classes.tableHeader}>
      <TableRow>
        {headers.map((column) => (
          <TableHeaderCell key={column} {...sizingOptions.getTableHeaderCellProps(column)}>
            <Text bd>{startCase(column)}</Text>
          </TableHeaderCell>
        ))}
      </TableRow>
    </TableHeader>
  );
});
TableHeaderComponent.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string),
  sizingOptions: PropTypes.object,
};
TableHeaderComponent.displayName = 'TableHeaderComponent';

const RecordPopover = React.memo(({ children, record, error, isErrorRecord }) => {
  const classes = useClasses();
  const recordRef = useRef(null);
  const [showPopover, setShowPopover] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (recordRef.current && !recordRef.current.contains(event.target)) {
        setShowPopover(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [recordRef]);

  return (
    <Popover withArrow>
      <PopoverTrigger disableButtonEnhancement>
        <FlexDiv
          ref={recordRef}
          onClick={() => setShowPopover(!showPopover)}
          className={mergeClasses(
            isErrorRecord && classes.popoverSurfaceError,
            showPopover && (!isErrorRecord ? classes.persistBackground : classes.persistErrorBackground),
          )}
        >
          {children}
        </FlexDiv>
      </PopoverTrigger>

      <PopoverSurface
        tabIndex={-1}
        className={mergeClasses(classes.popoverSurface, isErrorRecord && classes.popoverSurfaceError)}
      >
        {isErrorRecord ? (
          <Text caption1 bd>
            {typeof error === 'string' ? error : `${error.type}: ${error.message}`}
          </Text>
        ) : (
          <FlexDiv
            column
            styles={css`
              align-items: flex-start;
            `}
          >
            {keys(record).map((key) => (
              <Text caption1 key={key}>
                <b>{startCase(key)}</b>: {record[key]}
              </Text>
            ))}
          </FlexDiv>
        )}
      </PopoverSurface>
    </Popover>
  );
});
RecordPopover.propTypes = {
  children: PropTypes.node,
  record: PropTypes.object,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  isErrorRecord: PropTypes.bool,
};
RecordPopover.displayName = 'RecordPopover';

const AdDataTable = ({ adsInfo, validationErrors = {} }) => {
  const classes = useClasses();
  const headers = useMemo(() => adsInfo.meta.fields, [adsInfo]);

  const columns = useMemo(() => {
    return adsInfo.meta.fields.map((field) =>
      createTableColumn({
        columnId: field,
      }),
    );
  }, [adsInfo]);

  const columnSizingOptions = useMemo(() => {
    return headers.reduce(
      (acc, field) => ({
        ...acc,
        [field]: { idealWidth: 200, minWidth: 200 },
      }),
      {},
    );
  }, [headers]);

  const { getRows, columnSizing_unstable, tableRef } = useTableFeatures(
    {
      columns,
      items: adsInfo.data,
    },
    [
      useTableColumnSizing_unstable({
        columnSizingOptions,
        autoFitColumns: false,
      }),
    ],
  );

  const rows = getRows();
  const errorRows = useMemo(
    () =>
      adsInfo.errors.reduce(
        (acc, error) => ({
          ...acc,
          [error.row]: error,
        }),
        {},
      ),
    [adsInfo],
  );

  return (
    <Table
      size="extra-small"
      sortable
      arial-label="Default table"
      ref={tableRef}
      {...columnSizing_unstable.getTableProps()}
      noNativeElements={true}
    >
      <TableHeaderComponent headers={headers} sizingOptions={columnSizing_unstable} />
      <TableBody>
        {rows.map(({ item }) => (
          <RecordPopover
            key={item.row}
            record={item}
            error={errorRows[item.row - 1] || validationErrors[item.row]?.join(', ')}
            isErrorRecord={
              keys(errorRows).includes((item.row - 1).toString()) ||
              keys(validationErrors).includes(item.row.toString())
            }
          >
            <TableRow
              key={item.row}
              className={mergeClasses(
                classes.tableRow,
                keys(errorRows).includes((item.row - 1).toString()) && classes.tableErrorRow,
              )}
            >
              {headers.map((field) => (
                <TableCell key={field} {...columnSizing_unstable.getTableCellProps(field)}>
                  <TableCellLayout>
                    <Text caption1 className={classes.tableCellLayoutText}>
                      {item[field]}
                    </Text>
                  </TableCellLayout>
                </TableCell>
              ))}
            </TableRow>
          </RecordPopover>
        ))}
      </TableBody>
    </Table>
  );
};

AdDataTable.propTypes = {
  adsInfo: PropTypes.shape({
    data: PropTypes.array,
    errors: PropTypes.array,
    meta: PropTypes.object,
  }),
  validationErrors: PropTypes.object,
};

export default React.memo(AdDataTable);
