import { useState, useCallback } from 'react';

import { Report } from '@libs/common-models';

import { IDatasets } from '../QlikPinWall';

const useReportsGroupByDataset = () => {
  const [qAction, setQAction] = useState<any>({
    loading: false,
    qResponse: null,
    error: null,
  });

  const setReportsByDataset = useCallback((pinwallReports: Report[]) => {
    const sortedReports: IDatasets[] = [];
    pinwallReports.forEach((report: any) => {
      const index = sortedReports.findIndex(
        (r) => r.dsTitle === report?.dataset?.title
      );
      if (sortedReports.length && index !== -1) {
        sortedReports[index].reports.push(report);
      } else {
        sortedReports.push({
          dsId: report?.dataset?.id,
          dsTitle: report?.dataset?.title || '',
          reports: [report],
        });
      }
    });

    setQAction({ loading: false, qResponse: { sortedReports }, error: null });
    return sortedReports;
  }, []);

  return { qAction, setReportsByDataset };
};

export default useReportsGroupByDataset;
