/**
 * 구글 시트(Apps Script) 웹앱 주소.
 * 비워두면 "이 기기 전용" 모드로 동작합니다. (계정/기록이 해당 브라우저에만 저장)
 * 주소를 넣으면 어느 기기에서든 로그인해서 기록을 이어서 볼 수 있습니다.
 *
 * 예) 'https://script.google.com/macros/s/xxxxxxxx/exec'
 */
const HARDCODED_GAS_URL = 'https://script.google.com/macros/s/AKfycbzXXdYoNvoyauKkW6iCNoIxp6f85iAL3xQQQjyJq5kKRhvyLBF3_mmCyAa2Cpb-grBC/exec';

export const GAS_URL: string = HARDCODED_GAS_URL || process.env.NEXT_PUBLIC_GAS_URL || '';

export const isCloudEnabled = () => GAS_URL.length > 0;
