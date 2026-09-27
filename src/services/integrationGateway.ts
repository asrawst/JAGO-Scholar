import { IntegrationServiceConfig, IntegrationStatus } from '../types';

export class IntegrationGateway {
  private static config: IntegrationServiceConfig = {
    digiLocker: 'SUCCESS',
    nsp: 'SUCCESS',
    sfmp: 'SUCCESS',
    nos: 'SUCCESS',
    udise: 'SUCCESS',
    apaar: 'SUCCESS',
    pfmsDbt: 'SUCCESS',
    incomeAuthority: 'SUCCESS'
  };

  static getConfig(): IntegrationServiceConfig {
    return { ...this.config };
  }

  static setStatus(serviceKey: keyof IntegrationServiceConfig, status: IntegrationStatus) {
    this.config[serviceKey] = status;
  }

  static resetAllToSuccess() {
    this.config = {
      digiLocker: 'SUCCESS',
      nsp: 'SUCCESS',
      sfmp: 'SUCCESS',
      nos: 'SUCCESS',
      udise: 'SUCCESS',
      apaar: 'SUCCESS',
      pfmsDbt: 'SUCCESS',
      incomeAuthority: 'SUCCESS'
    };
  }

  /**
   * Simulates calling a government integration endpoint.
   * If config has MISMATCH or TIMEOUT or UNAVAILABLE, it responds accordingly.
   */
  static async executeMockCall<T>(
    serviceKey: keyof IntegrationServiceConfig,
    serviceName: string,
    successData: T,
    latencyMs: number = 0
  ): Promise<{ success: boolean; data?: T; error?: string; status: IntegrationStatus }> {
    const currentStatus = this.config[serviceKey];

    if (latencyMs > 0) {
      await new Promise(r => setTimeout(r, latencyMs));
    }

    if (currentStatus === 'TIMEOUT') {
      return {
        success: false,
        error: `Gateway Timeout (504): ${serviceName} service did not respond within timeout window. Automated retry scheduled.`,
        status: 'TIMEOUT'
      };
    }

    if (currentStatus === 'UNAVAILABLE') {
      return {
        success: false,
        error: `Service Unavailable (503): ${serviceName} portal is undergoing scheduled maintenance. Please try again later.`,
        status: 'UNAVAILABLE'
      };
    }

    if (currentStatus === 'MISMATCH') {
      return {
        success: false,
        error: `Data Discrepancy (422): ${serviceName} record mismatch detected between applicant declaration and registry. Routed to exception queue.`,
        status: 'MISMATCH'
      };
    }

    return {
      success: true,
      data: successData,
      status: 'SUCCESS'
    };
  }
}
