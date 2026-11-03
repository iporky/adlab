import { useEffect, useRef, useState } from 'react';
import ExcelJS from 'exceljs';
import { isEmpty, keys, values } from 'lodash';
import PapaParser from 'papaparse';

const detectNonUTF8Encoding = (str) => {
  const regex = /\uFFFD/g;
  return regex.test(str);
};

const useParseFileForRecords = (file) => {
  const [isFileParsed, setIsFileParsed] = useState(false);
  const [results, setResults] = useState({ data: [], errors: [], meta: {} });
  const rowCountRef = useRef(undefined);

  useEffect(() => {
    rowCountRef.current = 0;

    if (file && !isFileParsed) {
      try {
        if (file.type === 'application/json') {
          file.text().then((text) => {
            const data = JSON.parse(text);
            setResults({
              data,
              meta: { fields: Object.keys(data[0]), aborted: false },
              errors: [],
            });
          });
        } else if (file.type === 'text/csv') {
          PapaParser.parse(file, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            worker: true,
            step: (currentRow) => {
              if (!isEmpty(keys(currentRow.data))) {
                delete currentRow.data['active'];
                currentRow.data['row'] = ++rowCountRef.current;

                const nonUtf8Fields = keys(currentRow.data).filter((key) =>
                  detectNonUTF8Encoding(currentRow.data[key]),
                );

                if (nonUtf8Fields.length > 0) {
                  currentRow.errors.push({
                    type: 'Non-UTF8',
                    code: 'Non-UTF8',
                    message: `The record contains non-UTF-8 characters in the following fields: ${nonUtf8Fields.join(', ')}`,
                    row: currentRow.data['row'],
                  });
                }

                setResults((results) => ({
                  ...results,
                  data: [...results.data, currentRow.data],
                  errors: isEmpty(results.errors) ? currentRow.errors : results.errors,
                  ...(!results.meta.fields && {
                    meta: {
                      ...currentRow.meta,
                      fields: ['row', ...currentRow.meta.fields.filter((field) => field !== 'active')],
                    },
                  }),
                }));
              }
            },
          });
        } else {
          const workbook = new ExcelJS.Workbook();
          const reader = new FileReader();

          reader.onload = async (event) => {
            const buffer = event.target.result;

            await workbook.xlsx.load(buffer, {
              parserOptions: {
                header: true,
                strictColumnHandling: true,
                ignoreEmpty: true,
                raw: true,
              },
            });

            const worksheet = workbook.worksheets[0];

            const rows = [];
            let headers;
            let errors = {};

            worksheet.eachRow((row, rowNumber) => {
              const rowData = {};
              const errorFields = [];
              row.eachCell((cell, colNumber) => {
                if (rowNumber === 1) {
                  headers = row.values.slice(1);
                  headers[0] = 'row';
                } else {
                  const header = headers[colNumber - 1];
                  rowData[header] = cell.value;
                  if (detectNonUTF8Encoding(cell.value)) {
                    errorFields.push(header);
                  }
                }
              });
              rowData['row'] = ++rowCountRef.current;
              if (!isEmpty(errorFields)) {
                errors[rowNumber] = {
                  type: 'Non-UTF8',
                  code: 'Non-UTF8',
                  message: `The record contains non-UTF-8 characters in the field: ${errorFields.join(', ')}`,
                  row: rowNumber,
                };
              }

              if (rowNumber !== 1) {
                rows.push(rowData);
              }
            });

            setResults({
              data: rows,
              meta: { fields: headers, aborted: false },
              errors: isEmpty(errors) ? [] : values(errors),
            });
          };

          reader.readAsArrayBuffer(file);
        }
        setIsFileParsed(true);
      } catch (err) {
        setResults((results) => ({
          data: [],
          error: [err],
          meta: { ...results.meta, aborted: true },
        }));
      }
    }
  }, [file, isFileParsed]);

  return [
    results,
    () => {
      setResults({ data: [], errors: [], meta: {} });
      setIsFileParsed(false);
    },
  ];
};

export default useParseFileForRecords;
