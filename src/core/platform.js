/** True on macOS and iOS, where shortcuts use ⌘ instead of Ctrl. */
export const IS_APPLE = /mac|iphone|ipad|ipod/i.test(navigator.userAgentData?.platform ?? navigator.platform);
