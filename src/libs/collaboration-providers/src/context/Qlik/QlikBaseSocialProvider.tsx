import React, { useEffect, useState, FC, useCallback, ReactNode } from 'react';

import { useLocation } from 'react-router-dom';
import { usePromise } from 'react-use';

import { visualizationService } from '@libs/collaboration-services';
import { storage, KEYS } from '@libs/common-utils';
import { useQlikApp } from '@libs/qlik-providers';

import {
  QlikBaseSocialContext,
  QlikBaseSocialContextType,
} from './QlikBaseSocialContext';

interface QlikBaseSocialProviderProps {
  value?: QlikBaseSocialContextType;
  qlikAppId?: string;
  visComponentId?: string;
  vizReportId?: number;
  children: ReactNode;
}

export const QlikBaseSocialProvider: FC<QlikBaseSocialProviderProps> = ({
  value,
  qlikAppId,
  visComponentId,
  children,
  vizReportId,
}) => {
  const [visualizationId, setVisualizationID] = useState<any>(null);
  const [reportId, setReportID] = useState<any>(null);

  const qlikAppContext = useQlikApp(qlikAppId);

  const tenantId = storage.load(KEYS.QPLUS_TENANT_ID);
  const customerId = storage.load(KEYS.QPLUS_CUSTOMER_ID);
  const mashupAppId = storage.load(KEYS.QPLUS_MASHUP_APP_ID);

  const appid = qlikAppContext.qAppId;

  const scope = `SOCIAL_${tenantId}_${customerId}_${mashupAppId}`;

  const mounted = usePromise();
  const location = useLocation();
  const pageId = location.pathname;

  const setVisualizationId = useCallback((vId: number) => {
    setVisualizationID(vId);
  }, []);

  const setReportId = useCallback((rId: number) => {
    setReportID(rId);
  }, []);

  useEffect(() => {
    if (!visComponentId) return;
    void (async () => {
      const encodedPageId = pageId.replace('/', '').replace(/\//g, '_');
      try {
        const visualizationRequest = visualizationService.getVisualization({
          appId: appid,
          componentId: visComponentId,
          route: encodedPageId,
        });

        const existingVisualization = await mounted(visualizationRequest);

        setVisualizationId(existingVisualization.id);
      } catch {
        const newVisRequest = visualizationService.createVisualization({
          appId: appid,
          componentId: visComponentId,
          route: encodedPageId,
        });

        const newVisualization = await mounted(newVisRequest);
        if (!newVisualization) {
          console.error('Qplus Error', 'Error setting up social features');
          return;
        }
        setVisualizationId(newVisualization.id);
      }
    })();
  }, [visComponentId]);

  useEffect(() => {
    if (!vizReportId && Number.isNaN(vizReportId) && vizReportId === 0) return;
    try {
      setReportId(Number(vizReportId));
    } catch (error) {
      console.error('Qplus Error', error);
    }
  }, [vizReportId]);

  return (
    <QlikBaseSocialContext.Provider
      value={{
        visualizationId,
        scope,
        qlikAppId: appid,
        visComponentId,
        pageId,
        reportId,
        setVisualizationId,
        setReportId,
        ...value,
      }}
    >
      {children}
    </QlikBaseSocialContext.Provider>
  );
};

export default QlikBaseSocialProvider;
