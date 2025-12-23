import { QAuthMode } from '@libs/qlik-models';

import QixCapabilityApi from '../qix/qixCapabilityApi';
import QixEnigmaApi from '../qix/qixEnigmaApi';
import { QsGetConfig } from './qlikConfigService';

interface QsGetService {
  qAuthMode?: QAuthMode;
  qlik?: any;
  config: QsGetConfig;
  onQlikEngineSessionErrorCallback?: any;
}

export { QixCapabilityApi, QixEnigmaApi };
export class QlikService {
  QixCapabilityApi: any;
  QixEnigmaApi: any;

  async setQixCapabilityService(
    service: QsGetService
  ): Promise<QixCapabilityApi> {
    this.QixCapabilityApi = await QixCapabilityApi.initialize(
      service.qAuthMode,
      service.qlik,
      service.config
    );
    return this.QixCapabilityApi as QixCapabilityApi;
  }

  async setQixEnigmaService(service: QsGetService): Promise<QixEnigmaApi> {
    this.QixEnigmaApi = await QixEnigmaApi.initEnigma(
      service.qAuthMode,
      service.config,
      service?.onQlikEngineSessionErrorCallback
    );
    return this.QixEnigmaApi as QixEnigmaApi;
  }

  async setQixInternalEnigmaService(
    environment: QAuthMode
  ): Promise<QixEnigmaApi> {
    this.QixEnigmaApi = await QixEnigmaApi.initInternalEnigma();
    return this.QixEnigmaApi as QixEnigmaApi;
  }
}

export const qlikService = new QlikService();
