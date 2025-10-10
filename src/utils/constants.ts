import {
	keycloakAuthEndpoint,
	keycloakTokenEndpoint,
	keycloakUserInfoEndpoint,
	oneSignalClient,
	sentryDSN,
} from './ip';

/** Trình độ đào tạo: Đại học */
export const initTrinhDo = APP_CONFIG_INIT_TRINH_DO;

/** Hình thức đào tạo: Chính quy */
export const initHinhThuc = APP_CONFIG_INIT_HINH_THUC;

// Các endpoint KHÔNG gắn x-data-partition-code
export const excludedPaths = [
	APP_CONFIG_KEYCLOAK_AUTHORITY,
	keycloakAuthEndpoint,
	keycloakTokenEndpoint,
	keycloakUserInfoEndpoint,
	sentryDSN,
	oneSignalClient,
].filter(Boolean);
